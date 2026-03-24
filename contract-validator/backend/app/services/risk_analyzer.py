import re
from typing import List, Dict, Tuple
from app.models import RiskLevel, ClauseType, ClauseStatus


class RiskAnalyzer:
    """Analyze contract clauses for risks"""
    
    # Risk patterns for different clause types
    RISK_PATTERNS = {
        ClauseType.LIABILITY: {
            "critical": [
                r"unlimited liability",
                r"no limit.*liability",
                r"full liability",
                r"entire liability"
            ],
            "high": [
                r"liable for all",
                r"responsible for any",
                r"indemnify.*all claims"
            ],
            "medium": [
                r"liable for",
                r"responsible for"
            ]
        },
        ClauseType.TERMINATION: {
            "high": [
                r"no termination",
                r"cannot terminate",
                r"irrevocable"
            ],
            "medium": [
                r"90 days notice",
                r"6 months notice",
                r"one year notice"
            ]
        },
        ClauseType.PAYMENT: {
            "high": [
                r"non-refundable",
                r"no refund",
                r"payment.*advance"
            ],
            "medium": [
                r"late fee",
                r"penalty",
                r"interest"
            ]
        },
        ClauseType.CONFIDENTIALITY: {
            "high": [
                r"perpetual.*confidentiality",
                r"indefinite.*confidentiality"
            ],
            "medium": [
                r"5 years.*confidential",
                r"10 years.*confidential"
            ]
        }
    }
    
    @staticmethod
    def analyze_clause_risk(
        text: str, 
        clause_type: ClauseType
    ) -> Tuple[RiskLevel, List[str]]:
        """
        Analyze risk level of a clause
        
        Args:
            text: Clause text
            clause_type: Type of clause
            
        Returns:
            Tuple of (risk_level, list of reasons)
        """
        text_lower = text.lower()
        reasons = []
        risk_level = RiskLevel.LOW
        
        if clause_type in RiskAnalyzer.RISK_PATTERNS:
            patterns = RiskAnalyzer.RISK_PATTERNS[clause_type]
            
            # Check critical patterns
            if "critical" in patterns:
                for pattern in patterns["critical"]:
                    if re.search(pattern, text_lower):
                        risk_level = RiskLevel.CRITICAL
                        reasons.append(f"Contains critical risk pattern: {pattern}")
            
            # Check high risk patterns
            if risk_level != RiskLevel.CRITICAL and "high" in patterns:
                for pattern in patterns["high"]:
                    if re.search(pattern, text_lower):
                        risk_level = RiskLevel.HIGH
                        reasons.append(f"Contains high risk pattern: {pattern}")
            
            # Check medium risk patterns
            if risk_level == RiskLevel.LOW and "medium" in patterns:
                for pattern in patterns["medium"]:
                    if re.search(pattern, text_lower):
                        risk_level = RiskLevel.MEDIUM
                        reasons.append(f"Contains medium risk pattern: {pattern}")
        
        # Check for ambiguous language
        ambiguous_terms = ["may", "might", "could", "reasonable", "appropriate"]
        if any(term in text_lower for term in ambiguous_terms):
            if risk_level == RiskLevel.LOW:
                risk_level = RiskLevel.MEDIUM
            reasons.append("Contains ambiguous language")
        
        return risk_level, reasons

    
    @staticmethod
    def determine_clause_status(
        clause_type: ClauseType,
        text: str,
        risk_level: RiskLevel
    ) -> ClauseStatus:
        """Determine the status of a clause"""
        if risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
            return ClauseStatus.RISKY
        
        # Check for ambiguous language
        ambiguous_terms = ["may", "might", "could", "reasonable", "appropriate", "as needed"]
        if any(term in text.lower() for term in ambiguous_terms):
            return ClauseStatus.AMBIGUOUS
        
        return ClauseStatus.PRESENT
    
    @staticmethod
    def generate_recommendations(
        clause_type: ClauseType,
        risk_level: RiskLevel,
        status: ClauseStatus
    ) -> List[str]:
        """Generate recommendations based on clause analysis"""
        recommendations = []
        
        if status == ClauseStatus.RISKY:
            if clause_type == ClauseType.LIABILITY:
                recommendations.append(
                    "Consider limiting liability to the contract value or a specific amount"
                )
                recommendations.append(
                    "Add exclusions for indirect, consequential, or punitive damages"
                )
            elif clause_type == ClauseType.TERMINATION:
                recommendations.append(
                    "Negotiate for termination rights with reasonable notice period"
                )
                recommendations.append(
                    "Include termination for convenience clause"
                )
            elif clause_type == ClauseType.PAYMENT:
                recommendations.append(
                    "Negotiate payment terms and refund conditions"
                )
                recommendations.append(
                    "Consider milestone-based payments instead of full advance"
                )
        
        if status == ClauseStatus.AMBIGUOUS:
            recommendations.append(
                "Clarify ambiguous terms with specific definitions"
            )
            recommendations.append(
                "Replace subjective terms with objective criteria"
            )
        
        return recommendations
    
    @staticmethod
    def calculate_overall_risk(clause_risks: List[RiskLevel]) -> RiskLevel:
        """Calculate overall contract risk from individual clause risks"""
        if RiskLevel.CRITICAL in clause_risks:
            return RiskLevel.CRITICAL
        
        high_count = clause_risks.count(RiskLevel.HIGH)
        if high_count >= 2:
            return RiskLevel.HIGH
        elif high_count == 1:
            return RiskLevel.MEDIUM
        
        medium_count = clause_risks.count(RiskLevel.MEDIUM)
        if medium_count >= 3:
            return RiskLevel.MEDIUM
        
        return RiskLevel.LOW
