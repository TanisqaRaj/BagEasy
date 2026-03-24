from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ClauseType(str, Enum):
    PAYMENT = "payment"
    TERMINATION = "termination"
    LIABILITY = "liability"
    CONFIDENTIALITY = "confidentiality"
    JURISDICTION = "jurisdiction"
    ARBITRATION = "arbitration"
    INDEMNIFICATION = "indemnification"
    WARRANTY = "warranty"
    INTELLECTUAL_PROPERTY = "intellectual_property"
    FORCE_MAJEURE = "force_majeure"
    OTHER = "other"


class ClauseStatus(str, Enum):
    PRESENT = "present"
    MISSING = "missing"
    AMBIGUOUS = "ambiguous"
    RISKY = "risky"


class Clause(BaseModel):
    id: Optional[str] = None
    type: ClauseType
    text: str
    status: ClauseStatus
    risk_level: RiskLevel
    confidence: float = Field(ge=0.0, le=1.0)
    recommendations: List[str] = []
    similar_clauses: List[str] = []


class ValidationReport(BaseModel):
    contract_id: str
    filename: str
    upload_date: datetime
    clauses: List[Clause]
    overall_risk: RiskLevel
    missing_clauses: List[ClauseType]
    summary: str
    recommendations: List[str]


class ContractUploadResponse(BaseModel):
    contract_id: str
    filename: str
    status: str
    message: str


class ComparisonRequest(BaseModel):
    contract_id_1: str
    contract_id_2: str


class ComparisonResult(BaseModel):
    contract_1: str
    contract_2: str
    differences: List[Dict[str, any]]
    similarity_score: float
    recommendations: List[str]
