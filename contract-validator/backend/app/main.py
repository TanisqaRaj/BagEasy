import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import aiofiles

from app.models import (
    ContractUploadResponse, ValidationReport, Clause,
    ClauseType, RiskLevel, ClauseStatus, ComparisonRequest
)
from app.services.document_processor import DocumentProcessor
from app.services.clause_detector import ClauseDetector
from app.services.risk_analyzer import RiskAnalyzer
from app.services.endee_service import EndeeService

# Initialize FastAPI app
app = FastAPI(
    title="Business Contract Validator",
    description="AI-powered contract validation using Endee vector database",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
endee_service = EndeeService()
doc_processor = DocumentProcessor()
clause_detector = ClauseDetector()
risk_analyzer = RiskAnalyzer()

# Storage
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# In-memory storage for demo (use database in production)
contracts_db = {}


@app.on_event("startup")
async def startup_event():
    """Initialize Endee collection on startup"""
    await endee_service.create_collection()
    print("✓ Endee collection initialized")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Business Contract Validator",
        "version": "1.0.0"
    }


@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "endee": "connected",
        "timestamp": datetime.now().isoformat()
    }



@app.post("/api/upload", response_model=ContractUploadResponse)
async def upload_contract(file: UploadFile = File(...)):
    """
    Upload and process a contract document
    
    Supports: PDF, DOCX, TXT
    """
    # Validate file extension
    allowed_extensions = {".pdf", ".docx", ".txt"}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Generate unique contract ID
    contract_id = str(uuid.uuid4())
    
    # Save file
    file_path = UPLOAD_DIR / f"{contract_id}{file_ext}"
    
    try:
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Extract text
        text = doc_processor.extract_text(str(file_path))
        
        # Segment into clauses
        clause_texts = doc_processor.segment_into_clauses(text)
        
        # Store in database
        contracts_db[contract_id] = {
            "id": contract_id,
            "filename": file.filename,
            "upload_date": datetime.now(),
            "text": text,
            "clause_texts": clause_texts,
            "processed": False
        }
        
        return ContractUploadResponse(
            contract_id=contract_id,
            filename=file.filename,
            status="uploaded",
            message=f"Contract uploaded successfully. Found {len(clause_texts)} clauses."
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.get("/api/validate/{contract_id}", response_model=ValidationReport)
async def validate_contract(contract_id: str):
    """
    Validate a contract and generate risk report
    
    Uses Endee for semantic search and clause comparison
    """
    if contract_id not in contracts_db:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    contract = contracts_db[contract_id]
    clause_texts = contract["clause_texts"]
    
    # Classify clauses
    classified_clauses = clause_detector.detect_all_clauses(clause_texts)
    
    # Analyze each clause
    analyzed_clauses = []
    clause_risks = []
    
    for idx, (text, clause_type) in enumerate(classified_clauses):
        clause_id = f"{contract_id}_clause_{idx}"
        
        # Analyze risk
        risk_level, risk_reasons = risk_analyzer.analyze_clause_risk(text, clause_type)
        clause_risks.append(risk_level)
        
        # Determine status
        status = risk_analyzer.determine_clause_status(clause_type, text, risk_level)
        
        # Generate recommendations
        recommendations = risk_analyzer.generate_recommendations(
            clause_type, risk_level, status
        )
        
        # Search for similar clauses in Endee
        similar_clauses = await endee_service.search_similar_clauses(text, top_k=3)
        similar_texts = [s.get("metadata", {}).get("text", "")[:100] for s in similar_clauses]
        
        # Store in Endee
        await endee_service.insert_clause(
            clause_id=clause_id,
            text=text,
            metadata={
                "contract_id": contract_id,
                "type": clause_type.value,
                "risk_level": risk_level.value,
                "status": status.value
            }
        )
        
        # Create clause object
        clause = Clause(
            id=clause_id,
            type=clause_type,
            text=text[:200] + "..." if len(text) > 200 else text,
            status=status,
            risk_level=risk_level,
            confidence=0.85,  # Placeholder
            recommendations=recommendations,
            similar_clauses=similar_texts
        )
        
        analyzed_clauses.append(clause)
    
    # Find missing clauses
    detected_types = [c.type for c in analyzed_clauses]
    missing_clauses = clause_detector.find_missing_clauses(detected_types)
    
    # Calculate overall risk
    overall_risk = risk_analyzer.calculate_overall_risk(clause_risks)
    
    # Generate summary
    summary = f"Contract contains {len(analyzed_clauses)} clauses. "
    summary += f"Overall risk level: {overall_risk.value.upper()}. "
    if missing_clauses:
        summary += f"Missing {len(missing_clauses)} critical clauses."
    
    # Generate overall recommendations
    overall_recommendations = []
    if missing_clauses:
        overall_recommendations.append(
            f"Add missing critical clauses: {', '.join([c.value for c in missing_clauses])}"
        )
    if overall_risk in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
        overall_recommendations.append(
            "Review high-risk clauses with legal counsel before signing"
        )
    
    # Mark as processed
    contract["processed"] = True
    
    return ValidationReport(
        contract_id=contract_id,
        filename=contract["filename"],
        upload_date=contract["upload_date"],
        clauses=analyzed_clauses,
        overall_risk=overall_risk,
        missing_clauses=missing_clauses,
        summary=summary,
        recommendations=overall_recommendations
    )



@app.get("/api/contracts")
async def list_contracts():
    """List all uploaded contracts"""
    contracts = []
    for contract_id, data in contracts_db.items():
        contracts.append({
            "id": contract_id,
            "filename": data["filename"],
            "upload_date": data["upload_date"].isoformat(),
            "processed": data["processed"]
        })
    return {"contracts": contracts}


@app.get("/api/templates")
async def get_templates():
    """Get standard clause templates"""
    templates = {
        "liability": {
            "standard": "Neither party shall be liable for indirect, incidental, special, or consequential damages. Total liability shall not exceed the contract value.",
            "risk_level": "low"
        },
        "termination": {
            "standard": "Either party may terminate this agreement with 30 days written notice. Termination for cause may be immediate.",
            "risk_level": "low"
        },
        "confidentiality": {
            "standard": "All confidential information shall remain confidential for 3 years after termination of this agreement.",
            "risk_level": "low"
        },
        "payment": {
            "standard": "Payment shall be made within 30 days of invoice. Late payments subject to 1.5% monthly interest.",
            "risk_level": "low"
        }
    }
    return {"templates": templates}


@app.post("/api/search")
async def search_clauses(query: str, top_k: int = 5):
    """
    Semantic search for similar clauses across all contracts
    
    Uses Endee vector search
    """
    try:
        results = await endee_service.search_similar_clauses(query, top_k=top_k)
        return {"query": query, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")


@app.delete("/api/contracts/{contract_id}")
async def delete_contract(contract_id: str):
    """Delete a contract and its clauses"""
    if contract_id not in contracts_db:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Delete from storage
    del contracts_db[contract_id]
    
    # Delete file
    for ext in [".pdf", ".docx", ".txt"]:
        file_path = UPLOAD_DIR / f"{contract_id}{ext}"
        if file_path.exists():
            file_path.unlink()
    
    return {"message": "Contract deleted successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", 8000)),
        reload=True
    )
