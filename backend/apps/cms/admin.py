from django.contrib import admin
from .models import (
    SiteSetting, Banner, Menu, Page, Department,
    StaffMember, News, FAQ, Partner, ContactMessage
)


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ['site_name_vi', 'updated_at']
    
    def has_add_permission(self, request):
        # Singleton - only one instance allowed
        return not SiteSetting.objects.exists()


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['title_vi', 'display_order', 'is_active', 'start_date', 'end_date']
    list_filter = ['is_active']
    ordering = ['display_order']


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ['title_vi', 'location', 'parent', 'display_order', 'is_active']
    list_filter = ['location', 'is_active']
    ordering = ['location', 'display_order']


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title_vi', 'page_type', 'status', 'published_at', 'view_count']
    list_filter = ['page_type', 'status']
    search_fields = ['title_vi', 'title_km', 'content_vi']
    prepopulated_fields = {'slug': ('title_vi',)}
    ordering = ['menu_order']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['code', 'name_vi', 'head', 'display_order', 'is_active']
    list_filter = ['is_active']
    ordering = ['display_order']


@admin.register(StaffMember)
class StaffMemberAdmin(admin.ModelAdmin):
    list_display = ['display_name_vi', 'staff_type', 'position', 'department', 'is_active']
    list_filter = ['staff_type', 'is_active', 'is_featured']
    search_fields = ['display_name_vi', 'display_name_km']
    ordering = ['staff_type', 'display_order']


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title_vi', 'category', 'status', 'is_featured', 'is_announcement', 'published_at', 'view_count']
    list_filter = ['category', 'status', 'is_featured', 'is_pinned', 'is_announcement']
    search_fields = ['title_vi', 'title_km', 'content_vi']
    prepopulated_fields = {'slug': ('title_vi',)}
    ordering = ['-published_at', '-created_at']
    
    fieldsets = (
        ('Nội dung', {
            'fields': ('slug', 'title_vi', 'title_km', 'excerpt_vi', 'excerpt_km', 'content_vi', 'content_km')
        }),
        ('Media', {
            'fields': ('featured_image_url', 'gallery_images')
        }),
        ('Phân loại', {
            'fields': ('category', 'tags')
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
