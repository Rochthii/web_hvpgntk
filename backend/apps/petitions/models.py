"""
Petitions Models - Enhanced version (merged from approvals + petitions)
Học viện Phật giáo Nam tông Khmer

Quản lý đơn từ của sinh viên với workflow duyệt đa cấp.
"""
from django.db import models
from django.conf import settings
from apps.core.models import BaseModel
from apps.users.models import User


class PetitionType(BaseModel):
    """
    Loại đơn từ.
    
    Enhanced from both apps:
    - approvals.RequestType: code field, is_active
    - petitions.PetitionType: requires_approval_from, auto_approve, max_processing_days
    """
    # Basic info
    name = models.CharField(
        max_length=255, 
        unique=True,
        verbose_name="Tên loại đơn"
    )
    code = models.CharField(
        max_length=50, 
        unique=True,
        verbose_name="Mã loại đơn",
        help_text="Ví dụ: LEAVE, DEFER, TRANSCRIPT"
    )
    description = models.TextField(
        blank=True, 
        verbose_name="Mô tả"
    )
    
    # Approval workflow config
    requires_approval_from = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Yêu cầu duyệt từ",
        help_text='JSON array: ["abbot", "teacher", "admission"]'
    )
    auto_approve = models.BooleanField(
        default=False,
        verbose_name="Tự động duyệt"
    )
    max_processing_days = models.IntegerField(
        default=7,
        verbose_name="Số ngày xử lý tối đa"
    )
    
    # Status
    is_active = models.BooleanField(
        default=True,
        verbose_name="Đang hoạt động"
    )

    class Meta:
        db_table = 'petition_types'
        verbose_name = 'Loại đơn từ'
        verbose_name_plural = 'Loại đơn từ'
        ordering = ['name']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"


class Petition(BaseModel):
    """
    Đơn từ của sinh viên.
    
    Enhanced from both apps:
    - approvals.StudentRequest: attachment FileField, admin_response
    - petitions.Petition: processing_deadline, final_decision, attachment_url
    
    Merged best of both approaches.
    """
    
    STATUS_CHOICES = [
        ('DRAFT', 'Nháp'),
        ('SUBMITTED', 'Đã nộp'),
        ('IN_REVIEW', 'Đang xét duyệt'),
        ('APPROVED', 'Đã duyệt'),
        ('REJECTED', 'Từ chối'),
        ('CANCELLED', 'Đã hủy'),
    ]
    
    # Core fields
    petitioner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='petitions',
        verbose_name="Người nộp đơn"
    )
    petition_type = models.ForeignKey(
        PetitionType,
        on_delete=models.PROTECT,
        related_name='petitions',
        verbose_name="Loại đơn"
    )
    
    # Content
    title = models.CharField(
        max_length=300,
        verbose_name="Tiêu đề"
    )
    reason = models.TextField(
        verbose_name="Lý do / Nội dung"
    )
    
    # Attachments - dual support for backwards compat
    attachment = models.FileField(
        upload_to='petitions/attachments/',
        blank=True,
        null=True,
        verbose_name="Tệp đính kèm (upload)"
    )
    attachment_url = models.URLField(
        blank=True,
        verbose_name="File đính kèm (URL)"
    )
    
    # Status & workflow
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT',
        verbose_name="Trạng thái"
    )
    submitted_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Thời gian nộp"
    )
    processed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Thời gian xử lý"
    )
    processing_deadline = models.DateField(
        null=True,
        blank=True,
        verbose_name="Hạn xử lý"
    )
    
    # Admin response & decision
    admin_response = models.TextField(
        blank=True,
        verbose_name="Phản hồi của Ban Giám hiệu"
    )
    final_decision = models.TextField(
        blank=True,
        verbose_name="Quyết định cuối cùng"
    )

    class Meta:
        db_table = 'petitions'
        verbose_name = 'Đơn từ'
        verbose_name_plural = 'Đơn từ'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['petitioner', 'status']),
            models.Index(fields=['status', 'submitted_at']),
            models.Index(fields=['petition_type']),
        ]

    def __str__(self):
        return f"{self.title} - {self.petitioner.get_display_name()}"


class PetitionHistory(BaseModel):
    """
    Lịch sử duyệt đơn từ.
    
    Enhanced from both apps:
    - approvals.ApprovalLog: simpler action field
    - petitions.PetitionHistory: richer ACTION_CHOICES
    
    Merged to support both simple and detailed tracking.
    """
    
    ACTION_CHOICES = [
        ('SUBMITTED', 'Đã nộp'),
        ('VIEWED', 'Đã xem'),
        ('REVIEWED', 'Đã xem xét'),
        ('COMMENTED', 'Nhận xét'),
        ('APPROVED', 'Đã duyệt'),
        ('REJECTED', 'Từ chối'),
        ('REQUESTED_CHANGES', 'Yêu cầu sửa'),
        ('CANCELLED', 'Đã hủy'),
    ]
    
    petition = models.ForeignKey(
        Petition,
        on_delete=models.CASCADE,
        related_name='history',
        verbose_name="Đơn từ"
    )
    actor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='petition_actions',
        verbose_name="Người thực hiện"
    )
    action = models.CharField(
        max_length=50,
        choices=ACTION_CHOICES,
        verbose_name="Hành động"
    )
    note = models.TextField(
        blank=True,
        verbose_name="Ghi chú / Nhận xét"
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Thời gian"
    )

    class Meta:
        db_table = 'petition_history'
        verbose_name = 'Lịch sử đơn từ'
        verbose_name_plural = 'Lịch sử đơn từ'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['petition', 'action']),
            models.Index(fields=['actor']),
        ]

    def __str__(self):
        action_display = self.get_action_display()
        return f"{self.petition.title} - {action_display} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
