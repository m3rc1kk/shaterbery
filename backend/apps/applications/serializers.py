from rest_framework import serializers

from .models import Application, ApplicationItem
from apps.services.models import City, Service

MAX_LOCATION_LENGTH = 4096
MAX_LINE_QTY = 999


class ApplicationItemSerializer(serializers.ModelSerializer):
    service_id = serializers.IntegerField(source='service.id', read_only=True, default=None)

    class Meta:
        model = ApplicationItem
        fields = [
            'id',
            'service_id',
            'title',
            'quantity',
            'unit_price',
            'price_unit',
            'assembly_price',
            'half_price_next_days',
        ]
        read_only_fields = ['id']


class SubmitItemSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0)


class ApplicationSerializer(serializers.ModelSerializer):
    goods_lines = serializers.SerializerMethodField(read_only=True)
    composition_summary = serializers.SerializerMethodField(read_only=True)
    items = ApplicationItemSerializer(many=True, read_only=True)
    items_input = SubmitItemSerializer(many=True, required=False, write_only=True)

    city_slug = serializers.SerializerMethodField(read_only=True)
    city_name = serializers.SerializerMethodField(read_only=True)

    def get_city_slug(self, obj):
        return obj.city.slug if obj.city else None

    def get_city_name(self, obj):
        return obj.city.name if obj.city else None

    class Meta:
        model = Application
        fields = [
            'id',
            'city',
            'city_slug',
            'city_name',
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
            'items',
            'items_input',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'goods_lines', 'composition_summary', 'items', 'created_at', 'updated_at']
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

    def create(self, validated_data):
        items_data = validated_data.pop('items_input', None)
        instance = super().create(validated_data)

        if items_data:
            self._create_items(instance, items_data)
            instance.recompute_with_items()

        return instance

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items_input', None)
        if 'total_price' in validated_data:
            instance._skip_price_compute = True

        instance = super().update(instance, validated_data)

        if items_data is not None:
            instance.items.all().delete()
            self._create_items(instance, items_data)
            instance.recompute_with_items()

        return instance

    @staticmethod
    def _create_items(application, items_data):
        for item_data in items_data:
            service_id = item_data.get('service_id')
            qty = item_data.get('quantity', 0)
            if qty <= 0:
                continue
            svc = None
            if service_id:
                try:
                    svc = Service.objects.get(pk=service_id)
                except Service.DoesNotExist:
                    continue
            if svc:
                ApplicationItem.objects.create(
                    application=application,
                    service=svc,
                    title=svc.title,
                    quantity=qty,
                    unit_price=svc.price_value,
                    price_unit=svc.price_unit,
                    assembly_price=svc.assembly_price,
                    half_price_next_days=svc.half_price_next_days,
                )

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
    days = serializers.IntegerField(min_value=1, max_value=30, default=1)
    delivery = serializers.BooleanField()
    assembly = serializers.BooleanField()
    city_slug = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    items = SubmitItemSerializer(many=True, required=False, default=[])
    tent3x6 = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0, required=False)
    tent3x3 = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0, required=False)
    furniture = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0, required=False)
    chairs = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0, required=False)
    bulb = serializers.IntegerField(min_value=0, max_value=MAX_LINE_QTY, default=0, required=False)

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        city_slug = validated_data.pop('city_slug', '') or ''
        city = None
        if city_slug:
            try:
                city = City.objects.get(slug=city_slug)
            except City.DoesNotExist:
                pass

        app = Application.objects.create(
            full_name=validated_data['name'],
            phone=validated_data['phone'],
            event_date=validated_data['date'],
            event_time=validated_data['time'],
            location=validated_data['place'],
            tent_3x6_qty=validated_data.get('tent3x6', 0),
            tent_3x3_qty=validated_data.get('tent3x3', 0),
            furniture_qty=validated_data.get('furniture', 0),
            chairs_qty=validated_data.get('chairs', 0),
            bulb_qty=validated_data.get('bulb', 0),
            rental_days=validated_data['days'],
            delivery=validated_data['delivery'],
            assembly=validated_data['assembly'],
            city=city,
            source=Application.Source.SITE,
            status=Application.Status.NEW,
        )

        if items_data:
            for item_data in items_data:
                service_id = item_data.get('service_id')
                qty = item_data.get('quantity', 0)
                if qty <= 0:
                    continue
                try:
                    svc = Service.objects.get(pk=service_id)
                except Service.DoesNotExist:
                    continue
                ApplicationItem.objects.create(
                    application=app,
                    service=svc,
                    title=svc.title,
                    quantity=qty,
                    unit_price=svc.price_value,
                    price_unit=svc.price_unit,
                    assembly_price=svc.assembly_price,
                    half_price_next_days=svc.half_price_next_days,
                )
            app.recompute_with_items()

        return app

    def to_representation(self, instance):
        return ApplicationSerializer(instance).data
