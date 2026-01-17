"""
File Upload Validation Utilities
Protects against malicious file uploads by verifying file types using magic bytes.
"""
import magic
from django.core.exceptions import ValidationError


# Allowed MIME types for image uploads
ALLOWED_IMAGE_MIMES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
]

# Allowed MIME types for document uploads
ALLOWED_DOCUMENT_MIMES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]


def validate_image_file(file_content: bytes, filename: str = None) -> bool:
    """
    Validate that uploaded file is actually an image using magic bytes.
    
    Args:
        file_content: Raw file bytes
        filename: Optional filename for better error messages
        
    Returns:
        True if valid image
        
    Raises:
        ValidationError if not a valid image
    """
    mime = magic.from_buffer(file_content, mime=True)
    
    if mime not in ALLOWED_IMAGE_MIMES:
        raise ValidationError(
            f'File "{filename or "unknown"}" is not a valid image. '
            f'Detected type: {mime}. Allowed types: JPEG, PNG, GIF, WebP.'
        )
    
    return True


def validate_document_file(file_content: bytes, filename: str = None) -> bool:
    """
    Validate that uploaded file is an allowed document type.
    
    Args:
        file_content: Raw file bytes
        filename: Optional filename for better error messages
        
    Returns:
        True if valid document
        
    Raises:
        ValidationError if not a valid document
    """
    mime = magic.from_buffer(file_content, mime=True)
    
    if mime not in ALLOWED_DOCUMENT_MIMES:
        raise ValidationError(
            f'File "{filename or "unknown"}" is not an allowed document type. '
            f'Detected type: {mime}. Allowed types: PDF, Word, Excel.'
        )
    
    return True


def get_file_mime_type(file_content: bytes) -> str:
    """
    Get the actual MIME type of a file using magic bytes.
    
    Args:
        file_content: Raw file bytes
        
    Returns:
        MIME type string (e.g., 'image/jpeg')
    """
    return magic.from_buffer(file_content, mime=True)
