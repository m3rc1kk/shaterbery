from rest_framework import serializers

from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'title',
            'description',
            'image',
            'price_value',
            'price_unit',
            'assembly_price',
            'sort_order',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
