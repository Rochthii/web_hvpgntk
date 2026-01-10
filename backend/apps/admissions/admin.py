from django.contrib import admin
from .models import AdmissionPeriod, AdmissionApplication


@admin.register(AdmissionPeriod)
class AdmissionPeriodAdmin(admin.ModelAdmin):
    list_display = ['admission_year', 'application_start_date', 'application_end_date', 'status']
    list_filter = ['status']
    search_fields = ['admission_year']
    ordering = ['-admission_year']


@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant_name', 'admission_period', 'date_of_birth', 'is_ordained', 'status', 'submitted_at']
    list_filter = ['status', 'is_ordained', 'admission_period']
    search_fields = ['applicant_name', 'monk_name', 'email']
    readonly_fields = ['created_at', 'updated_at', 'submitted_at']
    fieldsets = (
        ('Thông tin đợt tuyển sinh', {
            'fields': ('admission_period', 'status')
        }),
        ('Thông tin cá nhân', {
            'fields': ('applicant_name', 'date_of_birth', 'place_of_birth', 'current_residence', 'phone', 'email')
        }),
        ('Thông tin tu học', {
            'fields': ('is_ordained', 'monk_name', 'ordination_date', 'vassa_count', 'home_temple', 'recommending_monk')
        }),
        ('Hồ sơ', {
            'fields': ('documents',)
        }),
        ('Xét duyệt', {
            'fields': ('reviewed_by', 'reviewed_at', 'rejection_reason')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'submitted_at'),
            'classes': ('collapse',)
        }),
    )
