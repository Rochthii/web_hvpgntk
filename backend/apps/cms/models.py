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
    site_name_vi = models.CharField(max_length=200, verbose_name="Tên Website (Tiếng Việt)")
    site_name_km = models.CharField(max_length=200, blank=True, verbose_name="Tên Website (Tiếng Khmer)")
    site_slogan_vi = models.CharField(max_length=300, blank=True, verbose_name="Khẩu hiệu (Tiếng Việt)")
    site_slogan_km = models.CharField(max_length=300, blank=True, verbose_name="Khẩu hiệu (Tiếng Khmer)")
    
    # Logo
    logo_url = models.ImageField(upload_to='site/logos/', blank=True, null=True, verbose_name="Logo Website")
    favicon_url = models.ImageField(upload_to='site/favicons/', blank=True, null=True, verbose_name="Favicon")
    
    # Liên hệ
    contact_email = models.EmailField(blank=True, verbose_name="Email liên hệ")
    contact_phone = models.CharField(max_length=50, blank=True, verbose_name="Số điện thoại")
    contact_address = models.TextField(blank=True, verbose_name="Địa chỉ")
    google_maps_embed = models.TextField(blank=True, verbose_name="Mã nhúng Google Maps")
    
    # Social
    facebook_url = models.URLField(blank=True, verbose_name="URL Facebook")
    youtube_url = models.URLField(blank=True, verbose_name="URL Youtube")
    
    # Footer
    footer_text_vi = models.TextField(blank=True, verbose_name="Nội dung Footer (Tiếng Việt)")
    footer_text_km = models.TextField(blank=True, verbose_name="Nội dung Footer (Tiếng Khmer)")

    # Stats (Số liệu thống kê)
    founded_year = models.CharField(max_length=20, default="2006", verbose_name="Năm thành lập")
    student_count = models.CharField(max_length=20, default="300+", verbose_name="Số Tăng sinh tốt nghiệp")
    course_count = models.CharField(max_length=20, default="8", verbose_name="Số tỉnh thành đào tạo")
    
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
    
    title_vi = models.CharField(max_length=200, blank=True, verbose_name="Tiêu đề (Tiếng Việt)")
    title_km = models.CharField(max_length=200, blank=True, verbose_name="Tiêu đề (Tiếng Khmer)")
    subtitle_vi = models.CharField(max_length=300, blank=True, verbose_name="Phụ đề (Tiếng Việt)")
    subtitle_km = models.CharField(max_length=300, blank=True, verbose_name="Phụ đề (Tiếng Khmer)")
    
    image_url = models.ImageField(
        upload_to='banners/images/',
        verbose_name="Hình ảnh (Desktop)",
        help_text="Kích thước đề xuất: 1920x600px"
    )
    image_url_mobile = models.ImageField(
        upload_to='banners/mobile/',
        blank=True,
        null=True,
        verbose_name="Hình ảnh (Mobile)",
        help_text="Kích thước đề xuất: 800x600px"
    )
    
    link_url = models.URLField(blank=True, verbose_name="Đường dẫn khi click")
    link_target = models.CharField(max_length=20, default='_self', verbose_name="Cách mở tab")
    
    display_order = models.IntegerField(default=0, verbose_name="Thứ tự hiển thị")
    is_active = models.BooleanField(default=True, verbose_name="Kích hoạt")
    
    start_date = models.DateField(null=True, blank=True, verbose_name="Ngày bắt đầu")
    end_date = models.DateField(null=True, blank=True, verbose_name="Ngày kết thúc")
    
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
    
    location = models.CharField(max_length=50, choices=Location.choices, verbose_name="Vị trí Menu")
    
    title_vi = models.CharField(max_length=100, verbose_name="Tên Menu (Tiếng Việt)")
    title_km = models.CharField(max_length=100, blank=True, verbose_name="Tên Menu (Tiếng Khmer)")
    
    url = models.CharField(max_length=255, blank=True, verbose_name="Đường dẫn")
    target = models.CharField(max_length=20, default='_self', verbose_name="Cách mở tab")
    icon = models.CharField(max_length=50, blank=True, verbose_name="Icon (Class)")
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name="Menu cha"
    )
    display_order = models.IntegerField(default=0, verbose_name="Thứ tự")
    
    is_active = models.BooleanField(default=True, verbose_name="Kích hoạt")
    
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
    
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug (Đường dẫn)")
    page_type = models.CharField(max_length=50, choices=PageType.choices, verbose_name="Loại trang")
    
    title_vi = models.CharField(max_length=300, verbose_name="Tiêu đề (Tiếng Việt)")
    title_km = models.CharField(max_length=300, blank=True, verbose_name="Tiêu đề (Tiếng Khmer)")
    
    content_vi = models.TextField(verbose_name="Nội dung (Tiếng Việt)")
    content_km = models.TextField(blank=True, verbose_name="Nội dung (Tiếng Khmer)")
    
    excerpt_vi = models.TextField(blank=True, verbose_name="Tóm tắt (Tiếng Việt)")
    excerpt_km = models.TextField(blank=True, verbose_name="Tóm tắt (Tiếng Khmer)")
    
    featured_image_url = models.ImageField(
        upload_to='pages/images/',
        blank=True,
        null=True,
        verbose_name="Ảnh đại diện"
    )
    gallery_images = models.JSONField(null=True, blank=True, verbose_name="Thư viện ảnh")
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True, verbose_name="SEO Title")
    meta_description = models.CharField(max_length=500, blank=True, verbose_name="SEO Description")
    
    template = models.CharField(max_length=50, default='default', verbose_name="Template")
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children',
        verbose_name="Trang cha"
    )
    menu_order = models.IntegerField(default=0, verbose_name="Thứ tự Menu")
    show_in_menu = models.BooleanField(default=True, verbose_name="Hiển thị trên Menu")
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        verbose_name="Trạng thái"
    )
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Thời gian xuất bản")
    
    view_count = models.IntegerField(default=0, verbose_name="Lượt xem")
    
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
    
    code = models.CharField(max_length=20, unique=True, verbose_name="Mã khoa")
    name_vi = models.CharField(max_length=200, verbose_name="Tên Khoa (Tiếng Việt)")
    name_km = models.CharField(max_length=200, blank=True, verbose_name="Tên Khoa (Tiếng Khmer)")
    
    description_vi = models.TextField(blank=True, verbose_name="Mô tả (Tiếng Việt)")
    description_km = models.TextField(blank=True, verbose_name="Mô tả (Tiếng Khmer)")
    
    head = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='headed_departments',
        verbose_name="Trưởng khoa"
    )
    
    image_url = models.ImageField(
        upload_to='departments/images/',
        blank=True,
        null=True,
        verbose_name="Ảnh đại diện Khoa"
    )
    display_order = models.IntegerField(default=0, verbose_name="Thứ tự")
    is_active = models.BooleanField(default=True, verbose_name="Kích hoạt")
    
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
        related_name='staff_profile',
        verbose_name="Tài khoản hệ thống"
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='staff_members',
        verbose_name="Khoa / Phòng ban"
    )
    
    display_name_vi = models.CharField(max_length=200, verbose_name="Tên hiển thị (Tiếng Việt)")
    display_name_km = models.CharField(max_length=200, blank=True, verbose_name="Tên hiển thị (Tiếng Khmer)")
    
    title_vi = models.CharField(max_length=100, blank=True, verbose_name="Học hàm/Học vị (Tiếng Việt)")
    title_km = models.CharField(max_length=100, blank=True, verbose_name="Học hàm/Học vị (Tiếng Khmer)")
    
    position = models.CharField(max_length=100, blank=True, verbose_name="Chức vụ")
    
    bio_vi = models.TextField(blank=True, verbose_name="Tiểu sử (Tiếng Việt)")
    bio_km = models.TextField(blank=True, verbose_name="Tiểu sử (Tiếng Khmer)")
    
    photo_url = models.ImageField(
        upload_to='staff/photos/',
        blank=True,
        null=True,
        verbose_name="Ảnh chân dung"
    )
    email = models.EmailField(blank=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Số điện thoại")
    
    staff_type = models.CharField(
        max_length=50,
        choices=StaffType.choices,
        default=StaffType.FACULTY,
        verbose_name="Loại nhân sự"
    )
    
    display_order = models.IntegerField(default=0, verbose_name="Thứ tự")
    is_featured = models.BooleanField(default=False, verbose_name="Nổi bật")
    is_active = models.BooleanField(default=True, verbose_name="Kích hoạt")
    
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
    
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug (Đường dẫn)")
    
    title_vi = models.CharField(max_length=300, verbose_name="Tiêu đề (Tiếng Việt)")
    title_km = models.CharField(max_length=300, blank=True, verbose_name="Tiêu đề (Tiếng Khmer)")
    
    excerpt_vi = models.TextField(blank=True, verbose_name="Tóm tắt (Tiếng Việt)")
    excerpt_km = models.TextField(blank=True, verbose_name="Tóm tắt (Tiếng Khmer)")
    
    content_vi = models.TextField(verbose_name="Nội dung (Tiếng Việt)")
    content_km = models.TextField(blank=True, verbose_name="Nội dung (Tiếng Khmer)")
    
    
    featured_image_url = models.ImageField(
        upload_to='news/images/',
        blank=True,
        null=True,
        default="",
        verbose_name="Ảnh đại diện",
        help_text="Upload ảnh trực tiếp (khuyến nghị)" 
    )
    thumbnail_url = models.URLField(
        blank=True,
        verbose_name="URL Thumbnail (tuỳ chọn)",
        help_text="Hoặc dán link ảnh từ nguồn bên ngoài"
    )
    gallery_images = models.JSONField(null=True, blank=True, verbose_name="Thư viện ảnh")
    
    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.ACADEMY_NEWS,
        verbose_name="Danh mục"
    )
    
    tags = models.JSONField(null=True, blank=True, verbose_name="Tags")
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True, verbose_name="SEO Title")
    meta_description = models.CharField(max_length=500, blank=True, verbose_name="SEO Description")
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        verbose_name="Trạng thái"
    )
    is_featured = models.BooleanField(default=False, verbose_name="Nổi bật")
    is_pinned = models.BooleanField(default=False, verbose_name="Ghim lên đầu")
    is_announcement = models.BooleanField(
        default=False,
        verbose_name="Thông báo quan trọng",
        help_text="Đánh dấu là thông báo urgent hiển thị riêng trên trang chủ"
    )
    
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Thời gian xuất bản")
    view_count = models.IntegerField(default=0, verbose_name="Lượt xem")
    
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
    logo_url = models.ImageField(upload_to='partners/logos/', blank=True, null=True, verbose_name="Logo Đối tác")
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


class HistoryMilestone(models.Model):
    """
    Model for History Timeline milestones.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    year = models.CharField(max_length=20, verbose_name="Năm (Ví dụ: 2006)")
    
    title_vi = models.CharField(max_length=200, verbose_name="Tiêu đề (Tiếng Việt)")
    title_km = models.CharField(max_length=200, blank=True, verbose_name="Tiêu đề (Tiếng Khmer)")
    
    description_vi = models.TextField(verbose_name="Mô tả (Tiếng Việt)")
    description_km = models.TextField(blank=True, verbose_name="Mô tả (Tiếng Khmer)")
    
    image = models.ImageField(upload_to='history/images/', blank=True, null=True, verbose_name="Ảnh minh họa")
    
    display_order = models.IntegerField(default=0, verbose_name="Thứ tự hiển thị")
    is_active = models.BooleanField(default=True, verbose_name="Hiển thị")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'history_milestones'
        verbose_name = 'Mốc lịch sử'
        verbose_name_plural = 'Mốc lịch sử'
        ordering = ['display_order', 'year']
    
    def __str__(self):
        return f"{self.year} - {self.title_vi}"
