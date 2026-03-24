from pathlib import Path
from typing import Optional


class FileValidator:
    """Validate uploaded files"""
    
    ALLOWED_EXTENSIONS = {'.pdf', '.docx', '.txt'}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    
    @staticmethod
    def validate_extension(filename: str) -> bool:
        """Check if file extension is allowed"""
        ext = Path(filename).suffix.lower()
        return ext in FileValidator.ALLOWED_EXTENSIONS
    
    @staticmethod
    def validate_size(file_size: int) -> bool:
        """Check if file size is within limits"""
        return file_size <= FileValidator.MAX_FILE_SIZE
    
    @staticmethod
    def get_error_message(filename: str, file_size: Optional[int] = None) -> str:
        """Generate appropriate error message"""
        if not FileValidator.validate_extension(filename):
            return f"Invalid file type. Allowed: {', '.join(FileValidator.ALLOWED_EXTENSIONS)}"
        
        if file_size and not FileValidator.validate_size(file_size):
            max_mb = FileValidator.MAX_FILE_SIZE / (1024 * 1024)
            return f"File too large. Maximum size: {max_mb}MB"
        
        return "File validation failed"
