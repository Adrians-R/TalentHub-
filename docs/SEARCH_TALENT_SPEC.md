# TalentHub Enterprise: "Search Talent" Sourcing Engine Specification
**Version:** 1.0.0  
**Author:** Lead Sourcing Architect & Principal Security Engineer  
**Status:** Approved for Implementation

This document specifies the end-to-end technical, business, and design architecture for the **Search Talent** core engine on the TalentHub platform. It focuses strictly on recruiter talent discovery, matching, and engagement, keeping with our core philosophy: *Recruiters discover verified professionals; candidates do not apply to postings.*

---

## 1. Business Flow & User Journey

The Talent Discovery flow is designed to maximize placement speed and discovery precision for enterprise recruiters.

```
+--------------------+      +-------------------------+      +-----------------------+
| Recruiter Accesses | ---> | Input Search Query &   | ---> | Discovery Engine      |
| Sourcing Interface |      | Apply Facet Filters     |      | Evaluates Profiles    |
+--------------------+      +-------------------------+      +-----------------------+
                                                                         |
                                                                         v
+--------------------+      +-------------------------+      +-----------------------+
| Initiate Sourcing  | <--- | Recruiter Reviews       | <--- | Candidates Displayed  |
| Pitch (Google Meet)|      | Verified Portfolio Cards|      | Sorted by ATS Score   |
+--------------------+      +-------------------------+      +-----------------------+
```

### Detailed Flow Steps
1. **Recruiter Identity & Authorization Check:**
   - The Recruiter logs into TalentHub. The system verifies their active profile and subscription tier.
2. **Query Formulation & Multi-Facet Filtering:**
   - The Recruiter types technical keywords (e.g., "React", "Rust") or applies precise sliders (salary range, years of experience, remote/hybrid preference).
3. **Automated Candidate Index Parsing & Score Matching:**
   - The search engine matches keywords against candidates' global skills matrices, headlines, portfolios, and locations.
   - It computes an ATS match relevance percentage and sorts results starting with verified, high-scoring talent.
4. **Portfolio Evaluation & Bookmarking:**
   - The Recruiter clicks candidate profiles to view embedded portfolio cards, project thumbnails, GitHub repositories, and verified badges.
   - The recruiter can bookmark candidates to their personal talent watchlist.
5. **Direct Engagement (The "Sourcing Pitch"):**
   - The Recruiter initiates a pitch directly from the candidate card. They specify a proposed date, feedback message, and pre-generated Google Meet video conference link.
   - The Candidate is notified, keeping their personal contact details secure until they accept the pitch invitation.

---

## 2. Database Schema (Search-Optimized SQL)

The tables are configured in PostgreSQL to support rapid indexing, sub-second sourcing lookups, and strict relational integrity.

```sql
-- Search Talent database module
-- Target Platform: PostgreSQL 16+

-- 1. Candidates Profile Table
CREATE TABLE candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(512),
    expected_salary_min NUMERIC(12, 2) NOT NULL,
    expected_salary_max NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
    location VARCHAR(100) NOT NULL,
    is_remote BOOLEAN DEFAULT TRUE NOT NULL,
    ats_score INTEGER DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. Skills Taxonomy Table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Candidate Skills Junction (Search Engine Target Table)
CREATE TABLE candidate_skills (
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    years_experience INTEGER NOT NULL CHECK (years_experience >= 0),
    level VARCHAR(20) NOT NULL CHECK (level IN ('junior', 'mid', 'senior', 'expert')),
    PRIMARY KEY (candidate_id, skill_id)
);

-- 4. Recruiter Bookmarks Table
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID NOT NULL,
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (recruiter_id, candidate_id)
);

-- 5. High Performance Search Indices
CREATE INDEX idx_candidate_active_search 
ON candidate_profiles (id) 
WHERE deleted_at IS NULL;

-- Multi-facet search composite index: Filters by remote option, location, and sorts by highest ATS Score
CREATE INDEX idx_candidate_facets 
ON candidate_profiles (is_remote, location, ats_score DESC) 
WHERE deleted_at IS NULL;

-- Fast index on candidate expected salaries to handle range filters
CREATE INDEX idx_candidate_salary_range 
ON candidate_profiles (expected_salary_min, expected_salary_max) 
WHERE deleted_at IS NULL;

-- GIN Trigram index for rapid fuzzy matches on locations
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_candidate_location_trgm ON candidate_profiles USING gin (location gin_trgm_ops);
```

---

## 3. REST API Contract & Request / Response Specifications

### Route: `POST /api/recruiter/search`
Retrieves a paginated list of candidate profiles matching strict recruiter sourcing parameters.

#### Request Payload Specification (JSON)
```json
{
  "query": "React Developer",
  "location": "Singapore",
  "isRemote": true,
  "salaryMin": 5000,
  "salaryMax": 12000,
  "skills": ["uuid-of-react-skill", "uuid-of-typescript-skill"],
  "minAtsScore": 80,
  "page": 1,
  "limit": 10,
  "sortBy": "ats_score_desc"
}
```

#### Successful Response (200 OK)
```json
{
  "success": true,
  "meta": {
    "totalCount": 124,
    "totalPages": 13,
    "currentPage": 1,
    "limit": 10
  },
  "data": [
    {
      "id": "e9fb84c7-8f55-4672-8824-345371c667a4",
      "fullName": "Alex Rivera",
      "headline": "Lead Frontend Engineer | Specializing in React & WebGL performance",
      "bio": "Over 8 years of enterprise application architecture. Author of several high-performance rendering engines.",
      "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      "expectedSalaryMin": 8500.00,
      "expectedSalaryMax": 11000.00,
      "currency": "SGD",
      "location": "Singapore",
      "isRemote": true,
      "atsScore": 96,
      "verified": true,
      "skills": [
        { "id": "1", "name": "React", "level": "expert", "yearsOfExperience": 7 },
        { "id": "2", "name": "TypeScript", "level": "expert", "yearsOfExperience": 6 }
      ],
      "isBookmarked": false
    }
  ]
}
```

---

## 4. Frontend Component & Layout Architecture

The search engine page uses Next.js Server Components for base structures and loads modular Client Components to control interactive filtering, animation transitions, and data-grid hydration.

### Sourcing Component Hierarchy Map
```
src/app/(recruiter)/search/page.tsx (RSC - Header, Search Scaffold)
│
├── src/components/search/search-facets.tsx ('use client' - Sliders, Filters, Skills multi-select)
│
├── src/components/search/results-container.tsx ('use client' - Feeds query inputs to TanStack query)
│   │
│   ├── src/components/search/candidate-card-skeleton.tsx (Visual Shimmer Loading States)
│   │
│   ├── src/components/search/candidate-card.tsx (Aesthetic Framer Motion transition, verified tag, ATS score)
│   │   │
│   │   └── src/components/search/pitch-modal.tsx (Frosted blur modal for booking Google Meet)
│   │
│   └── src/components/search/empty-search-state.tsx (No results layout with suggestion checklist)
```

### Search Sourcing State Handler with TanStack Query
We coordinate search state via global hook managers:
```typescript
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const SearchFacetSchema = z.object({
  query: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  isRemote: z.boolean().default(true),
  salaryMin: z.number().min(0).default(0),
  salaryMax: z.number().min(0).default(50000),
  skills: z.array(z.string().uuid()).default([]),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

export type SearchFacets = z.infer<typeof SearchFacetSchema>;

export function useTalentSourcing(facets: SearchFacets) {
  return useQuery({
    queryKey: ['talent-sourcing', facets],
    queryFn: async () => {
      const response = await fetch('/api/recruiter/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facets),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Server failed to return query results');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 3, // Cache search queries for 3 minutes
  });
}
```

---

## 5. System Robustness, Security, & Edge-Case Blueprint

### A. Strict Input Validation (Zod Schema)
- **Salary Constraints:** `salaryMax` must be verified to be equal to or greater than `salaryMin`. If `salaryMin` is modified, the system automatically adjusts the lower bounds of the slider to prevent dead query combinations.
- **Payload Sanitization:** Regular expressions strip out HTML or Script tags from custom search query parameter inputs to secure the database against script execution.

### B. Error Handling & System Recovery
- **Database Connection Dropout:** If the database engine drops connection, the API intercepts the standard raw error message and outputs a user-friendly generic system notification: `"Our discovery engine is undergoing rapid synchronization. Please reload in 5 seconds."`
- **Invalid API Payload Parameters:** Return clean HTTP `422 Unprocessable Entity` containing formatted JSON details indicating precisely which filter contains incorrect properties.

### C. Performance Edge Cases
- **Extremely High Filters (Zero Results):** When a recruiter enters conflicting values (e.g., Remote React expert expecting $1,000,000/yr in a small local town), the system handles the empty state by showing an elegant custom message and a **"Relax Filters"** button, resetting key parameters to their standard deviations.
- **Pagination Overflow:** If the recruiter queries a page past the total page counts, the backend gracefully fallbacks to the final active index rather than failing with an SQL offset runtime crash.

### D. Visual Interface States

#### 1. Loading State (Pristine Skeletons)
- Sourcing results lists contain modular CSS-animated skeleton frames. We display exactly 3 structural placeholders mimicking candidate name titles, verified checkmarks, and tags.
- Skeletons use continuous gradient background shimmers (`animate-pulse bg-slate-100`).

#### 2. Empty State (Action-Oriented Zero Results Layout)
- We do not show blank grids. When searches yield no matching records, an illustration with clean display typography is shown:
  > **No Professionals Discovered**
  > "No talent matched this precise filter permutation. Try widening your salary threshold or including adjacent technical skill tags."
  - Includes a primary CTA button: **"Reset Sourcing Filters"**.

#### 3. Success State (Aesthetic Placement)
- Successfully returned candidate cards fade in sequentially using a stagger effect from Framer Motion.
- Display cards pair bold **Inter** text with compact, uppercase **JetBrains Mono** metrics illustrating expected salaries, location ranges, and verified tags.

### E. Permissions & Zero-Trust Security Policies
- **Recruiter Role Mandate:** The API route checks session authentication cookies. If the user's role is not `'recruiter'` or `'admin'`, the endpoint immediately rejects requests with an HTTP `403 Forbidden` response.
- **Candidate Privacy Protection:** Candidate personal details, such as phone numbers, emails, and exact residence details are encrypted or redacted at the backend database query layer. They are strictly kept hidden until a candidate accepts a recruiter's pitch, keeping TalentHub completely safe from data parsing bots.
- **Rate-Limiting (Anti-Scraping):** Recruiters are limited to a maximum of 60 searches per minute. Exceeding this rate limits the API with HTTP `429 Too Many Requests` to protect candidate data from extraction.
