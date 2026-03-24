import os
import re
from typing import List, Tuple
import PyPDF2
import docx
from pathlib import Path


class DocumentProcessor:
    """Extract text from various document formats"""
    
    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Extract text from PDF, DOCX, or TXT files
        
        Args:
            file_path: Path to the document
            
        Returns:
            Extracted text content
        """
        extension = Path(file_path).suffix.lower()
        
        if extension == '.pdf':
            return DocumentProcessor._extract_from_pdf(file_path)
        elif extension == '.docx':
            return DocumentProcessor._extract_from_docx(file_path)
        elif extension == '.txt':
            return DocumentProcessor._extract_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file format: {extension}")
    
    @staticmethod
    def _extract_from_pdf(file_path: str) -> str:
        """Extract text from PDF"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            raise Exception(f"Error extracting PDF: {str(e)}")
        return text.strip()
    
    @staticmethod
    def _extract_from_docx(file_path: str) -> str:
        """Extract text from DOCX"""
        try:
            doc = docx.Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        except Exception as e:
            raise Exception(f"Error extracting DOCX: {str(e)}")
        return text.strip()

    
    @staticmethod
    def _extract_from_txt(file_path: str) -> str:
        """Extract text from TXT"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
        except Exception as e:
            raise Exception(f"Error extracting TXT: {str(e)}")
        return text.strip()
    
    @staticmethod
    def segment_into_clauses(text: str) -> List[str]:
        """
        Segment contract text into individual clauses
        
        Args:
            text: Full contract text
            
        Returns:
            List of clause texts
        """
        # Clean text
        text = re.sub(r'\s+', ' ', text)
        
        # Split by common clause patterns
        patterns = [
            r'\n\d+\.',  # Numbered clauses
            r'\n[A-Z][a-z]+:',  # Named clauses
            r'\n\([a-z]\)',  # Lettered sub-clauses
            r'\n(?=[A-Z][A-Z\s]+\n)',  # All caps headers
        ]
        
        # Split by paragraphs as fallback
        clauses = text.split('\n\n')
        
        # Filter out very short segments
        clauses = [c.strip() for c in clauses if len(c.strip()) > 50]
        
        return clauses
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s.,;:!?()\-]', '', text)
        return text.strip()
