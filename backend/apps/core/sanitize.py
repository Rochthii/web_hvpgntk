"""
HTML Sanitization Utilities
Protects against XSS attacks by cleaning user-generated HTML content.
"""
import bleach


# Allowed HTML tags for content (CKEditor output)
ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 'b', 'i', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img',
    'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
]

# Allowed attributes for specific tags
ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'p': ['style'],
    'span': ['style'],
    'div': ['style'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan'],
}

# Allowed CSS properties (for inline styles)
ALLOWED_STYLES = [
    'color', 'background-color', 'font-size', 'font-weight',
    'text-align', 'text-decoration', 'font-style',
    'margin', 'padding',
]


def sanitize_html(html_content: str) -> str:
    """
    Sanitize HTML content to prevent XSS attacks.
    
    Args:
        html_content: Raw HTML string from user input
        
    Returns:
        Cleaned HTML string with only allowed tags/attributes
    """
    if not html_content:
        return ''
    
    return bleach.clean(
        html_content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        styles=ALLOWED_STYLES,
        strip=True,  # Strip disallowed tags instead of escaping
    )


def sanitize_plain_text(text: str) -> str:
    """
    Completely strip all HTML tags from text.
    Use for fields that should be plain text only.
    
    Args:
        text: Input text that may contain HTML
        
    Returns:
        Plain text with all HTML removed
    """
    if not text:
        return ''
    
    return bleach.clean(text, tags=[], strip=True)
