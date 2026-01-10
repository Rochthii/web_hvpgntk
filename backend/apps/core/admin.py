"""
Django Admin for Core App
"""
from django.contrib import admin
from .models import FileUpload, AuditLog, Notification


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """
    Admin for viewing audit logs (read-only for security).
    """
    list_display = ('created_at', 'user', 'action', 'resource_type', 'resource_id', 'ip_address')
    list_filter = ('action', 'resource_type', 'created_at')
    search_fields = ('user__email', 'user__phone', 'resource_type', 'resource_id', 'ip_address')
    readonly_fields = ('user', 'action', 'resource_type', 'resource_id', 'old_values', 'new_values', 'ip_address', 'user_agent', 'created_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    def has_add_permission(self, request):
        # Audit logs should not be manually created
        return False
    
    def has_delete_permission(self, request, obj=None):
        # Audit logs should not be deleted (immutable)
        return False
    
    def has_change_permission(self, request, obj=None):
        # Audit logs are read-only
        return False


@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    """
    Admin for file uploads.
    """
    list_display = ('original_name', 'file_type', 'uploaded_by', 'created_at')
    list_filter = ('file_type', 'entity_type', 'created_at')
    search_fields = ('original_name', 'uploaded_by__email')
    readonly_fields = ('id', 'created_at')
    date_hierarchy = 'created_at'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """
    Admin for notifications.
    """
    list_display = ('title', 'user', 'type', 'is_read', 'created_at')
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'user__email')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
