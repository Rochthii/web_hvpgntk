from django.db import models
from apps.users.models import User


class PetitionType(models.Model):
    """Loại đơn từ"""
    
    name = models.CharField(max_length=200, unique=True, verbose_name='Tên loại đơn')
    description = models.TextField(blank=True, verbose_name='Mô tả')
    requires_approval_from = models.JSONField(
        default=list, 
        blank=True,
        verbose_name='Yêu cầu duyệt từ',
        help_text='JSON array: ["rector", "vice_rector", "academic_dean"]'
    )
    auto_approve = models.BooleanField(default=False, verbose_name='Tự động duyệt')
    max_processing_days = models.IntegerField(default=7, verbose_name='Số ngày xử lý tối đa')
    is_active = models.BooleanField(default=True, verbose_name='Đang sử dụng')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'petition_types'
        verbose_name = 'Loại đơn từ'
        verbose_name_plural = 'Loại đơn từ'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Petition(models.Model):
    """Đơn từ"""
    
    STATUS_CHOICES = [
        ('DRAFT', 'Nháp'),
        ('SUBMITTED', 'Đã nộp'),
        ('IN_REVIEW', 'Đang xét duyệt'),
        ('APPROVED', 'Đã duyệt'),
        ('REJECTED', 'Từ chối'),
    ]
    
    petitioner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='petitions', verbose_name='Người nộp đơn')
    petition_type = models.ForeignKey(PetitionType, on_delete=models.PROTECT, related_name='petitions', verbose_name='Loại đơn')
    title = models.CharField(max_length=300, verbose_name='Tiêu đề')
    content = models.TextField(verbose_name='Nội dung')
    attachment_url = models.URLField(blank=True, verbose_name='File đính kèm')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT', verbose_name='Trạng thái')
    submitted_at = models.DateTimeField(null=True, blank=True, verbose_name='Thời gian nộp')
    processed_at = models.DateTimeField(null=True, blank=True, verbose_name='Thời gian xử lý')
    processing_deadline = models.DateField(null=True, blank=True, verbose_name='Hạn xử lý')
    
    final_decision = models.TextField(blank=True, verbose_name='Quyết định cuối cùng')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'petitions'
        verbose_name = 'Đơn từ'
        verbose_name_plural = 'Đơn từ'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['petitioner', 'status']),
            models.Index(fields=['status', 'submitted_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.petitioner.email}"


class PetitionHistory(models.Model):
    """Lịch sử duyệt đơn"""
    
    ACTION_CHOICES = [
        ('SUBMITTED', 'Đã nộp'),
        ('REVIEWED', 'Đã xem'),
        ('COMMENTED', 'Nhận xét'),
        ('APPROVED', 'Đã duyệt'),
        ('REJECTED', 'Từ chối'),
        ('REQUESTED_CHANGES', 'Yêu cầu sửa'),
    ]
    
    petition = models.ForeignKey(Petition, on_delete=models.CASCADE, related_name='history', verbose_name='Đơn từ')
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='petition_actions', verbose_name='Người thực hiện')
    action = models.CharField(max_length=30, choices=ACTION_CHOICES, verbose_name='Hành động')
    comment = models.TextField(blank=True, verbose_name='Nhận xét')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Thời gian')
    
    class Meta:
        db_table = 'petition_history'
        verbose_name = 'Lịch sử đơn từ'
        verbose_name_plural = 'Lịch sử đơn từ'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.petition.title} - {self.get_action_display()} - {self.timestamp}"
