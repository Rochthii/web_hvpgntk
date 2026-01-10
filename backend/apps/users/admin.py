"""
Admin configuration for User models.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, MonkProfile, LaypersonProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'phone', 'user_type', 'role', 'is_active', 'is_verified']
    list_filter = ['user_type', 'role', 'is_active', 'is_verified']
    search_fields = ['email', 'phone']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'phone', 'password')}),
        ('Phân loại', {'fields': ('user_type', 'role')}),
        ('Trạng thái', {'fields': ('is_active', 'is_verified', 'is_staff', 'is_superuser')}),
        ('Cài đặt', {'fields': ('preferred_language',)}),
        ('Thời gian', {'fields': ('last_login_at', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'password1', 'password2', 'user_type', 'role'),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login_at']


@admin.register(MonkProfile)
class MonkProfileAdmin(admin.ModelAdmin):
    list_display = ['dharma_name_khmer', 'student_code', 'vassa_count', 'status', 'cohort']
    list_filter = ['status', 'cohort', 'current_year']
    search_fields = ['dharma_name_khmer', 'dharma_name_pali', 'student_code']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Pháp danh', {'fields': ('dharma_name_khmer', 'dharma_name_pali', 'dharma_name_vietnamese')}),
        ('Thông tin cá nhân', {'fields': ('secular_name', 'date_of_birth', 'place_of_birth', 'nationality', 'ethnicity')}),
        ('Thông tin thọ giới', {'fields': ('ordination_temple', 'samanera_date', 'bhikkhu_date', 'upajjhaya', 'kammavacacariya', 'anusavanaccariya')}),
        ('Tuổi hạ', {'fields': ('vassa_count', 'vassa_updated_at')}),
        ('Học viện', {'fields': ('student_code', 'cohort', 'current_year', 'status')}),
        ('Tài liệu', {'fields': ('photo_url', 'ordination_certificate_url', 'id_card_url')}),
    )
    
    readonly_fields = ['vassa_count', 'vassa_updated_at']


@admin.register(LaypersonProfile)
class LaypersonProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'student_code', 'occupation', 'status', 'cohort']
    list_filter = ['status', 'cohort', 'current_year', 'gender']
    search_fields = ['full_name', 'student_code']
    ordering = ['-created_at']
