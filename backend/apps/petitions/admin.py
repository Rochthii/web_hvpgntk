"""
Petitions Admin Configuration
"""
from django.contrib import admin
from .models import PetitionType, Petition, PetitionHistory


@admin.register(PetitionType)
class PetitionTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'auto_approve', 'max_processing_days', 'is_active', 'created_at']
    list_filter = ['is_active', 'auto_approve']
    search_fields = ['name', 'code', 'description']
    ordering = ['name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description', 'is_active')
        }),
        ('Workflow Configuration', {
            'fields': ('requires_approval_from', 'auto_approve', 'max_processing_days')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class PetitionHistoryInline(admin.TabularInline):
    model = PetitionHistory
    extra = 0
    readonly_fields = ['action', 'actor', 'note', 'timestamp']
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Petition)
class PetitionAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'petitioner', 'petition_type', 'status',
        'submitted_at', 'processed_at'
    ]
    list_filter = ['status', 'petition_type', 'submitted_at', 'processed_at']
    search_fields = ['title', 'reason', 'petitioner__email', 'petitioner__phone']
    ordering = ['-created_at']
    readonly_fields = ['id', 'petitioner', 'submitted_at', 'processed_at', 'created_at', 'updated_at']
    inlines = [PetitionHistoryInline]
    
    fieldsets = (
        ('Petition Information', {
            'fields': ('petitioner', 'petition_type', 'title', 'reason')
        }),
        ('Attachments', {
            'fields': ('attachment', 'attachment_url')
        }),
        ('Status & Workflow', {
            'fields': ('status', 'submitted_at', 'processed_at', 'processing_deadline')
        }),
        ('Admin Response', {
            'fields': ('admin_response', 'final_decision')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('petitioner', 'petition_type')


@admin.register(PetitionHistory)
class PetitionHistoryAdmin(admin.ModelAdmin):
    list_display = ['petition', 'action', 'actor', 'timestamp']
    list_filter = ['action', 'timestamp']
    search_fields = ['petition__title', 'note', 'actor__email']
    ordering = ['-timestamp']
    readonly_fields = ['petition', 'actor', 'action', 'note', 'timestamp']
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
