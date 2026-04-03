from django.contrib import admin

from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'full_name',
        'phone',
        'event_date',
        'status',
        'source',
        'total_price',
        'created_at',
    ]
    list_filter = ['status', 'source', 'created_at']
    search_fields = ['full_name', 'phone', 'location']
