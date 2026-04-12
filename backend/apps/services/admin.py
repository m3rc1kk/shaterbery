from django.contrib import admin

from .models import City, Service


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'region_label')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'city', 'price_value', 'price_unit', 'assembly_price', 'half_price_next_days', 'sort_order')
    list_editable = ('sort_order',)
    list_filter = ('city',)
