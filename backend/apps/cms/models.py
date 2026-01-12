"""
CMS Models - Quản lý nội dung website
"""
import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify


class SiteSetting(models.Model):
    """
    Model for website settings (singleton).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Tên trang
    site_name_vi = models.CharField(max_length=200)
    site_name_km = models.CharField(max_length=200, blank=True)
    site_slogan_vi = models.CharField(max_length=300, blank=True)
    site_slogan_km = models.CharField(max_length=300, blank=True)
    
    # Logo
    logo_url = models.URLField(blank=True)
    favicon_url = models.URLField(blank=True)
    
    # Liên hệ
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    contact_address = models.TextField(blank=True)
    google_maps_embed = models.TextField(blank=True)
    
    # Social
    facebook_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    
    # Footer
    footer_text_vi = models.TextField(blank=True)
    footer_text_km = models.TextField(blank=True)

    # Stats (Số liệu thống kê)
    founded_year = models.CharField(max_length=20, default="2006")
    student_count = models.CharField(max_length=20, default="300+")  # Graduates
    course_count = models.CharField(max_length=20, default="8")  # Provinces served
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'site_settings'
        verbose_name = 'Cấu hình website'
        verbose_name_plural = 'Cấu hình website'
    
    def __str__(self):
        return self.site_name_vi
    
    @classmethod
    def get_settings(cls):
        """Get or create singleton settings."""
        defaults = {
            'site_name_vi': 'Học viện Phật giáo Nam tông Khmer',
            'site_name_km': 'ពុទ្ធិកវិទ្យាល័យពុទ្ធសាសនានមទិកខ្មែរ',
            'founded_year': '2006',
            'student_count': '150+',
            'course_count': '30+'
        }
        settings_obj, _ = cls.objects.get_or_create(
            pk=uuid.UUID('00000000-0000-0000-0000-000000000001'),
            defaults=defaults
        )
        return settings_obj


class Banner(models.Model):
    """
    Model for homepage banners.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    title_vi = models.CharField(max_length=200, blank=True)
    title_km = models.CharField(max_length=200, blank=True)
    subtitle_vi = models.CharField(max_length=300, blank=True)
    subtitle_km = models.CharField(max_length=300, blank=True)
    
    image_url = models.URLField()
    image_url_mobile = models.URLField(blank=True)
    
    link_url = models.URLField(blank=True)
    link_target = models.CharField(max_length=20, default='_self')
    
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'banners'
        verbose_name = 'Banner'
        verbose_name_plural = 'Banners'
        ordering = ['display_order']
    
    def __str__(self):
        return self.title_vi or f"Banner {self.id}"


class Menu(models.Model):
    """
    Model for navigation menus.
    """
    class Location(models.TextChoices):
        MAIN_NAV = 'main_nav', 'Menu chính'
        FOOTER_1 = 'footer_1', 'Footer cột 1'
        FOOTER_2 = 'footer_2', 'Footer cột 2'
        MOBILE_NAV = 'mobile_nav', 'Menu mobile'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    location = models.CharField(max_length=50, choices=Location.choices)
    
    title_vi = models.CharField(max_length=100)
    title_km = models.CharField(max_length=100, blank=True)
    
    url = models.CharField(max_length=255, blank=True)
    target = models.CharField(max_length=20, default='_self')
    icon = models.CharField(max_length=50, blank=True)
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    display_order = models.IntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'menus'
        verbose_name = 'Menu'
        verbose_name_plural = 'Menus'
        ordering = ['location', 'display_order']
    
    def __str__(self):
        return f"{self.get_location_display()} - {self.title_vi}"


class Page(models.Model):
    """
    Model for static pages.
    """
    class PageType(models.TextChoices):
        ABOUT = 'about', 'Giới thiệu'
        HISTORY = 'history', 'Lịch sử'
        MISSION = 'mission', 'Sứ mệnh'
        ORGANIZATION = 'organization', 'Cơ cấu tổ chức'
        FACILITIES = 'facilities', 'Cơ sở vật chất'
        CURRICULUM = 'curriculum', 'Chương trình đào tạo'
        ADMISSION = 'admission', 'Tuyển sinh'
        CONTACT = 'contact', 'Liên hệ'
        CUSTOM = 'custom', 'Trang tùy chỉnh'
    
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Nháp'
        PUBLISHED = 'published', 'Đã xuất bản'
        ARCHIVED = 'archived', 'Lưu trữ'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    slug = models.SlugField(max_length=100, unique=True)
    page_type = models.CharField(max_length=50, choices=PageType.choices)
    
    title_vi = models.CharField(max_length=300)
    title_km = models.CharField(max_length=300, blank=True)
    
    content_vi = models.TextField()
    content_km = models.TextField(blank=True)
    
    excerpt_vi = models.TextField(blank=True)
    excerpt_km = models.TextField(blank=True)
    
    featured_image_url = models.URLField(blank=True)
    gallery_images = models.JSONField(null=True, blank=True)
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=500, blank=True)
    
    template = models.CharField(max_length=50, default='default')
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children'
    )
    menu_order = models.IntegerField(default=0)
    show_in_menu = models.BooleanField(default=True)
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )
    published_at = models.DateTimeField(null=True, blank=True)
    
    view_count = models.IntegerField(default=0)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_pages'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pages'
        verbose_name = 'Trang'
        verbose_name_plural = 'Trang'
        ordering = ['menu_order']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['page_type']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return self.title_vi
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title_vi)
        super().save(*args, **kwargs)


class Department(models.Model):
    """
    Model for departments/faculties.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    code = models.CharField(max_length=20, unique=True)
    name_vi = models.CharField(max_length=200)
    name_km = models.CharField(max_length=200, blank=True)
    
    description_vi = models.TextField(blank=True)
    description_km = models.TextField(blank=True)
    
    head = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='headed_departments'
    )
    
    image_url = models.URLField(blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'departments'
        verbose_name = 'Khoa'
        verbose_name_plural = 'Khoa'
        ordering = ['display_order']
    
    def __str__(self):
        return self.name_vi


class StaffMember(models.Model):
    """
    Model for staff members (leadership, faculty).
    """
    class StaffType(models.TextChoices):
        LEADERSHIP = 'leadership', 'Ban Giám hiệu'
        FACULTY = 'faculty', 'Giáo thọ'
        ADMIN_STAFF = 'admin_staff', 'Nhân viên'
        ADVISORY = 'advisory', 'Cố vấn'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='staff_profile'
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='staff_members'
    )
    
    display_name_vi = models.CharField(max_length=200)
    display_name_km = models.CharField(max_length=200, blank=True)
    
    title_vi = models.CharField(max_length=100, blank=True)
    title_km = models.CharField(max_length=100, blank=True)
    
    position = models.CharField(max_length=100, blank=True)
    
    bio_vi = models.TextField(blank=True)
    bio_km = models.TextField(blank=True)
    
    photo_url = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    staff_type = models.CharField(
        max_length=50,
        choices=StaffType.choices,
        default=StaffType.FACULTY
    )
    
    display_order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'staff_members'
        verbose_name = 'Nhân sự'
        verbose_name_plural = 'Nhân sự'
        ordering = ['staff_type', 'display_order']
    
    def __str__(self):
        return self.display_name_vi


class News(models.Model):
    """
    Model for news/articles.
    """
    class Category(models.TextChoices):
        ACADEMY_NEWS = 'academy_news', 'Tin Học viện'
        BUDDHIST_NEWS = 'buddhist_news', 'Phật sự cộng đồng'
        KHMER_FESTIVAL = 'khmer_festival', 'Lễ hội Khmer'
        ANNOUNCEMENT = 'announcement', 'Thông báo'
        EVENT = 'event', 'Sự kiện'
    
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Nháp'
        PUBLISHED = 'published', 'Đã xuất bản'
        ARCHIVED = 'archived', 'Lưu trữ'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    slug = models.SlugField(max_length=200, unique=True)
    
    title_vi = models.CharField(max_length=300)
    title_km = models.CharField(max_length=300, blank=True)
    
    excerpt_vi = models.TextField(blank=True)
    excerpt_km = models.TextField(blank=True)
    
    content_vi = models.TextField()
    content_km = models.TextField(blank=True)
    
    featured_image_url = models.URLField(blank=True)
    gallery_images = models.JSONField(null=True, blank=True)
    
    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.ACADEMY_NEWS
    )
    
    tags = models.JSONField(null=True, blank=True)
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=500, blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )
    is_featured = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)
    is_announcement = models.BooleanField(
        default=False,
        verbose_name="Thông báo quan trọng",
        help_text="Đánh dấu là thông báo urgent hiển thị riêng trên trang chủ"
    )
    
    published_at = models.DateTimeField(null=True, blank=True)
    view_count = models.IntegerField(default=0)
    
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='news_articles'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'news'
        verbose_name = 'Tin tức'
        verbose_name_plural = 'Tin tức'
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status']),
            models.Index(fields=['category']),
            models.Index(fields=['-published_at']),
        ]
    
    def __str__(self):
        return self.title_vi


class FAQ(models.Model):
    """
    Model for FAQs.
    """
    class Category(models.TextChoices):
        GENERAL = 'general', 'Chung'
        ADMISSION = 'admission', 'Tuyển sinh'
        ACADEMIC = 'academic', 'Học vụ'
        STUDENT_LIFE = 'student_life', 'Đời sống sinh viên'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    question_vi = models.CharField(max_length=500)
    question_km = models.CharField(max_length=500, blank=True)
    
    answer_vi = models.TextField()
    answer_km = models.TextField(blank=True)
    
    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.GENERAL
    )
    
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'faqs'
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
        ordering = ['category', 'display_order']
    
    def __str__(self):
        return self.question_vi[:100]


class Partner(models.Model):
    """
    Model for partners/affiliates.
    """
    class PartnerType(models.TextChoices):
        ACADEMIC = 'academic', 'Học thuật'
        RELIGIOUS = 'religious', 'Tôn giáo'
        GOVERNMENT = 'government', 'Chính phủ'
        SPONSOR = 'sponsor', 'Nhà tài trợ'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=200)
    logo_url = models.URLField(blank=True)
    website_url = models.URLField(blank=True)
    
    partner_type = models.CharField(
        max_length=50,
        choices=PartnerType.choices,
        default=PartnerType.ACADEMIC
    )
    
    description = models.TextField(blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'partners'
        verbose_name = 'Đối tác'
        verbose_name_plural = 'Đối tác'
        ordering = ['display_order']
    
    def __str__(self):
        return self.name


class ContactMessage(models.Model):
    """
    Model for contact form messages.
    """
    class Status(models.TextChoices):
        NEW = 'new', 'Mới'
        READ = 'read', 'Đã đọc'
        REPLIED = 'replied', 'Đã trả lời'
        ARCHIVED = 'archived', 'Lưu trữ'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    sender_name = models.CharField(max_length=200)
    sender_email = models.EmailField(blank=True)
    sender_phone = models.CharField(max_length=20, blank=True)
    
    subject = models.CharField(max_length=300, blank=True)
    message = models.TextField()
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW
    )
    
    replied_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replied_messages'
    )
    replied_at = models.DateTimeField(null=True, blank=True)
    reply_content = models.TextField(blank=True)
    
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'contact_messages'
        verbose_name = 'Tin nhắn liên hệ'
        verbose_name_plural = 'Tin nhắn liên hệ'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.sender_name} - {self.subject or 'Không có tiêu đề'}"
