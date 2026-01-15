from django.contrib import admin
from django import forms
from ckeditor.widgets import CKEditorWidget
from django.db import models
from .models import (
    SiteSetting, Banner, Menu, Page, Department,
    StaffMember, News, FAQ, Partner, ContactMessage,
    HistoryMilestone
)


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ['site_name_vi', 'updated_at']
    
    fieldsets = (
        ('🇻🇳 Tiếng Việt', {
            'fields': ('site_name_vi', 'site_slogan_vi', 'footer_text_vi')
        }),
        ('🇰🇭 ភាសាខ្មែរ', {
            'fields': ('site_name_km', 'site_slogan_km', 'footer_text_km'),
            'classes': ('collapse',)
        }),
        ('Logo & Media', {
            'fields': ('logo_url', 'favicon_url')
        }),
        ('Liên hệ', {
            'fields': ('contact_email', 'contact_phone', 'contact_address', 'google_maps_embed')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'youtube_url')
        }),
        ('Thống kê', {
            'fields': ('founded_year', 'student_count', 'course_count')
        }),
    )
    
    def has_add_permission(self, request):
        # Singleton - only one instance allowed
        return not SiteSetting.objects.exists()


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['title_vi', 'display_order', 'is_active', 'start_date', 'end_date']
    list_filter = ['is_active']
    ordering = ['display_order']
    
    fieldsets = (
        ('🇻🇳 Tiếng Việt', {
            'fields': ('title_vi', 'subtitle_vi')
        }),
        ('🇰🇭 ភាសាខ្មែរ', {
            'fields': ('title_km', 'subtitle_km'),
            'classes': ('collapse',)
        }),
        ('Hình ảnh', {
            'fields': ('image_url', 'image_url_mobile')
        }),
        ('Cài đặt', {
            'fields': ('link_url', 'link_target', 'display_order', 'is_active', 'start_date', 'end_date')
        }),
    )


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ['title_vi', 'location', 'parent', 'display_order', 'is_active']
    list_filter = ['location', 'is_active']
    ordering = ['location', 'display_order']
    
    fieldsets = (
        ('🇻🇳 Tiếng Việt', {
            'fields': ('title_vi',)
        }),
        ('🇰🇭 ភាសាខ្មែរ', {
            'fields': ('title_km',),
            'classes': ('collapse',)
        }),
        ('Cài đặt', {
            'fields': ('location', 'url', 'target', 'icon', 'parent', 'display_order', 'is_active')
        }),
    )


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title_vi', 'page_type', 'status', 'published_at', 'view_count']
    list_filter = ['page_type', 'status']
    search_fields = ['title_vi', 'title_km', 'content_vi']
    prepopulated_fields = {'slug': ('title_vi',)}
    ordering = ['menu_order']
    
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget},
    }
    
    fieldsets = (
        ('Cơ bản', {
            'fields': ('slug', 'page_type', 'template')
        }),
        ('🇻🇳 Nội dung Tiếng Việt', {
            'fields': ('title_vi', 'excerpt_vi', 'content_vi'),
            'description': 'Nhập nội dung bằng Tiếng Việt'
        }),
        ('🇰🇭 មាតិកាភាសាខ្មែរ', {
            'fields': ('title_km', 'excerpt_km', 'content_km'),
            'classes': ('collapse',),
            'description': 'Nhập nội dung bằng Tiếng Khmer (tùy chọn)'
        }),
        ('Media', {
            'fields': ('featured_image_url', 'gallery_images')
        }),
        ('Hiển thị', {
            'fields': ('parent', 'menu_order', 'show_in_menu', 'status', 'published_at')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['code', 'name_vi', 'head', 'display_order', 'is_active']
    list_filter = ['is_active']
    ordering = ['display_order']
    
    fieldsets = (
        ('Cơ bản', {
            'fields': ('code',)
        }),
        ('🇻🇳 Tiếng Việt', {
            'fields': ('name_vi', 'description_vi')
        }),
        ('🇰🇭 ភាសាខ្មែរ', {
            'fields': ('name_km', 'description_km'),
            'classes': ('collapse',)
        }),
        ('Quản lý', {
            'fields': ('head', 'image_url', 'display_order', 'is_active')
        }),
    )


@admin.register(StaffMember)
class StaffMemberAdmin(admin.ModelAdmin):
    list_display = ['display_name_vi', 'staff_type', 'position', 'department', 'is_active']
    list_filter = ['staff_type', 'is_active', 'is_featured']
    search_fields = ['display_name_vi', 'display_name_km']
    ordering = ['staff_type', 'display_order']
    
    fieldsets = (
        ('Link tài khoản', {
            'fields': ('user', 'department')
        }),
        ('🇻🇳 Thông tin Tiếng Việt', {
            'fields': ('display_name_vi', 'title_vi', 'bio_vi'),
            'description': 'Tên, học hàm, tiểu sử bằng Tiếng Việt'
        }),
        ('🇰🇭 ព័ត៌មានភាសាខ្មែរ', {
            'fields': ('display_name_km', 'title_km', 'bio_km'),
            'classes': ('collapse',),
            'description': 'Tên, học hàm, tiểu sử bằng Tiếng Khmer (tùy chọn)'
        }),
        ('Liên hệ', {
            'fields': ('email', 'phone', 'photo_url')
        }),
        ('Phân loại', {
            'fields': ('staff_type', 'position', 'display_order', 'is_featured', 'is_active')
        }),
    )


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title_vi', 'category', 'status', 'is_featured', 'is_announcement', 'published_at', 'view_count']
    list_filter = ['category', 'status', 'is_featured', 'is_pinned', 'is_announcement']
    search_fields = ['title_vi', 'title_km', 'content_vi']
    prepopulated_fields = {'slug': ('title_vi',)}
    ordering = ['-published_at', '-created_at']
    
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget},
    }
    
    fieldsets = (
        ('Cơ bản', {
            'fields': ('slug', 'category', 'tags')
        }),
        ('🇻🇳 Nội dung Tiếng Việt', {
            'fields': ('title_vi', 'excerpt_vi', 'content_vi'),
            'description': '✏️ Nhập đầy đủ nội dung Tiếng Việt trước'
        }),
        ('🇰🇭 មាតិកាភាសាខ្មែរ', {
            'fields': ('title_km', 'excerpt_km', 'content_km'),
            'classes': ('collapse',),
            'description': '📝 Dịch sang Tiếng Khmer (có thể để trống, hệ thống sẽ fallback về Tiếng Việt)'
        }),
        ('Media', {
            'fields': ('featured_image_url', 'thumbnail_url', 'gallery_images'),
            'description': "Chọn 'Ảnh đại diện' (upload) HOẶC nhập 'URL Thumbnail' (link ngoài)."
        }),
        ('Hiển thị', {
            'fields': ('status', 'is_featured', 'is_pinned', 'is_announcement', 'published_at')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
    )


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question_vi', 'category', 'display_order', 'is_active']
    list_filter = ['category', 'is_active']
    ordering = ['category', 'display_order']
    
    fieldsets = (
        ('🇻🇳 Tiếng Việt', {
            'fields': ('question_vi', 'answer_vi')
        }),
        ('🇰🇭 ភាសាខ្មែរ', {
            'fields': ('question_km', 'answer_km'),
            'classes': ('collapse',)
        }),
        ('Phân loại', {
            'fields': ('category', 'display_order', 'is_active')
        }),
    )


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'partner_type', 'display_order', 'is_active']
    list_filter = ['partner_type', 'is_active']
    ordering = ['display_order']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['sender_name', 'sender_email', 'subject', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['sender_name', 'sender_email', 'subject', 'message']
    ordering = ['-created_at']
    
    readonly_fields = ['sender_name', 'sender_email', 'sender_phone', 'subject', 'message', 'ip_address', 'created_at']
    
    fieldsets = (
        ('Thông tin người gửi', {
            'fields': ('sender_name', 'sender_email', 'sender_phone', 'ip_address', 'created_at')
        }),
        ('Nội dung', {
            'fields': ('subject', 'message')
        }),
        ('Xử lý', {
            'fields': ('status', 'replied_by', 'replied_at', 'reply_content')
        }),
    )


@admin.register(HistoryMilestone)
class HistoryMilestoneAdmin(admin.ModelAdmin):
    list_display = ['year', 'title_vi', 'display_order', 'is_active', 'created_at']
    list_editable = ['display_order', 'is_active']
    search_fields = ['year', 'title_vi', 'title_km']
    list_filter = ['is_active']
    ordering = ['display_order', 'year']
    
    fieldsets = (
        ('Thời gian', {
            'fields': ('year',)
        }),
        ('🇻🇳 Tiếng Việt', {
            'fields': ('title_vi', 'description_vi')
        }),
        ('🇰🇭 ភាសាខ្មែរ', {
            'fields': ('title_km', 'description_km'),
            'classes': ('collapse',)
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Hiển thị', {
            'fields': ('display_order', 'is_active')
        }),
    )
