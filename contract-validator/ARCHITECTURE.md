# System Architecture

## Overview

The Business Contract Validator is a full-stack AI application that uses Endee vector database for semantic search and contract analysis.

## Architecture Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────┐
│  React Frontend │
│   (Port 5173)   │
└──────┬──────────┘
       │ REST API
       ▼
┌─────────────────┐
│ FastAPI Backend │
│   (Port 8000)   │
└──────┬──────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌─────────────┐
│    Endee     │  │  Document   │
│   Vector DB  │  │  Processor  │
│ (Port 8001)  │  └─────────────┘
└──────────────┘
```

## Components

### 1. Frontend (React + Vite)

**Location:** `frontend/`

**Responsibilities:**
- User interface for contract upload
- Display validation reports
- Visualize risk levels and recommendations

**Key Files:**
- `App.jsx` - Main application component
- `components/UploadSection.jsx` - File upload interface
- `components/ValidationReport.jsx` - Report visualization
- `services/api.js` - API client

### 2. Backend (FastAPI)

**Location:** `backend/app/`

**Responsibilities:**
- REST API endpoints
- Document processing
- Clause detection and classification
- Risk analysis
- Endee integration

**Key Modules:**

#### `main.py`
- FastAPI application
- API endpoints
- Request/response handling

#### `services/document_processor.py`
- Extract text from PDF, DOCX, TXT
- Segment text into clauses
- Text cleaning and normalization

#### `services/clause_detector.py`
- Classify clauses by type
- Keyword-based detection
- Missing clause identification

#### `services/risk_analyzer.py`
- Pattern-based risk detection
- Risk level calculation
- Recommendation generation

#### `services/endee_service.py`
- Endee API integration
- Vector embedding generation
- Semantic search
- Clause storage and retrieval

### 3. Endee Vector Database

**Purpose:** Store and search clause embeddings

**Operations:**
- Store clause vectors
- Semantic similarity search
- Retrieve similar clauses
- Compare contracts

## Data Flow

### Contract Upload Flow

```
1. User uploads contract file
   ↓
2. Frontend sends file to /api/upload
   ↓
3. Backend extracts text (DocumentProcessor)
   ↓
4. Text segmented into clauses
   ↓
5. Contract stored with metadata
   ↓
6. Return contract_id to frontend
```

### Validation Flow

```
1. Frontend requests /api/validate/{contract_id}
   ↓
2. Backend retrieves contract
   ↓
3. Classify each clause (ClauseDetector)
   ↓
4. Generate embeddings (EndeeService)
   ↓
5. Store in Endee vector database
   ↓
6. Search for similar clauses
   ↓
7. Analyze risks (RiskAnalyzer)
   ↓
8. Generate recommendations
   ↓
9. Return ValidationReport
```

## Endee Integration

### How Endee is Used

1. **Embedding Generation**
   - Uses sentence-transformers (all-MiniLM-L6-v2)
   - Converts clause text to 384-dimensional vectors

2. **Storage**
   - Each clause stored with:
     - Unique ID
     - Vector embedding
     - Metadata (type, risk, contract_id)

3. **Semantic Search**
   - Query with clause text
   - Find similar clauses using cosine similarity
   - Return top-k matches

4. **RAG Pipeline**
   - Retrieve relevant clauses from Endee
   - Use as context for LLM analysis
   - Generate informed recommendations

### Endee API Calls

```python
# Create collection
POST /collections
{
  "name": "contract_clauses",
  "dimension": 384,
  "metric": "cosine"
}

# Insert clause
POST /collections/contract_clauses/points
{
  "id": "clause_123",
  "vector": [0.1, 0.2, ...],
  "metadata": {...}
}

# Search
POST /collections/contract_clauses/search
{
  "vector": [0.1, 0.2, ...],
  "top_k": 5
}
```

## Risk Analysis Algorithm

```python
1. For each clause:
   a. Classify type (payment, liability, etc.)
   b. Match against risk patterns
   c. Calculate risk level
   d. Generate recommendations

2. Identify missing critical clauses

3. Calculate overall contract risk:
   - CRITICAL if any clause is critical
   - HIGH if 2+ high-risk clauses
   - MEDIUM if 1 high or 3+ medium
   - LOW otherwise
```

## Security Considerations

- File upload validation
- File size limits
- Allowed file types only
- Input sanitization
- CORS configuration
- Environment variable protection

## Scalability

### Current Implementation
- In-memory contract storage
- Single-instance deployment
- Synchronous processing

### Production Improvements
- PostgreSQL for metadata
- Redis for caching
- Async task queue (Celery)
- Load balancing
- Horizontal scaling
- CDN for frontend

## Performance

- Document processing: ~1-2 seconds
- Embedding generation: ~100ms per clause
- Endee search: ~50ms
- Total validation: ~3-5 seconds for typical contract

## Technology Stack

**Backend:**
- Python 3.10+
- FastAPI
- sentence-transformers
- PyPDF2, python-docx
- httpx (async HTTP)

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios

**Database:**
- Endee (vector database)
- SQLite (metadata - demo)

**Deployment:**
- Docker
- Docker Compose
