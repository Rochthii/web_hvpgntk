"""
Audit Logging Utilities
Helper functions to create audit logs for critical actions.
"""
from apps.core.models import AuditLog


def get_client_ip(request):
    """
    Get client IP address from request.
    Handles X-Forwarded-For header for proxied requests.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        # X-Forwarded-For can contain multiple IPs, get the first one
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def log_audit(user, action, resource_type, resource_id=None, old_values=None, new_values=None, request=None):
    """
    Create an audit log entry.
    
    Args:
        user: User object who performed the action
        action: Action type (e.g., 'LOGIN', 'CREATE', 'UPDATE')
        resource_type: Type of resource affected (e.g., 'AdmissionApplication')
        resource_id: ID of the affected resource (optional)
        old_values: Previous values for UPDATE/DELETE actions (optional)
        new_values: New values for CREATE/UPDATE actions (optional)
        request: Django request object for IP and user agent (optional)
    
    Returns:
        AuditLog: Created audit log instance
    """
    return AuditLog.objects.create(
        user=user,
        action=action,
        resource_type=resource_type,
        resource_id=str(resource_id) if resource_id else None,
        old_values=old_values,
        new_values=new_values,
        ip_address=get_client_ip(request) if request else None,
        user_agent=request.META.get('HTTP_USER_AGENT') if request else None,
    )


def log_login(user, request, success=True):
    """
    Log a login attempt.
    
    Args:
        user: User object
        request: Django request object
        success: Whether login was successful
    """
    return log_audit(
        user=user,
        action='LOGIN',
        resource_type='User',
        resource_id=user.id if user else None,
        new_values={'success': success},
        request=request
    )


def log_logout(user, request):
    """
    Log a logout action.
    
    Args:
        user: User object
        request: Django request object
    """
    return log_audit(
        user=user,
        action='LOGOUT',
        resource_type='User',
        resource_id=user.id,
        request=request
    )


def log_create(user, resource_type, resource_id, new_values, request=None):
    """
    Log a CREATE action.
    """
    return log_audit(
        user=user,
        action='CREATE',
        resource_type=resource_type,
        resource_id=resource_id,
        new_values=new_values,
        request=request
    )


def log_update(user, resource_type, resource_id, old_values, new_values, request=None):
    """
    Log an UPDATE action.
    """
    return log_audit(
        user=user,
        action='UPDATE',
        resource_type=resource_type,
        resource_id=resource_id,
        old_values=old_values,
        new_values=new_values,
        request=request
    )


def log_delete(user, resource_type, resource_id, old_values, request=None):
    """
    Log a DELETE action.
    """
    return log_audit(
        user=user,
        action='DELETE',
        resource_type=resource_type,
        resource_id=resource_id,
        old_values=old_values,
        request=request
    )
