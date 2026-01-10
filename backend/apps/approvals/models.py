from django.db import models
from django.conf import settings
import uuid

class BaseModel(models.Model):
    """
    Abstract base model with UUID primary key and timestamps.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày tạo")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Ngày cập nhật")

    class Meta:
        abstract = True

class RequestType(BaseModel):
    """
    Loại yêu cầu (Ví dụ: Xin nghỉ học, Bảo lưu, Xin bảng điểm...)
    """
    name = models.CharField(max_length=255, verbose_name="Tên loại đơn")
    code = models.CharField(max_length=50, unique=True, verbose_name="Mã loại đơn")
    description = models.TextField(blank=True, null=True, verbose_name="Mô tả")
    is_active = models.BooleanField(default=True, verbose_name="Đang hoạt động")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Loại đơn từ"
        verbose_name_plural = "Các loại đơn từ"


class StudentRequest(BaseModel):
    """
    Đơn từ của sinh viên gửi
    """
    STATUS_CHOICES = [
        ('PENDING', 'Chờ xử lý'),
        ('REVIEWING', 'Đang xem xét'),
        ('APPROVED', 'Đã duyệt'),
        ('REJECTED', 'Đã từ chối'),
        ('CANCELLED', 'Đã hủy'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='requests',
        verbose_name="Sinh viên"
    )
    request_type = models.ForeignKey(
        RequestType, 
        on_delete=models.PROTECT,
        verbose_name="Loại đơn"
    )
    title = models.CharField(max_length=255, verbose_name="Tiêu đề")
    reason = models.TextField(verbose_name="Lý do")
    
    # File đính kèm (Optional) - Cần cài đặt media root
    attachment = models.FileField(upload_to='requests/attachments/', blank=True, null=True, verbose_name="Tệp đính kèm")

    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='PENDING',
        verbose_name="Trạng thái"
    )
    
    # Phản hồi của admin (lý do từ chối hoặc ghi chú duyệt)
    admin_response = models.TextField(blank=True, null=True, verbose_name="Phản hồi của GV")

    def __str__(self):
        return f"[{self.status}] {self.title} - {self.student.display_name}"

    class Meta:
        verbose_name = "Đơn từ sinh viên"
        verbose_name_plural = "Danh sách đơn từ"
        ordering = ['-created_at']


class ApprovalLog(BaseModel):
    """
    Lịch sử duyệt đơn
    """
    request = models.ForeignKey(StudentRequest, on_delete=models.CASCADE, related_name='logs')
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name="Người thực hiện")
    action = models.CharField(max_length=50, verbose_name="Hành động") # Approve, Reject, Comment
    note = models.TextField(blank=True, null=True, verbose_name="Ghi chú")
    
    class Meta:
        verbose_name = "Lịch sử duyệt"
        verbose_name_plural = "Lịch sử duyệt"
