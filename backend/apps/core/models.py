"""
Core Models - FileUpload, AuditLog
"""
import uuid
from django.db import models
from django.conf import settings


class FileUpload(models.Model):
    """
    Model for managing file uploads.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    original_name = models.CharField(max_length=255)
    stored_name = models.CharField(max_length=255)
    file_path = models.TextField()
    file_url = models.URLField()
    
    file_type = models.CharField(max_length=50, blank=True)
    mime_type = models.CharField(max_length=100, blank=True)
    file_size_bytes = models.BigIntegerField(null=True, blank=True)
    
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_files'
    )
    
    # Link to entity
    entity_type = models.CharField(max_length=50, blank=True)
    entity_id = models.UUIDField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'file_uploads'
        verbose_name = 'File upload'
        verbose_name_plural = 'File uploads'
        indexes = [
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['uploaded_by']),
        ]
    
    def __str__(self):
        return self.original_name


class AuditLog(models.Model):
    """
    Model for system audit logs.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_logs'
    )
    
    action = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=50)
    resource_id = models.UUIDField(null=True, blank=True)
    
    old_values = models.JSONField(null=True, blank=True)
    new_values = models.JSONField(null=True, blank=True)
    
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_logs'
        verbose_name = 'Audit Log'
        verbose_name_plural = 'Audit Logs'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['resource_type', 'resource_id']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.action} - {self.resource_type} - {self.created_at}"


class Notification(models.Model):
    """
    Model for user notifications.
    """
    class NotificationType(models.TextChoices):
        INFO = 'info', 'Thông tin'
        SUCCESS = 'success', 'Thành công'
        WARNING = 'warning', 'Cảnh báo'
        ERROR = 'error', 'Lỗi'
        SYSTEM = 'system', 'Hệ thống'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    
    title = models.CharField(max_length=200)
    message = models.TextField(blank=True)
    link = models.CharField(max_length=255, blank=True)
    
    type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
        default=NotificationType.INFO
    )
    
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Thông báo'
        verbose_name_plural = 'Thông báo'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
