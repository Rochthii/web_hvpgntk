from django.contrib import admin
from .models import PetitionType, Petition, PetitionHistory


@admin.register(PetitionType)
class PetitionTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'auto_approve', 'max_processing_days', 'is_active']
    list_filter = ['auto_approve', 'is_active']
    search_fields = ['name']


@admin.register(Petition)
class PetitionAdmin(admin.ModelAdmin):
    list_display = ['title', 'petitioner', 'petition_type', 'status', 'submitted_at', 'processing_deadline']
    list_filter = ['status', 'petition_type']
    search_fields = ['title', 'petitioner__email']
    readonly_fields = ['submitted_at', 'processed_at']
    autocomplete_fields = ['petitioner']
    fieldsets = (
        ('Thông tin đơn', {
            'fields': ('petitioner', 'petition_type', 'title', 'content', 'attachment_url')
        }),
        ('Trạng thái', {
            'fields': ('status', 'submitted_at', 'processed_at', 'processing_deadline', 'final_decision')
        }),
    )


@admin.register(PetitionHistory)
class PetitionHistoryAdmin(admin.ModelAdmin):
    list_display = ['petition', 'actor', 'action', 'timestamp']
    list_filter = ['action', 'timestamp']
    search_fields = ['petition__title', 'actor__email']
    readonly_fields = ['timestamp']
    autocomplete_fields = ['actor']
