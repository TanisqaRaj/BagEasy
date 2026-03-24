import re
from typing import List, Tuple
from app.models import ClauseType


class ClauseDetector:
    """Detect and classify contract clauses"""
    
    # Keywords for each clause type
    CLAUSE_KEYWORDS = {
        ClauseType.PAYMENT: [
            "payment", "fee", "compensation", "invoice", "price", 
            "cost", "remuneration", "salary", "wage"
        ],
        ClauseType.TERMINATION: [
            "termination", "terminate", "cancel", "cancellation", 
            "end", "expiry", "expiration", "notice period"
        ],
        ClauseType.LIABILITY: [
            "liability", "liable", "damages", "loss", "harm", 
            "injury", "responsible", "accountability"
        ],
        ClauseType.CONFIDENTIALITY: [
            "confidential", "confidentiality", "non-disclosure", 
            "nda", "secret", "proprietary", "private"
        ],
        ClauseType.JURISDICTION: [
            "jurisdiction", "governing law", "applicable law", 
            "venue", "forum", "court"
        ],
        ClauseType.ARBITRATION: [
            "arbitration", "arbitrator", "dispute resolution", 
            "mediation", "mediator"
        ],
        ClauseType.INDEMNIFICATION: [
            "indemnify", "indemnification", "hold harmless", 
            "defend", "indemnity"
        ],
        ClauseType.WARRANTY: [
            "warranty", "warrant", "guarantee", "representation", 
            "assurance"
        ],
        ClauseType.INTELLECTUAL_PROPERTY: [
            "intellectual property", "ip", "copyright", "trademark", 
            "patent", "trade secret", "proprietary rights"
        ],
        ClauseType.FORCE_MAJEURE: [
            "force majeure", "act of god", "unforeseeable", 
            "beyond control", "natural disaster"
        ]
    }
    
    @staticmethod
    def classify_clause(text: str) -> ClauseType:
        """
        Classify a clause based on its content
        
        Args:
            text: Clause text
            
        Returns:
            ClauseType enum value
        """
        text_lower = text.lower()
        scores = {}
        
        for clause_type, keywords in ClauseDetector.CLAUSE_KEYWORDS.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            scores[clause_type] = score
        
        # Return type with highest score
        if max(scores.values()) > 0:
            return max(scores, key=scores.get)
        
        return ClauseType.OTHER

    
    @staticmethod
    def detect_all_clauses(clauses: List[str]) -> List[Tuple[str, ClauseType]]:
        """
        Detect and classify all clauses in a contract
        
        Args:
            clauses: List of clause texts
            
        Returns:
            List of (text, type) tuples
        """
        classified = []
        for clause in clauses:
            clause_type = ClauseDetector.classify_clause(clause)
            classified.append((clause, clause_type))
        
        return classified
    
    @staticmethod
    def find_missing_clauses(
        detected_types: List[ClauseType]
    ) -> List[ClauseType]:
        """
        Identify critical clauses that are missing
        
        Args:
            detected_types: List of detected clause types
            
        Returns:
            List of missing critical clause types
        """
        critical_clauses = {
            ClauseType.PAYMENT,
            ClauseType.TERMINATION,
            ClauseType.LIABILITY,
            ClauseType.CONFIDENTIALITY,
            ClauseType.JURISDICTION
        }
        
        detected_set = set(detected_types)
        missing = critical_clauses - detected_set
        
        return list(missing)
    
    @staticmethod
    def extract_key_terms(text: str) -> List[str]:
        """Extract important terms from clause text"""
        # Remove common words
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 
            'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was'
        }
        
        # Extract words
        words = re.findall(r'\b[a-z]{3,}\b', text.lower())
        
        # Filter stop words
        key_terms = [w for w in words if w not in stop_words]
        
        # Return unique terms
        return list(set(key_terms))[:10]
