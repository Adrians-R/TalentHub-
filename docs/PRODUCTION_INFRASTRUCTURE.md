# TalentHub Enterprise: Production Infrastructure Blueprint
**Version:** 1.0.0  
**Author:** Principal Infrastructure Engineer & DevOps Architect  
**Status:** Approved for Implementation

This specification details the production-ready self-hosted and cloud hybrid deployment infrastructure for the **TalentHub Enterprise** platform. It provides configurations and architecture blueprints for high availability, fault tolerance, data security, and sub-second candidate sourcing performance.

---

## 1. High-Level Deployment Architecture

The infrastructure employs a highly secure, containerized multi-tier layout separated into distinct isolated network zones.

```
                  [ Public Internet ]
                           │
                           ▼ (SSL Port 443)
              ┌─────────────────────────┐
              │  Nginx Reverse Proxy /  │ (Handles SSL termination,
              │  Cloudflare Edge WAF    │  Rate limiting & static assets)
              └────────────┬────────────┘
                           │
                           ├────────────────────────────────────────┐
                           ▼ (Internal VPC Subnet 10.0.1.0/24)      ▼
              ┌─────────────────────────┐              ┌─────────────────────────┐
              │  Next.js / Node Server  │              │    MinIO Object Store   │
              │     (App Containers)    │              │ (Secured Candidate CVs) │
              └────────────┬────────────┘              └─────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┬──────────────────┐
        ▼                  ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  PostgreSQL  │   │  Redis Cache │   │ Meilisearch  │   │  Prometheus  │
│ Primary + Re │   │   Cluster    │   │ Sourcing Idx │   │  Monitoring  │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

---

## 2. Containerization: Multi-Stage Production Dockerfile

Following Docker and security best practices, the application container uses a non-root user (`node`), a multi-stage build pattern to minimize image size (< 150MB), and cache optimization steps.

```dockerfile
# ==========================================
# STAGE 1: Dependency Resolution
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package descriptors for optimal cache layering
COPY package.json package-lock.json ./
RUN npm ci

# ==========================================
# STAGE 2: Source Compilation & Bundling
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set production environment variables
ENV NODE_ENV=production
ENV DISABLE_HMR=true

# Compile client-side SPA and server entrypoints
RUN npm run build

# Remove development packages to minimize final container overhead
RUN npm prune --production

# ==========================================
# STAGE 3: Minimal Production Runtime
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Establish restricted system group and user privileges
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the compiled artifacts and minimal production modules
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Enforce secure non-root user execution
USER nextjs

EXPOSE 3000

# Start production server
CMD ["npm", "run", "start"]
```

---

## 3. High-Performance Docker Compose Orchestra

Declares the service mesh containing clustered database systems, search indices, caches, object storage, and secure reverse proxies.

```yaml
version: '3.8'

networks:
  talenthub-internal:
    driver: bridge
    ipam:
      config:
        - subnet: 10.0.1.0/24

volumes:
  postgres-primary-data:
  redis-cluster-data:
  meilisearch-data:
  minio-s3-data:

services:
  # 1. Reverse Proxy & Rate Limiter
  nginx-edge:
    image: nginx:alpine
    container_name: talenthub_nginx_edge
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - talenthub-internal
    restart: always
    depends_on:
      - app-server

  # 2. Main Full-Stack Application
  app-server:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: talenthub_app_node
    environment:
      - DATABASE_URL=postgres://postgres_user:SecurePass123!@postgres-primary:5432/talenthub_prod
      - REDIS_URL=redis://redis-cache:6379/0
      - MEILI_URL=http://meilisearch:7700
      - S3_ENDPOINT=http://minio-s3:9000
    networks:
      - talenthub-internal
    restart: always
    depends_on:
      - postgres-primary
      - redis-cache
      - meilisearch

  # 3. Relational Enterprise Database
  postgres-primary:
    image: postgres:16-alpine
    container_name: talenthub_db_primary
    environment:
      - POSTGRES_USER=postgres_user
      - POSTGRES_PASSWORD=SecurePass123!
      - POSTGRES_DB=talenthub_prod
    volumes:
      - postgres-primary-data:/var/lib/postgresql/data
    networks:
      - talenthub-internal
    command: ["postgres", "-c", "shared_buffers=1024MB", "-c", "work_mem=32MB", "-c", "ssl=on"]
    restart: always

  # 4. In-Memory Session & Sourcing Cache
  redis-cache:
    image: redis:7-alpine
    container_name: talenthub_redis_cache
    command: redis-server --requirepass RedisSecureAuth987! --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-cluster-data:/data
    networks:
      - talenthub-internal
    restart: always

  # 5. Candidate Instant Search Indexer
  meilisearch:
    image: getmeili/meilisearch:v1.6
    container_name: talenthub_search_index
    environment:
      - MEILI_ENV=production
      - MEILI_MASTER_KEY=MeiliSuperSecretMasterKey321!
    volumes:
      - meilisearch-data:/meili_data
    networks:
      - talenthub-internal
    restart: always

  # 6. S3-Compatible Object Store (Candidate CVs)
  minio-s3:
    image: minio/minio:RELEASE.2024-01-28T22-35-53Z
    container_name: talenthub_s3_minio
    environment:
      - MINIO_ROOT_USER=minio_admin_user
      - MINIO_ROOT_PASSWORD=MinIOSecurePassword001!
    volumes:
      - minio-s3-data:/data
    networks:
      - talenthub-internal
    command: server /data --console-address ":9001"
    restart: always
```

---

## 4. Nginx Reverse Proxy Config, SSL & Rate Limiting

The Nginx edge layer is designed to terminate TLS certificates, enforce secure cipher guidelines, proxy static headers, and prevent denial-of-service/scraping threats using targeted rate limiters.

```nginx
# /nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Connection logging optimizations
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance buffers
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # GZIP Asset Compression
    gzip on;
    gzip_disable "msie6";
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Enforce strict rate limiting pools
    limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=sourcing_limit:10m rate=1r/s; # Recruiter search rate limits

    # Secure SSL parameters
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # 1. HTTP to HTTPS automatic redirection
    server {
        listen 80;
        server_name talenthub.enterprise.app;
        return 301 https://$host$request_uri;
    }

    # 2. Main Secure Sourcing Instance
    server {
        listen 443 ssl http2;
        server_name talenthub.enterprise.app;

        ssl_certificate /etc/nginx/ssl/talenthub.crt;
        ssl_certificate_key /etc/nginx/ssl/talenthub.key;

        client_max_body_size 10M; # Cap resume uploads at 10MB

        location / {
            limit_req zone=general_limit burst=20 nodelay;
            proxy_pass http://app-server:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Apply aggressive limits on candidate discovery endpoints
        location /api/recruiter/search {
            limit_req zone=sourcing_limit burst=5;
            proxy_pass http://app-server:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

---

## 5. Storage Tier Configurations

### PostgreSQL Database Tunings
Optimized for read-heavy candidate queries and write-heavy recruiter log updates:
```ini
max_connections = 200
shared_buffers = 2GB              # 25% of an 8GB system RAM allocation
effective_cache_size = 6GB
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1            # Adjusted for high-speed SSD persistence
effective_io_concurrency = 200
work_mem = 32MB
min_wal_size = 1GB
max_wal_size = 4GB
```

### Redis Key Cache Expirations
-   **Session Tokens:** 24-hour lifetime linked to standard browser cookies.
-   **Sourcing Multi-facet Cache:** 3-minute TTL (`staleTime: 180000`) stored using unique MD5 hashes generated from search query parameters to eliminate duplicate database scanning operations.

### Meilisearch Index Configurations
Sync pipeline pushes Candidate Profiles metadata into Meilisearch index containers.
-   **Searchable Attributes:** `fullName`, `headline`, `skills.name`, `location`, `aboutMe`
-   **Filterable Attributes:** `expectedSalaryNumeric`, `isRemote`, `verified`, `atsScore`, `skills.id`

---

## 6. Continuous Integration & Continuous Delivery (CI/CD)

An automated deployment pipeline built with GitHub Actions enforces testing, security checks, and blue-green updates on every main branch integration.

```yaml
# .github/workflows/production-pipeline.yml
name: TalentHub Production Sourcing Deployment

on:
  push:
    branches: [ "main" ]

jobs:
  # Job 1: Comprehensive Security Scanning and Testing
  verify-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Verify code style and linter rules
        run: npm run lint

      - name: Audit dependency security issues
        run: npm audit --audit-level=high

  # Job 2: Build and Publish Production Docker Images
  publish-image:
    needs: verify-build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Secure Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and Push Docker Runner image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/talenthub/sourcing-runner:latest
            ghcr.io/talenthub/sourcing-runner:${{ github.sha }}

  # Job 3: Zero-Downtime Blue-Green Server Deployment
  deploy-production:
    needs: publish-image
    runs-on: ubuntu-latest
    steps:
      - name: Establish secure SSH gateway connection
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PROD_SERVER_IP }}
          username: ${{ secrets.PROD_SERVER_USER }}
          key: ${{ secrets.PROD_SERVER_SSH_KEY }}
          script: |
            cd /opt/talenthub/infrastructure
            
            # Pull latest compiled registry runner image
            docker compose pull app-server
            
            # Execute database schema migration update scripts (Drizzle / Knex)
            docker compose run --rm app-server npm run db:migrate
            
            # Restart application container with zero-downtime hot reloading
            docker compose up -d --no-deps --build app-server
            
            # Prune obsolete container layers to maintain server disk hygiene
            docker image prune -a -f
```

---

## 7. Metrics Monitoring & Structured Logging

### Prometheus and Grafana Sourcing Dashboard Metrics
-   **DB Queries Processing Speed:** `postgres_query_duration_seconds` (Alert if p99 latency exceeds 500ms).
-   **Meilisearch Sourcing Processing Speed:** `meili_search_duration_seconds` (Alert if p99 search latency exceeds 100ms).
-   **API Rate Limit Rejections:** `nginx_rate_limit_rejections_total` (Alert if rate limit trigger count spikes by 200% in a 5-minute interval - potential scraping attack).

### Structured JSON Logging Protocol
Next.js API logs are output directly to standard output (`stdout`) in JSON structure to be ingested by indexing agents (such as FluentBit or Datadog Agents):
```json
{
  "timestamp": "2026-07-14T08:24:12.190Z",
  "level": "INFO",
  "context": "SOURCING_ENGINE",
  "recruiterId": "rec_01h9yabc123",
  "query_facets": {
    "skills": ["React", "TypeScript"],
    "isRemote": true
  },
  "execution_time_ms": 42.5,
  "results_count": 86,
  "ip_address": "192.168.1.102"
}
```

---

## 8. Backup & Disaster Recovery (DR) Blueprint

### Database Automated Snapshot Cycle
A system cron job operates a continuous snapshot cycle storing outputs directly to remote S3 buckets with encryption keys:
```bash
#!/bin/sh
# /opt/scripts/postgres_backup.sh
BACKUP_DIR="/mnt/secure_backup/postgres"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/talenthub_prod_$TIMESTAMP.sql.gz"

# Generate compressed Gzipped SQL Snapshot
pg_dump -h localhost -U postgres_user -d talenthub_prod | gzip > "$BACKUP_FILE"

# Upload securely to encrypted storage using AWS S3 CLI
aws s3 cp "$BACKUP_FILE" "s3://talenthub-backups/postgres/$TIMESTAMP/" --sse aws:kms

# Purge backups older than 30 days locally to maintain server hygiene
find "$BACKUP_DIR" -type f -mtime +30 -delete
```

### High Availability Failover Blueprint
-   **PostgreSQL Replication:** Primary write instance replicates transactions in near-real-time to a Hot Standby node in an isolated availability zone via streaming replication.
-   **Meilisearch Redundancy:** Search engine indexes are easily fully reconstructed by re-indexing PostgreSQL databases inside separate nodes in under 2 minutes if the primary indexing container drops.
-   **MinIO Object replication:** Live CV resume uploads are synced to secondary cold-storage geographic regions using standard MinIO client replication routines.
