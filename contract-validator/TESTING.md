# Testing Guide

## Manual Testing

### 1. Backend API Testing

Start the backend server:
```bash
cd backend
python -m app.main
```

#### Test Health Endpoint
```bash
curl http://localhost:8000/
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Business Contract Validator",
  "version": "1.0.0"
}
```

#### Test File Upload
```bash
curl -X POST http://localhost:8000/api/upload \
  -F "file=@../samples/sample_contract.txt"
```

Expected response:
```json
{
  "contract_id": "uuid-here",
  "filename": "sample_contract.txt",
  "status": "uploaded",
  "message": "Contract uploaded successfully..."
}
```

#### Test Validation
```bash
curl http://localhost:8000/api/validate/{contract_id}
```

### 2. Frontend Testing

Start the frontend:
```bash
cd frontend
npm run dev
```

Visit http://localhost:5173

**Test Cases:**

1. **Upload Valid Contract**
   - Upload `samples/sample_contract.txt`
   - Verify upload success message
   - Check validation report appears

2. **Upload Invalid File**
   - Try uploading a .jpg or .exe file
   - Verify error message appears

3. **Drag and Drop**
   - Drag a contract file onto the upload area
   - Verify file is accepted

4. **View Validation Report**
   - Check all sections display correctly
   - Verify risk levels are color-coded
   - Check recommendations appear

### 3. Endee Integration Testing

Verify Endee is running:
```bash
curl http://localhost:8001/health
```

Test collection creation:
```bash
curl -X POST http://localhost:8001/collections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test_collection",
    "dimension": 384,
    "metric": "cosine"
  }'
```

## Test Scenarios

### Scenario 1: High-Risk Contract
Upload `samples/sample_contract.txt`

Expected Results:
- Overall risk: HIGH or CRITICAL
- Flags unlimited liability
- Identifies non-refundable payment
- Notes irrevocable termination
- Missing jurisdiction clause

### Scenario 2: Good Contract
Upload `samples/good_contract.txt`

Expected Results:
- Overall risk: LOW or MEDIUM
- All critical clauses present
- Limited liability
- Reasonable termination terms
- Clear payment terms

### Scenario 3: Missing Clauses
Create a minimal contract with only 2-3 clauses

Expected Results:
- Lists missing critical clauses
- Recommendations to add them
- Medium to high risk level

## Performance Testing

### Response Time Benchmarks
- Upload: < 2 seconds
- Validation: < 5 seconds
- Search: < 500ms

### Load Testing
```bash
# Install Apache Bench
# Test upload endpoint
ab -n 100 -c 10 -p contract.txt -T multipart/form-data \
  http://localhost:8000/api/upload
```

## Error Handling Tests

1. **Invalid File Type**
   - Upload .exe, .jpg, .zip
   - Expect 400 error

2. **Large File**
   - Upload file > 10MB
   - Expect 400 error

3. **Corrupted File**
   - Upload corrupted PDF
   - Expect 500 error with message

4. **Missing Contract ID**
   - Request validation for non-existent ID
   - Expect 404 error

5. **Endee Unavailable**
   - Stop Endee service
   - Upload contract
   - Should handle gracefully

## Integration Tests

Create `backend/tests/test_integration.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_upload_and_validate():
    # Upload
    with open("../samples/sample_contract.txt", "rb") as f:
        response = client.post(
            "/api/upload",
            files={"file": ("test.txt", f, "text/plain")}
        )
    assert response.status_code == 200
    contract_id = response.json()["contract_id"]
    
    # Validate
    response = client.get(f"/api/validate/{contract_id}")
    assert response.status_code == 200
    assert "clauses" in response.json()
```

## Automated Testing

Run tests:
```bash
cd backend
pytest tests/
```

## Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Endee is running and accessible
- [ ] Can upload PDF files
- [ ] Can upload DOCX files
- [ ] Can upload TXT files
- [ ] Invalid files are rejected
- [ ] Validation report displays correctly
- [ ] Risk levels are accurate
- [ ] Recommendations are relevant
- [ ] Missing clauses are identified
- [ ] Similar clauses are found (Endee)
- [ ] API endpoints return correct status codes
- [ ] Error messages are clear
- [ ] Performance is acceptable
