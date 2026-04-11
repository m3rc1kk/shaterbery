from django.contrib import admin

from .models import Application, ApplicationItem


class ApplicationItemInline(admin.TabularInline):
    model = ApplicationItem
    extra = 0
    readonly_fields = ('service', 'title', 'quantity', 'unit_price', 'price_unit', 'assembly_price', 'half_price_next_days')


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
    inlines = [ApplicationItemInline]
