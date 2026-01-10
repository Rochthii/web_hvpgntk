from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.users.models import User


class AdmissionPeriod(models.Model):
    """Đợt tuyển sinh"""
    
    STATUS_CHOICES = [
        ('UPCOMING', 'Sắp mở'),
        ('OPEN', 'Đang mở'),
        ('CLOSED', 'Đã đóng'),
        ('COMPLETED', 'Hoàn thành'),
    ]
    
    admission_year = models.CharField(max_length=20, verbose_name='Năm học')  # 2024-2025
    application_start_date = models.DateField(verbose_name='Ngày bắt đầu nhận hồ sơ')
    application_end_date = models.DateField(verbose_name='Ngày kết thúc nhận hồ sơ')
    result_announcement_date = models.DateField(verbose_name='Ngày công bố kết quả', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UPCOMING', verbose_name='Trạng thái')
    notes = models.TextField(blank=True, verbose_name='Ghi chú')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admission_periods'
        verbose_name = 'Đợt tuyển sinh'
        verbose_name_plural = 'Đợt tuyển sinh'
        ordering = ['-admission_year']
    
    def __str__(self):
        return f"Tuyển sinh {self.admission_year}"


class AdmissionApplication(models.Model):
    """Đơn xin nhập học"""
    
    STATUS_CHOICES = [
        ('DRAFT', 'Nháp'),
        ('SUBMITTED', 'Đã nộp'),
        ('REVIEWING', 'Đang xét duyệt'),
        ('APPROVED', 'Đã duyệt'),
        ('REJECTED', 'Từ chối'),
    ]
    
    admission_period = models.ForeignKey(AdmissionPeriod, on_delete=models.CASCADE, related_name='applications', verbose_name='Đợt tuyển sinh')
    
    # Thông tin cá nhân
    applicant_name = models.CharField(max_length=200, verbose_name='Họ tên')
    date_of_birth = models.DateField(verbose_name='Ngày sinh')
    place_of_birth = models.CharField(max_length=200, verbose_name='Nơi sinh')  # ភូមិកំណើត
    current_residence = models.TextField(verbose_name='Nơi ở hiện tại')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Điện thoại')
    email = models.EmailField(blank=True, verbose_name='Email')
    
    # Thông tin tu học
    is_ordained = models.BooleanField(default=False, verbose_name='Đã xuất gia')
    monk_name = models.CharField(max_length=200, blank=True, verbose_name='Pháp danh')
    ordination_date = models.DateField(null=True, blank=True, verbose_name='Ngày xuất gia')
    vassa_count = models.IntegerField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name='Tuổi hạ'
    )
    home_temple = models.CharField(max_length=200, blank=True, verbose_name='Chùa quản lý')
    recommending_monk = models.CharField(max_length=200, blank=True, verbose_name='Sư giới thiệu')
    
    # Hồ sơ đính kèm (JSON)
    documents = models.JSONField(
        default=dict, 
        blank=True,
        verbose_name='Tài liệu đính kèm',
        help_text='JSON: {birth_cert_url, monk_cert_url, recommendation_letter_url}'
    )
    
    # Trạng thái
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT', verbose_name='Trạng thái')
    submitted_at = models.DateTimeField(null=True, blank=True, verbose_name='Thời gian nộp')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_applications', verbose_name='Người duyệt')
    reviewed_at = models.DateTimeField(null=True, blank=True, verbose_name='Thời gian duyệt')
    rejection_reason = models.TextField(blank=True, verbose_name='Lý do từ chối')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admission_applications'
        verbose_name = 'Đơn nhập học'
        verbose_name_plural = 'Đơn nhập học'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['admission_period', 'status']),
        ]
    
    def __str__(self):
        return f"{self.applicant_name} - {self.admission_period.admission_year}"
