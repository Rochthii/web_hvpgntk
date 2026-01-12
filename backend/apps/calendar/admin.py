from django.contrib import admin
from .models import KhmerCalendar, Event


@admin.register(KhmerCalendar)
class KhmerCalendarAdmin(admin.ModelAdmin):
    list_display = ['gregorian_date', 'khmer_month', 'is_uposatha_day', 'is_visak_bochea', 'is_pchum_ben']
    list_filter = ['is_uposatha_day', 'is_pchum_ben', 'is_visak_bochea', 'is_kathina', 'khmer_month']
    search_fields = ['gregorian_date', 'khmer_day']
    ordering = ['gregorian_date']
    
    fieldsets = (
        ('Thông tin lịch', {
            'fields': ('gregorian_date', 'khmer_day', 'khmer_month', 'lunar_phase')
        }),
        ('Lễ Phật giáo', {
            'fields': ('is_uposatha_day', 'is_visak_bochea', 'is_meak_bochea', 'is_pchum_ben', 
                      'is_chol_vossa', 'is_chroat_preah_vossa', 'is_kathina')
        }),
        ('Ghi chú', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'start_datetime', 'location', 'is_public', 'organizer']
    list_filter = ['event_type', 'is_public', 'is_khmer_calendar']
    search_fields = ['title', 'description', 'location']
    autocomplete_fields = ['organizer']
    filter_horizontal = ['participants']
    ordering = ['-start_datetime']
    
    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('title', 'event_type', 'start_datetime', 'end_datetime', 'location')
        }),
        ('Mô tả', {
            'fields': ('description',)
        }),
        ('Lịch Khmer', {
            'fields': ('is_khmer_calendar', 'khmer_date')
        }),
        ('Người tham gia', {
            'fields': ('organizer', 'participants', 'is_public')
        }),
    )
