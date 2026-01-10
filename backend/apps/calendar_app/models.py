from django.db import models
from apps.users.models import User


class KhmerCalendar(models.Model):
    """Lịch Khmer - Lịch Chăm kỹ thuật"""
    
    KHMER_MONTH_CHOICES = [
        ('MITONA', 'មិថុនា (Tháng 6)'),
        ('ASADHA', 'អាសាឍ (Tháng 7)'),
        ('SRAVANA', 'ស្រាពណ៍ (Tháng 8)'),
        ('BHADRAPADA', 'ភទ្រប្រទា (Tháng 9)'),
        ('ASVINA', 'អស្សុជ (Tháng 10)'),
        ('KARTIKA', 'កត្តិក (Tháng 11)'),
        ('MARGASIRA', 'មិគសុិរ (Tháng 12)'),
        ('PAUSHA', 'បុស្ស (Tháng 1)'),
        ('MAGHA', 'មាឃ (Tháng 2)'),
        ('PHALGUNA', 'ផល្គុន (Tháng 3)'),
        ('CAITRA', 'ចេត្រ (Tháng 4)'),
        ('VAISAKHA', 'វិសាខ (Tháng 5)'),
    ]
    
    LUNAR_PHASE_CHOICES = [
        ('WAXING_1', 'កើត ១ រោច'),
        ('WAXING_8', 'កើត ៨ រោច'),
        ('WAXING_15', 'បូណ៌មី (Full moon)'),
        ('WANING_8', 'រោច ៨ កើត'),
        ('WANING_14', 'រោច ១៤ កើត'),
        ('WANING_15', 'អម្អាវស្យា (New moon)'),
    ]
    
    gregorian_date = models.DateField(unique=True, verbose_name='Ngày dương lịch')
    khmer_day = models.CharField(max_length=50, verbose_name='Ngày Khmer')  # ថ្ងៃ
    khmer_month = models.CharField(max_length=20, choices=KHMER_MONTH_CHOICES, verbose_name='Tháng Khmer')
    lunar_phase = models.CharField(max_length=20, blank=True, verbose_name='Pha trăng')
    
    # Special days
    is_uposatha_day = models.BooleanField(default=False, verbose_name='Ngày trai giới')  # Ngày lễ Phật giáo
    is_pchum_ben = models.BooleanField(default=False, verbose_name='Lễ Pchum Ben')
    is_chol_vossa = models.BooleanField(default=False, verbose_name='Lễ Chol Vossa (Nhập hạ)')
    is_chroat_preah_vossa = models.BooleanField(default=False, verbose_name='Lễ Chroat Preah Vossa (Xuất hạ)')
    is_kathina = models.BooleanField(default=False, verbose_name='Lễ Kathina (Dâng y)')
    is_meak_bochea = models.BooleanField(default=False, verbose_name='Lễ Meak Bochea')
    is_visak_bochea = models.BooleanField(default=False, verbose_name='Lễ Visak Bochea (Phật đản)')
    
    notes = models.TextField(blank=True, verbose_name='Ghi chú')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'khmer_calendar'
        verbose_name = 'Lịch Khmer'
        verbose_name_plural = 'Lịch Khmer'
        ordering = ['gregorian_date']
        indexes = [
            models.Index(fields=['gregorian_date']),
            models.Index(fields=['is_uposatha_day']),
        ]
    
    def __str__(self):
        return f"{self.gregorian_date} - {self.get_khmer_month_display()}"


class Event(models.Model):
    """Sự kiện"""
    
    EVENT_TYPE_CHOICES = [
        ('CEREMONY', 'Lễ hội / Nghi lễ'),
        ('CLASS', 'Lớp học'),
        ('EXAM', 'Thi cử'),
        ('MEETING', 'Họp'),
        ('HOLIDAY', 'Ngày nghỉ'),
        ('VASSA', 'Hạ'),
        ('OTHER', 'Khác'),
    ]
    
    title = models.CharField(max_length=300, verbose_name='Tiêu đề')
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, verbose_name='Loại sự kiện')
    start_datetime = models.DateTimeField(verbose_name='Thời gian bắt đầu')
    end_datetime = models.DateTimeField(verbose_name='Thời gian kết thúc')
    location = models.CharField(max_length=200, blank=True, verbose_name='Địa điểm')
    description = models.TextField(blank=True, verbose_name='Mô tả')
    
    is_khmer_calendar = models.BooleanField(default=False, verbose_name='Theo lịch Khmer')
    khmer_date = models.ForeignKey(
        KhmerCalendar, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='events',
        verbose_name='Ngày lịch Khmer'
    )
    
    organizer = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='organized_events',
        verbose_name='Người tổ chức'
    )
    participants = models.ManyToManyField(
        User, 
        blank=True,
        related_name='attending_events',
        verbose_name='Người tham gia'
    )
    
    is_public = models.BooleanField(default=True, verbose_name='Công khai')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'events'
        verbose_name = 'Sự kiện'
        verbose_name_plural = 'Sự kiện'
        ordering = ['-start_datetime']
        indexes = [
            models.Index(fields=['start_datetime', 'end_datetime']),
            models.Index(fields=['event_type']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.start_datetime.date()}"
