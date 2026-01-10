from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, DecimalValidator
from decimal import Decimal
from apps.users.models import User


class AcademicYear(models.Model):
    """Năm học"""
    
    year_code = models.CharField(max_length=20, unique=True, verbose_name='Mã năm học')  # 2024-2025
    start_date = models.DateField(verbose_name='Ngày bắt đầu')
    end_date = models.DateField(verbose_name='Ngày kết thúc')
    is_current = models.BooleanField(default=False, verbose_name='Năm học hiện tại')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'academic_years'
        verbose_name = 'Năm học'
        verbose_name_plural = 'Năm học'
        ordering = ['-year_code']
    
    def __str__(self):
        return self.year_code


class Semester(models.Model):
    """Học kỳ"""
    
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name='semesters', verbose_name='Năm học')
    semester_number = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(3)], verbose_name='Học kỳ số')
    start_date = models.DateField(verbose_name='Ngày bắt đầu')
    end_date = models.DateField(verbose_name='Ngày kết thúc')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'semesters'
        verbose_name = 'Học kỳ'
        verbose_name_plural = 'Học kỳ'
        ordering = ['-academic_year', 'semester_number']
        unique_together = ['academic_year', 'semester_number']
    
    def __str__(self):
        return f"{self.academic_year.year_code} - HK{self.semester_number}"


class Course(models.Model):
    """Môn học"""
    
    LEVEL_CHOICES = [
        ('FOUNDATIONAL', 'Cơ bản'),
        ('INTERMEDIATE', 'Trung cấp'),
        ('ADVANCED', 'Nâng cao'),
    ]
    
    CATEGORY_CHOICES = [
        ('REQUIRED', 'Bắt buộc'),
        ('ELECTIVE', 'Tự chọn'),
        ('GENERAL', 'Đại cương'),
        ('SPECIALIZED', 'Chuyên ngành'),
    ]

    KNOWLEDGE_BLOCK_CHOICES = [
        ('VINAYA', 'Giới luật'),
        ('ABHIDHAMMA', 'Vi Diệu Pháp'),
        ('SUTTA', 'Kinh tạng'),
        ('PALI_LANGUAGE', 'Tiếng Pali'),
        ('BUDDHIST_HISTORY', 'Lịch sử Phật giáo'),
        ('PRACTICE', 'Thực hành'),
        ('GENERAL_EDUCATION', 'Giáo dục đại cương'),
        ('OTHER', 'Khác'),
    ]
    
    code = models.CharField(max_length=20, unique=True, verbose_name='Mã môn học')  # PG101, VIN201
    name_vi = models.CharField(max_length=200, verbose_name='Tên tiếng Việt')
    name_pali = models.CharField(max_length=200, blank=True, verbose_name='Tên Pali')
    credits = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], verbose_name='Số tín chỉ')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, verbose_name='Cấp độ')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='REQUIRED', verbose_name='Loại')
    knowledge_block = models.CharField(max_length=30, choices=KNOWLEDGE_BLOCK_CHOICES, default='OTHER', verbose_name='Khối kiến thức')
    description = models.TextField(blank=True, verbose_name='Mô tả')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'courses'
        verbose_name = 'Môn học'
        verbose_name_plural = 'Môn học'
        ordering = ['level', 'code']
    
    def __str__(self):
        return f"{self.code} - {self.name_vi}"


class Class(models.Model):
    """Lớp học"""
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='classes', verbose_name='Môn học')
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='classes', verbose_name='Học kỳ')
    class_code = models.CharField(max_length=50, verbose_name='Mã lớp')  # PG101-01-HK1-2024
    instructor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='teaching_classes', verbose_name='Giảng viên')
    room = models.CharField(max_length=50, blank=True, verbose_name='Phòng học')
    schedule = models.JSONField(default=dict, blank=True, verbose_name='Lịch học', help_text='JSON: {day_of_week, start_time, end_time}')
    max_students = models.IntegerField(default=30, validators=[MinValueValidator(1)], verbose_name='Sĩ số tối đa')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'classes'
        verbose_name = 'Lớp học'
        verbose_name_plural = 'Lớp học'
        ordering = ['-semester', 'course']
        unique_together = ['class_code', 'semester']
    
    def __str__(self):
        return f"{self.course.code} - {self.class_code}"


class Enrollment(models.Model):
    """Đăng ký học"""
    
    STATUS_CHOICES = [
        ('ENROLLED', 'Đang học'),
        ('COMPLETED', 'Hoàn thành'),
        ('DROPPED', 'Đã bỏ'),
        ('FAILED', 'Không đạt'),
    ]
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments', verbose_name='Học viên')
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='enrollments', verbose_name='Lớp học')
    enrollment_date = models.DateField(auto_now_add=True, verbose_name='Ngày đăng ký')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ENROLLED', verbose_name='Trạng thái')
    drop_date = models.DateField(null=True, blank=True, verbose_name='Ngày bỏ học')
    drop_reason = models.TextField(blank=True, verbose_name='Lý do bỏ học')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'enrollments'
        verbose_name = 'Đăng ký học'
        verbose_name_plural = 'Đăng ký học'
        ordering = ['-enrollment_date']
        unique_together = ['student', 'class_instance']
        indexes = [
            models.Index(fields=['student', 'status']),
        ]
    
    def __str__(self):
        return f"{self.student.email} - {self.class_instance.course.code}"


class Grade(models.Model):
    """Điểm số"""
    
    GRADE_LETTER_CHOICES = [
        ('A', 'A (4.0)'),
        ('B+', 'B+ (3.5)'),
        ('B', 'B (3.0)'),
        ('C+', 'C+ (2.5)'),
        ('C', 'C (2.0)'),
        ('D', 'D (1.0)'),
        ('F', 'F (0.0)'),
    ]
    
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE, related_name='grade', verbose_name='Đăng ký học')
    midterm_score = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('100'))],
        verbose_name='Điểm giữa kỳ'
    )
    final_score = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('100'))],
        verbose_name='Điểm cuối kỳ'
    )
    attendance_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('100'))],
        verbose_name='Tỷ lệ tham dự (%)'
    )
    grade_letter = models.CharField(max_length=2, choices=GRADE_LETTER_CHOICES, blank=True, verbose_name='Xếp loại')
    gpa_points = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('4'))],
        verbose_name='Điểm GPA'
    )
    comments = models.TextField(blank=True, verbose_name='Nhận xét')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'grades'
        verbose_name = 'Điểm số'
        verbose_name_plural = 'Điểm số'
    
    def __str__(self):
        return f"{self.enrollment.student.email} - {self.grade_letter}"


class ExamSchedule(models.Model):
    """Lịch thi"""
    
    EXAM_TYPE_CHOICES = [
        ('MIDTERM', 'Giữa kỳ'),
        ('FINAL', 'Cuối kỳ'),
        ('MAKEUP', 'Thi lại'),
    ]
    
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='exam_schedules', verbose_name='Lớp học')
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES, verbose_name='Loại thi')
    exam_date = models.DateField(verbose_name='Ngày thi')
    exam_time = models.TimeField(verbose_name='Giờ thi')
    duration_minutes = models.IntegerField(validators=[MinValueValidator(1)], verbose_name='Thời lượng (phút)')
    room = models.CharField(max_length=50, blank=True, verbose_name='Phòng thi')
    notes = models.TextField(blank=True, verbose_name='Ghi chú')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'exam_schedules'
        verbose_name = 'Lịch thi'
        verbose_name_plural = 'Lịch thi'
        ordering = ['exam_date', 'exam_time']
    
    def __str__(self):
        return f"{self.class_instance.course.code} - {self.get_exam_type_display()} - {self.exam_date}"
