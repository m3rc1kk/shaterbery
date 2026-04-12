from rest_framework import serializers

from .models import City, Service


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'slug', 'region_label']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'city',
            'title',
            'description',
            'image',
            'price_value',
            'price_unit',
            'assembly_price',
            'half_price_next_days',
            'sort_order',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
