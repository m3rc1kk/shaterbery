from django.contrib import admin

from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'price_value', 'price_unit', 'assembly_price', 'sort_order')
    list_editable = ('sort_order',)
