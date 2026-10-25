# TalentHub Enterprise: Production AI Architecture Blueprint
**Version:** 1.0.0  
**Author:** Principal AI Architect & GenAI Systems Engineer  
**Status:** Approved for Implementation

This document specifies the server-side enterprise artificial intelligence workflow architecture powering the **TalentHub Enterprise** sourcing, evaluation, and coaching ecosystems. All agentic cycles and semantic pipelines run exclusively server-side, utilizing the modern `@google/genai` TypeScript SDK.

---

## 1. Global AI Model Selection Strategy

To balance token latency, operational cost, and reasoning depth, we employ a strict multi-tier routing architecture:

| System Module | Task Classification | Primary Model Choice | Justification |
| :--- | :--- | :--- | :--- |
| **1. Resume Analysis** | High-throughput parsing & classification | `gemini-3.5-flash` | Ultra-fast token ingestion, rigid JSON schema enforcement, multi-page document vision-parsing. |
| **2. Candidate Matching** | Multi-dimensional semantic filtering | `gemini-3.1-pro-preview` | Deep contextual reasoning, long-context evaluation of career trajectory against Job Descriptions. |
| **3. ATS Scoring** | Numeric alignment & algorithmic benchmarking | `gemini-3.5-flash` | Deterministic compliance, regex alignment verification, low-latency scoring iterations. |
| **4. Career Recommendation** | Non-linear path prediction & modeling | `gemini-3.1-pro-preview` | High reasoning capability to deduce implicit professional pivots and career trend analysis. |
| **5. Skill Gap Analysis** | Technology comparison & mapping | `gemini-3.5-flash` | Precise technical taxonomy matching against standardized ontology vectors. |
| **6. Training Recommendation**| Personalized curriculum compilation | `gemini-3.1-pro-preview` | Complex educational mapping matching career aspirations to actual course syllabi. |
| **7. Interview Coach** | Multi-turn active simulated voice/chat | `gemini-3.1-pro-preview` | High-fidelity conversation state retention, dynamic role-play scenarios, and deep code grading. |

---

## 2. Global AI Processing & Safety Pipeline

Every AI interaction traverses a standardized server-side secure lifecycle to maintain data privacy, guard against prompt injection, and enforce consistent schemas.

```
       [ Client Request: CV/Job Spec/Chat Input ]
                          │
                          ▼ (Network Boundary)
          ┌────────────────────────────────┐
          │      Server API Route          │
          │  - Ingest payload, verify auth │
          └───────────────┬────────────────┘
                          │
                          ▼
          ┌────────────────────────────────┐
          │     PII Anonymization Filter   │ (Optionally strips absolute names,
          │ - Scrapes phone, emails, addr  │  IDs to eliminate algorithmic bias)
          └───────────────┬────────────────┘
                          │
                          ▼
          ┌────────────────────────────────┐
          │      Input Safety Guardrails   │ (Rejects adversarial queries,
          │ - Block prompt injections      │  system instruction overrides)
          └───────────────┬────────────────┘
                          │
                          ▼
          ┌────────────────────────────────┐
          │     Gemini API Interaction     │ (Invokes @google/genai SDK with
          │  - Applies systemInstructions   │  strict responseSchema structures)
          └───────────────┬────────────────┘
                          │
                          ▼
          ┌────────────────────────────────┐
          │      Output Schema Validator   │ (Enforces fallback defaults if
          │   - Verify JSON payload integrity│  JSON response parsing fails)
          └───────────────┬────────────────┘
                          │
                          ▼
               [ Client Secure Response ]
```

---

## 3. Module 1: Intelligent Resume Analysis & Parsing

This module converts unstructured multi-page candidate resumes (PDFs, DOCX, images) into highly structured, schema-compliant JSON representations.

### Ingestion Workflow
1. **Document Conversion:** Target resumes are loaded from S3. PDF streams are converted to base64 inline buffers.
2. **Vision-Enabled Ingestion:** Rather than stripping formatting via raw text extractors (which loses spacing context, structural hierarchies, and timeline positioning), the system sends document page buffers directly to `gemini-3.5-flash` as image parts.
3. **Structured Taxonomy Output:** The model maps unstructured visual elements into a pre-defined JSON schema.

### JSON Output Schema Definition (Google GenAI compliant)
```json
{
  "type": "OBJECT",
  "properties": {
    "personalMetadata": {
      "type": "OBJECT",
      "properties": {
        "fullName": { "type": "STRING" },
        "headline": { "type": "STRING" },
        "location": { "type": "STRING" },
        "yearsOfExperience": { "type": "NUMBER" }
      },
      "required": ["fullName", "headline", "yearsOfExperience"]
    },
    "workExperience": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "company": { "type": "STRING" },
          "role": { "type": "STRING" },
          "startDate": { "type": "STRING", "description": "YYYY-MM" },
          "endDate": { "type": "STRING", "description": "YYYY-MM or Present" },
          "highlights": { 
            "type": "ARRAY", 
            "items": { "type": "STRING" },
            "description": "Quantifiable, impact-driven achievements."
          },
          "skillsUsed": { "type": "ARRAY", "items": { "type": "STRING" } }
        },
        "required": ["company", "role", "startDate", "highlights"]
      }
    },
    "skills": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "name": { "type": "STRING" },
          "category": { "type": "STRING", "description": "Frontend, Backend, DevOps, Management, etc." },
          "proficiency": { "type": "STRING", "description": "Beginner, Intermediate, Advanced, Expert" }
        },
        "required": ["name", "category"]
      }
    }
  },
  "required": ["personalMetadata", "workExperience", "skills"]
}
```

---

## 4. Module 2: Deep Candidate Matching & Semantic Alignment

Performs a multi-dimensional matching analysis between a Candidate's Profile and a target Job Description (JD).

### Matching Workflow Strategy
1. **Embedding Generation:** Candidate vectors are fetched from PGVector/Embeddings databases.
2. **First-Pass Filtration:** A fast vector similarity filter retrieves the top 30 candidate profiles from PostgreSQL based on technical keyword overlap.
3. **Contextual Evaluation:** The top profiles are sent alongside the JD to `gemini-3.1-pro-preview` to perform deep reasoning.
4. **Weighted Scoring Logic:** The model outputs an analytical review dividing alignment scores into:
    - **Hard Technical Match (40%):** Direct alignment with technologies, stacks, and execution patterns.
    - **Soft Competency & Scale Match (30%):** Evaluates if the candidate has worked at comparable scales (e.g., massive traffic, high throughput, similar team structures).
    - **Trajectory Match (30%):** Does this role represent a logical, progressive step in the candidate's career trajectory?

### Analytical Schema Output
```json
{
  "type": "OBJECT",
  "properties": {
    "overallMatchingScore": { "type": "INTEGER", "description": "Aggregate score from 0-100" },
    "dimensionScores": {
      "type": "OBJECT",
      "properties": {
        "technicalScore": { "type": "INTEGER" },
        "scaleScore": { "type": "INTEGER" },
        "trajectoryScore": { "type": "INTEGER" }
      }
    },
    "alignmentAnalysis": { "type": "STRING", "description": "Qualitative rationale of candidate strengths for this role" },
    "sourcingRisks": { 
      "type": "ARRAY", 
      "items": { "type": "STRING" },
      "description": "Potential red flags, such as short tenure, compensation mismatches, or tech gaps"
    }
  },
  "required": ["overallMatchingScore", "dimensionScores", "alignmentAnalysis"]
}
```

---

## 5. Module 3: ATS Score (Applicant Tracking System) Benchmarking

Provides deterministic evaluation of candidate compliance with corporate, regulatory, and mechanical pipeline requirements.

### Score Computation Workflow
```
  [ Parse CV Map ] ────► [ Parse Job Spec Requirements ]
          │                         │
          ├─────────────────────────┘
          ▼
┌───────────────────────────────────────────────┐
│     Invoke low-latency gemini-3.5-flash       │
│ - Scan for Mandatory Certifications           │
│ - Validate Minimum Academic Qualifications     │
│ - Map Skill Weightings & Synonyms             │
└──────────────────────┬────────────────────────┘
                       ▼
┌───────────────────────────────────────────────┐
│         Normalize Scoring Calculations        │
│ - Base Score = (Keyword Matches / Required)   │
│ - Penalty Deductions (e.g., Missing Certs)    │
│ - Output Structured Performance Array         │
└───────────────────────────────────────────────┘
```

### Prompt Construction Guideline
* **System Directive:** "You are an automated, highly objective Applicant Tracking System (ATS) processor. Grade the matching ratio with absolute numerical consistency. Do not award points for adjacent skills unless they represent standard semantic synonyms (e.g. 'Kubernetes' aligns with 'K8s')."
* **Input Parameters:** `Candidate JSON` + `Job Description Criteria List` + `Mandatory Certifications List`

---

## 6. Module 4: Career Path Recommendation Engine

Recommends multi-stage, non-linear career trajectories based on a candidate's historical background, current market demand, and target professional aspirations.

### Prediction Workflow Engine
1. **Targeting Historical Pivots:** Analyzes transitions of thousands of successful candidates in similar cohorts.
2. **Aspiration Alignment:** Identifies adjacent paths (e.g., Senior Frontend Engineer transition paths to: a) Engineering Manager, b) Staff UI Engineer, or c) Solutions Architect).
3. **Career Progression Graph:** `gemini-3.1-pro-preview` generates a 3-step timeline trajectory with actionable target timelines, milestone expectations, and potential hurdles.

### Suggested Trajectory Data Schema
```json
{
  "type": "OBJECT",
  "properties": {
    "recommendedCareerPaths": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "pathTitle": { "type": "STRING" },
          "shortSummary": { "type": "STRING" },
          "estimatedTimeToPivot": { "type": "STRING", "description": "e.g. 18-24 Months" },
          "milestones": {
            "type": "ARRAY",
            "items": {
              "type": "OBJECT",
              "properties": {
                "phaseName": { "type": "STRING" },
                "targetCompetency": { "type": "STRING" },
                "suggestedAction": { "type": "STRING" }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 7. Module 5: Automated Skill Gap Analysis

Compares the candidate's active skill inventory with targeted industry roles or custom JDs, outlining precise critical, moderate, and minor voids.

### Analysis Pipeline
1. **Ontology Engine:** Standardizes skills using a unified semantic directory (mapping non-standard phrases like "wrote Python API routes" directly to standard skill IDs like "Python", "REST APIs", "FastAPI").
2. **Venn Gap Isolation:** Separates skills into:
    - **Active Match Cluster:** Possessed by candidate and required by target.
    - **Missing Essential Gaps:** Absolutely required by target but missing from candidate profile.
    - **Differentiating Gaps:** Nice-to-have secondary skills that elevate candidates above average peers.

### Output Visualization Schema
```json
{
  "type": "OBJECT",
  "properties": {
    "activeMatchCluster": { "type": "ARRAY", "items": { "type": "STRING" } },
    "missingEssentialGaps": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "skillName": { "type": "STRING" },
          "impactScore": { "type": "STRING", "description": "Critical, High, Medium" },
          "contextRationale": { "type": "STRING" }
        }
      }
    },
    "differentiatingGaps": { "type": "ARRAY", "items": { "type": "STRING" } }
  }
}
```

---

## 8. Module 6: Curated Educational & Training Recommendations

Directly translates the gaps isolated in **Module 5** into a hyper-personalized, curriculum-mapped learning syllabus.

### Recommendation Workflow Architecture
1. **Syllabus Parsing:** Real-time ingestion of active educational platforms (Coursera, Udemy, Pluralsight, internal enterprise learning repositories).
2. **Mapping Engine:** Recommends specific courses, books, open-source projects, and hands-on laboratory exercises based on the candidate's missing essential skills and preferred learning style (Visual, Hands-On, Deep Reading).
3. **Sequence Construction:** `gemini-3.1-pro-preview` organizes recommendations into chronological sprint-based learning blocks (Week 1-2, Week 3-4) to optimize knowledge retention.

---

## 9. Module 7: Real-Time Interactive Interview Coach

Simulates professional, role-specific technical and behavioral interviews through an active agent loop, offering detailed grading, code evaluations, and constructive critiques.

### Coach Interaction Loop (State Machine)

```
        ┌───────────────────────────────────┐
        │       Initialize Session          │
        │ - Model: gemini-3.1-pro-preview   │
        │ - Context: Role description + CV  │
        └─────────────────┬─────────────────┘
                          │
                          ▼
        ┌───────────────────────────────────┐
        │       Generate Next Question      │ ◄─────────────────────────┐
        │ - Selects behavioral/tech topic   │                           │
        │ - Inject subtle progressive depth │                           │
        └─────────────────┬─────────────────┘                           │
                          │                                             │
                          ▼ (Stream question text/audio)                │
        ┌───────────────────────────────────┐                           │
        │       Capture Candidate Input     │                           │
        │ - Chat text or mic streaming PCM  │                           │
        └─────────────────┬─────────────────┘                           │
                          │                                             │
                          ▼ (Analyze response correctness)              │
        ┌───────────────────────────────────┐                           │ (Loop up to
        │     Formulate Next Conversation   │                           │  N questions)
        │ - Grade answer quality            │                           │
        │ - Store step context dynamically  │                           │
        └─────────────────┬─────────────────┘                           │
                          │                                             │
                          ├───────────────── [ Sessions < Limit ] ──────┘
                          │
                          ▼ [ Session limit reached ]
        ┌───────────────────────────────────┐
        │       Generate Final Feedback     │
        │ - Structural performance grade    │
        │ - Exact transcript correction suggestions
        └───────────────────────────────────┘
```

### LLM Prompt Strategy & Grounding
* **Persona Context:** "You are a Senior Principal Engineer and Technical Bar Raiser at a premier technology enterprise. Your demeanor is professional, encouraging, yet critically rigorous. Ask challenging questions. Probe deep when answers are vague or rely on buzzwords."
* **Handling Live Audio Streams (TTS/PCM Integration):** The server utilizes `gemini-3.1-pro-preview` with `responseModalities: [Modality.AUDIO]` configuration to feed real-time verbal answers, converting voice cues directly into simulated interactive dialogs with minimal delay.
* **Code Grading Grounding:** If coding challenges are assigned, the assistant evaluates the syntax against sandboxed compilers, measuring asymptotic runtime complexity (Big-O notation), edge case handling (e.g., null values, array overflows), and architectural pattern choices.

---

## 10. AI System Ethics, Bias Minimization, and Privacy Controls

To enforce professional, equal-opportunity, and regulatory standards (e.g., compliance with EU AI Act, EEOC guidelines), the platform embeds core security protocols inside the pipeline:

- **PII Obfuscation:** Candidate names, genders, ages, locations, ethnic references, and educational institute names are stripped from payloads prior to sending to GenAI matching models to prevent structural institutional bias.
- **Determinism Tuning:** Evaluation tasks are operated at `temperature: 0.1` and `seed` variables are established where supported, reducing model hallucination and ensuring two candidates with identical portfolios obtain identical ATS benchmark rankings.
- **Hallucination Redundancy:** All generated advice, skill maps, and career tracks are parsed against custom strict taxonomies to filter and remove fabricated technologies or non-existent course materials.
