# System Diagrams

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 5173)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Upload     │  │  Validation  │  │    Report    │      │
│  │  Component   │  │   Service    │  │  Component   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (Port 8000)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Document   │  │    Clause    │  │     Risk     │      │
│  │  Processor   │  │   Detector   │  │   Analyzer   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                         │                                     │
│                         ▼                                     │
│                  ┌──────────────┐                            │
│                  │    Endee     │                            │
│                  │   Service    │                            │
│                  └──────┬───────┘                            │
└─────────────────────────┼─────────────────────────────────┘
                          │ HTTP API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Endee Vector Database (Port 8001)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Collection  │  │   Vectors    │  │   Metadata   │      │
│  │  Management  │  │   Storage    │  │   Storage    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Upload Contract
     ▼
┌─────────────────┐
│   Frontend      │
└────┬────────────┘
     │ 2. POST /api/upload
     ▼
┌─────────────────┐
│  API Endpoint   │
└────┬────────────┘
     │ 3. Extract Text
     ▼
┌─────────────────┐
│ Doc Processor   │
└────┬────────────┘
     │ 4. Segment Clauses
     ▼
┌─────────────────┐
│ Clause Detector │
└────┬────────────┘
     │ 5. Classify Types
     ▼
┌─────────────────┐
│ Risk Analyzer   │
└────┬────────────┘
     │ 6. Generate Embeddings
     ▼
┌─────────────────┐
│ Endee Service   │
└────┬────────────┘
     │ 7. Store Vectors
     ▼
┌─────────────────┐
│ Endee Database  │
└────┬────────────┘
     │ 8. Search Similar
     ▼
┌─────────────────┐
│ Endee Service   │
└────┬────────────┘
     │ 9. Generate Report
     ▼
┌─────────────────┐
│  API Response   │
└────┬────────────┘
     │ 10. Display Report
     ▼
┌─────────────────┐
│   Frontend      │
└────┬────────────┘
     │ 11. Show to User
     ▼
┌─────────┐
│  User   │
└─────────┘
```

## Endee Integration Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Contract Upload                        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Extract and Segment Clauses                  │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│         Generate Embeddings (sentence-transformers)       │
│              all-MiniLM-L6-v2 (384 dimensions)           │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                  Store in Endee                           │
│  ┌────────────────────────────────────────────────┐      │
│  │  Point ID: clause_uuid                         │      │
│  │  Vector: [0.1, 0.2, ..., 0.384]               │      │
│  │  Metadata: {                                   │      │
│  │    "text": "clause text",                     │      │
│  │    "type": "liability",                       │      │
│  │    "risk_level": "high",                      │      │
│  │    "contract_id": "contract_uuid"             │      │
│  │  }                                             │      │
│  └────────────────────────────────────────────────┘      │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Semantic Search (Cosine Similarity)          │
│  Query: "liability clause"                                │
│  Returns: Top 5 similar clauses with scores              │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                  Use in Analysis                          │
│  - Compare with standard clauses                          │
│  - Find similar patterns                                  │
│  - Provide context for recommendations                    │
└──────────────────────────────────────────────────────────┘
```

## Component Interaction

```
Frontend Components:
┌─────────────────┐
│   App.jsx       │ ◄─── Main container
└────┬────────────┘
     │
     ├──► ┌─────────────────┐
     │    │  Header.jsx     │ ◄─── Navigation
     │    └─────────────────┘
     │
     ├──► ┌─────────────────┐
     │    │ UploadSection   │ ◄─── File upload
     │    └────┬────────────┘
     │         │
     │         └──► ┌─────────────────┐
     │              │   api.js        │ ◄─── API client
     │              └─────────────────┘
     │
     └──► ┌─────────────────┐
          │ValidationReport │ ◄─── Display results
          └─────────────────┘

Backend Services:
┌─────────────────┐
│   main.py       │ ◄─── FastAPI app
└────┬────────────┘
     │
     ├──► ┌─────────────────┐
     │    │document_processor│ ◄─── Extract text
     │    └─────────────────┘
     │
     ├──► ┌─────────────────┐
     │    │clause_detector  │ ◄─── Classify clauses
     │    └─────────────────┘
     │
     ├──► ┌─────────────────┐
     │    │risk_analyzer    │ ◄─── Analyze risks
     │    └─────────────────┘
     │
     └──► ┌─────────────────┐
          │endee_service    │ ◄─── Vector operations
          └────┬────────────┘
               │
               └──► Endee Database
```

## Risk Analysis Flow

```
┌─────────────────┐
│  Clause Text    │
└────┬────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Pattern Matching                   │
│  - Check for risk keywords          │
│  - Match against known patterns     │
│  - Analyze language ambiguity       │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Risk Level Assignment              │
│  CRITICAL: Unlimited liability      │
│  HIGH: Significant concerns         │
│  MEDIUM: Requires attention         │
│  LOW: Standard terms                │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Generate Recommendations           │
│  - Specific to clause type          │
│  - Based on risk level              │
│  - Actionable advice                │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Search Similar Clauses (Endee)     │
│  - Find better alternatives         │
│  - Compare with standards           │
│  - Provide examples                 │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────┐
│  Final Report   │
└─────────────────┘
```

## Deployment Architecture

```
Production Environment:

┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│  Backend 1   │          │  Backend 2   │
│  (Docker)    │          │  (Docker)    │
└──────┬───────┘          └──────┬───────┘
       │                         │
       └────────────┬────────────┘
                    │
                    ▼
         ┌──────────────────┐
         │  Endee Cluster   │
         │  (Distributed)   │
         └──────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    CDN (Frontend)                        │
│  ┌──────────────────────────────────────────────┐      │
│  │  Static Files (React Build)                  │      │
│  └──────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

```
Endee Collection: contract_clauses

Point Structure:
{
  "id": "uuid",
  "vector": [float × 384],
  "metadata": {
    "text": "string",
    "type": "enum",
    "risk_level": "enum",
    "status": "enum",
    "contract_id": "uuid",
    "timestamp": "datetime"
  }
}

Indexes:
- Vector index (HNSW)
- Metadata filters
- Contract ID lookup
```

## API Flow

```
POST /api/upload
    │
    ├─► Validate file
    ├─► Save to disk
    ├─► Extract text
    ├─► Segment clauses
    └─► Return contract_id

GET /api/validate/{id}
    │
    ├─► Retrieve contract
    ├─► Classify clauses
    ├─► Generate embeddings
    ├─► Store in Endee
    ├─► Search similar
    ├─► Analyze risks
    └─► Return report

POST /api/search
    │
    ├─► Generate query embedding
    ├─► Search Endee
    └─► Return results
```

## Security Layers

```
┌─────────────────────────────────────┐
│  User Input                          │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  File Validation                     │
│  - Type check                        │
│  - Size limit                        │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Input Sanitization                  │
│  - Remove malicious content          │
│  - Validate format                   │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  CORS Policy                         │
│  - Allowed origins                   │
│  - Allowed methods                   │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Rate Limiting (Future)              │
│  - Request throttling                │
│  - IP-based limits                   │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Processing                          │
└─────────────────────────────────────┘
```

These diagrams provide a visual understanding of the system architecture, data flow, and component interactions.
