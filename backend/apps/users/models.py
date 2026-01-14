"""
User Models for HVPGNTK
Học viện Phật giáo Nam tông Khmer

Models:
- User: Custom user model với email/phone login
- MonkProfile: Hồ sơ Tăng sinh
- LaypersonProfile: Hồ sơ Cư sĩ
"""
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom user manager for email/phone authentication."""
    
    def create_user(self, email=None, phone=None, username=None, password=None, **extra_fields):
        if not email and not phone and not username:
            raise ValueError('User must have either email, phone or username')
        
        if email:
            email = self.normalize_email(email)
        
        user = self.model(email=email, phone=phone, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email=None, phone=None, username=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('user_type', 'layperson')
        
        return self.create_user(email, phone, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User Model for HVPGNTK.
    Supports login with email or phone.
    """
    
    class UserType(models.TextChoices):
        MONK = 'monk', 'Tăng sinh'
        LAYPERSON = 'layperson', 'Cư sĩ'
    
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Quản trị viên'
        ABBOT = 'abbot', 'Hòa thượng'
        TEACHER = 'teacher', 'Giáo thọ'
        STUDENT = 'student', 'Sinh viên'
        ADMISSION = 'admission', 'Ban tuyển sinh'
        CONTENT = 'content', 'Biên tập viên'
        SECRETARY = 'secretary', 'Thư ký'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Login credentials
    email = models.EmailField(unique=True, null=True, blank=True)
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    username = models.CharField(max_length=50, unique=True, null=True, blank=True, verbose_name="Tên đăng nhập / Mã SV")
    
    # User classification
    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.LAYPERSON
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    
    # Settings
    preferred_language = models.CharField(max_length=10, default='km')  # km, vi, en
    
    # Timestamps
    last_login_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='created_users'
    )
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Người dùng'
        verbose_name_plural = 'Người dùng'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
            models.Index(fields=['username']),
            models.Index(fields=['role']),
            models.Index(fields=['user_type']),
        ]
    
    def __str__(self):
        return self.username or self.email or self.phone or str(self.id)
    
    def get_display_name(self):
        """Lấy tên hiển thị dựa trên loại người dùng."""
        if self.user_type == self.UserType.MONK:
            try:
                return f"ភិក្ខុ {self.monk_profile.dharma_name_khmer}"
            except MonkProfile.DoesNotExist:
                return self.username or self.email or self.phone
        else:
            try:
                return self.layperson_profile.full_name
            except LaypersonProfile.DoesNotExist:
                return self.username or self.email or self.phone


class MonkProfile(models.Model):
    """
    Hồ sơ Tăng sinh (Monk Profile).
    Chứa thông tin đặc thù của Tăng sinh.
    """
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Đang học'
        ON_LEAVE = 'on_leave', 'Tạm nghỉ'
        GRADUATED = 'graduated', 'Tốt nghiệp'
        DISROBED = 'disrobed', 'Hoàn tục'
        TRANSFERRED = 'transferred', 'Chuyển trường'
        DECEASED = 'deceased', 'Viên tịch'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='monk_profile'
    )
    
    # Pháp danh (đa ngôn ngữ)
    dharma_name_khmer = models.CharField(max_length=100)  # ភិក្ខុ វីរ៉ាក់
    dharma_name_pali = models.CharField(max_length=100, blank=True)  # Bhikkhu Vīrāk
    dharma_name_vietnamese = models.CharField(max_length=100, blank=True)  # Tỳ kheo Virắc
    
    # Thông tin thế tục
    secular_name = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField()
    place_of_birth = models.JSONField(null=True, blank=True)  # {province, district, commune}
    nationality = models.CharField(max_length=50, default='Việt Nam')
    ethnicity = models.CharField(max_length=50, default='Khmer')
    
    # Thông tin thọ giới
    ordination_temple = models.CharField(max_length=200)  # Chùa xuất gia
    ordination_temple_address = models.TextField(blank=True)
    
    samanera_date = models.DateField(null=True, blank=True)  # Ngày thọ Sa-di
    bhikkhu_date = models.DateField(null=True, blank=True)  # Ngày thọ Tỳ kheo
    
    upajjhaya = models.CharField(max_length=100, blank=True)  # Thầy tế độ
    kammavacacariya = models.CharField(max_length=100, blank=True)  # Thầy Yết-ma
    anusavanaccariya = models.CharField(max_length=100, blank=True)  # Thầy Giáo thọ
    
    # Tuổi hạ (auto-calculated)
    vassa_count = models.IntegerField(default=0)
    vassa_updated_at = models.DateTimeField(null=True, blank=True)
    
    # Tài liệu
    photo_url = models.ImageField(upload_to='monks/photos/', blank=True, null=True, verbose_name="Ảnh chân dung")
    ordination_certificate_url = models.ImageField(upload_to='monks/certs/', blank=True, null=True, verbose_name="Chứng điệp thọ giới")
    id_card_url = models.ImageField(upload_to='monks/ids/', blank=True, null=True, verbose_name="CMND/CCCD")
    
    # Học vấn thế tục
    secular_education = models.JSONField(null=True, blank=True)
    
    # Thông tin học tại Học viện
    student_code = models.CharField(max_length=20, unique=True, null=True, blank=True)
    cohort = models.CharField(max_length=20, blank=True)  # Khóa học
    current_year = models.IntegerField(default=1)  # Năm đang học (1-4)
    
    # Trạng thái
    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    status_reason = models.TextField(blank=True)
    status_changed_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'monk_profiles'
        verbose_name = 'Hồ sơ Tăng sinh'
        verbose_name_plural = 'Hồ sơ Tăng sinh'
        indexes = [
            models.Index(fields=['dharma_name_khmer']),
            models.Index(fields=['vassa_count']),
            models.Index(fields=['status']),
            models.Index(fields=['student_code']),
        ]
    
    def __str__(self):
        return f"ភិក្ខុ {self.dharma_name_khmer}"
    
    def calculate_vassa(self):
        """Tính tuổi hạ dựa trên ngày thọ Tỳ kheo."""
        # TODO: Implement logic tính vassa theo lịch Chhankitek
        pass


class LaypersonProfile(models.Model):
    """
    Hồ sơ Cư sĩ (Layperson Profile).
    Chứa thông tin của sinh viên không phải Tăng.
    """
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Đang học'
        ON_LEAVE = 'on_leave', 'Tạm nghỉ'
        GRADUATED = 'graduated', 'Tốt nghiệp'
        WITHDRAWN = 'withdrawn', 'Nghỉ học'
    
    class Gender(models.TextChoices):
        MALE = 'male', 'Nam'
        FEMALE = 'female', 'Nữ'
        OTHER = 'other', 'Khác'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='layperson_profile'
    )
    
    # Thông tin cá nhân
    full_name = models.CharField(max_length=200)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
        null=True,
        blank=True
    )
    nationality = models.CharField(max_length=50, default='Việt Nam')
    
    # Liên hệ
    address = models.TextField(blank=True)
    emergency_contact = models.JSONField(null=True, blank=True)  # {name, phone, relationship}
    
    # Công việc
    occupation = models.CharField(max_length=100, blank=True)
    workplace = models.CharField(max_length=200, blank=True)
    
    # Thông tin Phật tử (nếu có)
    buddhist_name = models.CharField(max_length=100, blank=True)  # Pháp danh quy y
    refuge_date = models.DateField(null=True, blank=True)  # Ngày quy y
    refuge_temple = models.CharField(max_length=200, blank=True)
    
    # Tài liệu
    photo_url = models.ImageField(upload_to='laypeople/photos/', blank=True, null=True, verbose_name="Ảnh chân dung")
    id_card_url = models.ImageField(upload_to='laypeople/ids/', blank=True, null=True, verbose_name="CMND/CCCD")
    
    # Thông tin học tại Học viện
    student_code = models.CharField(max_length=20, unique=True, null=True, blank=True)
    cohort = models.CharField(max_length=20, blank=True)
    current_year = models.IntegerField(default=1)
    
    # Trạng thái
    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'layperson_profiles'
        verbose_name = 'Hồ sơ Cư sĩ'
        verbose_name_plural = 'Hồ sơ Cư sĩ'
        indexes = [
            models.Index(fields=['full_name']),
            models.Index(fields=['status']),
            models.Index(fields=['student_code']),
        ]
    
    def __str__(self):
        return self.full_name
