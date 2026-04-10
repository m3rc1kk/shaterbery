from rest_framework import serializers

from .models import Application

MAX_LOCATION_LENGTH = 4096
MAX_LINE_QTY = 999


class ApplicationSerializer(serializers.ModelSerializer):
    goods_lines = serializers.SerializerMethodField(read_only=True)
    composition_summary = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Application
        fields = [
            'id',
            'full_name',
            'phone',
            'event_date',
            'event_time',
            'location',
            'tent_3x6_qty',
            'tent_3x3_qty',
            'furniture_qty',
            'chairs_qty',
            'bulb_qty',
            'rental_days',
            'delivery',
            'assembly',
            'source',
            'status',
            'total_price',
            'goods_lines',
            'composition_summary',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'goods_lines', 'composition_summary', 'created_at', 'updated_at']
        extra_kwargs = {
            'location': {'max_length': MAX_LOCATION_LENGTH},
            'tent_3x6_qty': {'min_value': 0, 'max_value': MAX_LINE_QTY},
            'tent_3x3_qty': {'min_value': 0, 'max_value': MAX_LINE_QTY},
            'furniture_qty': {'min_value': 0, 'max_value': MAX_LINE_QTY},
            'chairs_qty': {'min_value': 0, 'max_value': MAX_LINE_QTY},
            'bulb_qty': {'min_value': 0, 'max_value': MAX_LINE_QTY},
            'rental_days': {'min_value': 1, 'max_value': 30},
            'total_price': {'required': False, 'min_value': 0},
        }

    def update(self, instance, validated_data):
        if 'total_price' in validated_data:
            instance._skip_price_compute = True
        return super().update(instance, validated_data)

    def get_goods_lines(self, obj: Application):
        return obj.goods_lines()

    def get_composition_summary(self, obj: Application):
        return obj.composition_summary()


class ApplicationSubmitSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=32)
    date = serializers.DateField()
    time = serializers.TimeField()
    place = serializers.CharField(max_length=MAX_LOCATION_LENGTH)
    tent3x6 = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0)
    tent3x3 = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0)
    furniture = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0)
    chairs = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0)
    bulb = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0)
    days = serializers.IntegerField(min_value=1, max_value=30, default=1)
    delivery = serializers.BooleanField()
    assembly = serializers.BooleanField()

    def create(self, validated_data):
        return Application.objects.create(
            full_name=validated_data['name'],
            phone=validated_data['phone'],
            event_date=validated_data['date'],
            event_time=validated_data['time'],
            location=validated_data['place'],
            tent_3x6_qty=validated_data['tent3x6'],
            tent_3x3_qty=validated_data['tent3x3'],
            furniture_qty=validated_data['furniture'],
            chairs_qty=validated_data['chairs'],
            bulb_qty=validated_data['bulb'],
            rental_days=validated_data['days'],
            delivery=validated_data['delivery'],
            assembly=validated_data['assembly'],
            source=Application.Source.SITE,
            status=Application.Status.NEW,
        )

    def to_representation(self, instance):
        return ApplicationSerializer(instance).data
