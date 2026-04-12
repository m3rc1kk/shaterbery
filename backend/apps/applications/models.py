from decimal import Decimal

from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone

_phone_validator = RegexValidator(
    regex=r'^\+?[\d\s\-\(\)]{7,20}$',
    message='Введите корректный номер телефона (7–20 цифр, допустимы +, пробел, дефис, скобки)',
)


class Application(models.Model):
    class Status(models.TextChoices):
        NEW = 'new', 'Новый'
        INWORK = 'inwork', 'В работе'
        CLOSED = 'closed', 'Закрыт'

    class Source(models.TextChoices):
        SITE = 'site', 'Сайт'
        MANUAL = 'manual', 'Вручную'

    _PRICE_TENT_3X6 = Decimal('3000')
    _PRICE_TENT_3X3 = Decimal('2000')
    _PRICE_FURNITURE = Decimal('3000')
    _PRICE_CHAIR = Decimal('150')
    _PRICE_BULB = Decimal('100')

    _ASSEMBLY_TENT_3X6 = Decimal('2000')
    _ASSEMBLY_TENT_3X3 = Decimal('1000')
    _ASSEMBLY_FURNITURE_THRESHOLD = 2
    _ASSEMBLY_FURNITURE_PRICE = Decimal('500')

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=32, validators=[_phone_validator])
    event_date = models.DateField()
    event_time = models.TimeField()
    location = models.TextField()
    tent_3x6_qty = models.PositiveIntegerField(default=0)
    tent_3x3_qty = models.PositiveIntegerField(default=0)
    furniture_qty = models.PositiveIntegerField(default=0)
    chairs_qty = models.PositiveIntegerField(default=0)
    bulb_qty = models.PositiveIntegerField(default=0)
    rental_days = models.PositiveIntegerField(default=1)
    delivery = models.BooleanField(default=False)
    assembly = models.BooleanField(default=False)
    source = models.CharField(max_length=32, choices=Source.choices, default=Source.SITE)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NEW)
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at', '-id']

    @staticmethod
    def _days_multiplier(days):
        d = max(1, int(days))
        return Decimal(1) + Decimal('0.5') * Decimal(d - 1)

    def _has_dynamic_items(self):
        if not self.pk:
            return False
        return self.items.exists()

    def compute_total_price(self) -> Decimal:
        if self._has_dynamic_items():
            return self._compute_total_dynamic()
        return self._compute_total_legacy()

    def _compute_total_dynamic(self) -> Decimal:
        days = max(1, self.rental_days or 1)
        mult = self._days_multiplier(days)
        total = Decimal('0')

        for item in self.items.all():
            q = Decimal(item.quantity)
            u = Decimal(item.unit_price)
            if item.price_unit == 'day':
                if item.half_price_next_days:
                    total += q * u * mult
                else:
                    total += q * u * Decimal(days)
            else:
                total += q * u

            if self.assembly and item.assembly_price > 0:
                total += q * Decimal(item.assembly_price)

        return total.quantize(Decimal('0.01'))

    def _compute_total_legacy(self) -> Decimal:
        days = max(1, self.rental_days or 1)
        mult = self._days_multiplier(days)

        per_day_items = Decimal('0')
        per_day_items += Decimal(self.tent_3x6_qty) * self._PRICE_TENT_3X6
        per_day_items += Decimal(self.tent_3x3_qty) * self._PRICE_TENT_3X3
        per_day_items += Decimal(self.furniture_qty) * self._PRICE_FURNITURE

        per_piece = Decimal('0')
        per_piece += Decimal(self.chairs_qty) * self._PRICE_CHAIR
        per_piece += Decimal(self.bulb_qty) * self._PRICE_BULB

        total = per_day_items * mult + per_piece

        if self.assembly:
            total += Decimal(self.tent_3x6_qty) * self._ASSEMBLY_TENT_3X6
            total += Decimal(self.tent_3x3_qty) * self._ASSEMBLY_TENT_3X3

        if self.furniture_qty >= self._ASSEMBLY_FURNITURE_THRESHOLD:
            total += self._ASSEMBLY_FURNITURE_PRICE

        return total.quantize(Decimal('0.01'))

    def goods_lines(self):
        if self._has_dynamic_items():
            return self._goods_lines_dynamic()
        return self._goods_lines_legacy()

    def _goods_lines_dynamic(self):
        days = max(1, self.rental_days or 1)
        mult = self._days_multiplier(days)
        lines = []
        assembly_total = Decimal('0')

        for item in self.items.all():
            q = item.quantity
            if q <= 0:
                continue
            u = Decimal(item.unit_price)
            if item.price_unit == 'day':
                if item.half_price_next_days:
                    lt = Decimal(q) * u * mult
                else:
                    lt = Decimal(q) * u * Decimal(days)
            else:
                lt = Decimal(q) * u

            lines.append({
                'label': item.title,
                'quantity': q,
                'unit_price': str(u),
                'line_total': str(lt.quantize(Decimal('0.01'))),
            })

            if self.assembly and item.assembly_price > 0:
                assembly_total += Decimal(q) * Decimal(item.assembly_price)

        if assembly_total > 0:
            lines.append({
                'label': 'Сборка/разборка',
                'quantity': 1,
                'unit_price': str(assembly_total),
                'line_total': str(assembly_total.quantize(Decimal('0.01'))),
            })

        return lines

    def _goods_lines_legacy(self):
        days = max(1, self.rental_days or 1)
        mult = self._days_multiplier(days)
        lines = []
        if self.tent_3x6_qty:
            u = self._PRICE_TENT_3X6
            q = self.tent_3x6_qty
            lines.append({
                'label': 'Шатёр 3×6 м',
                'quantity': q,
                'unit_price': str(u),
                'line_total': str((Decimal(q) * u * mult).quantize(Decimal('0.01'))),
            })
        if self.tent_3x3_qty:
            u = self._PRICE_TENT_3X3
            q = self.tent_3x3_qty
            lines.append({
                'label': 'Шатёр 3×3 м',
                'quantity': q,
                'unit_price': str(u),
                'line_total': str((Decimal(q) * u * mult).quantize(Decimal('0.01'))),
            })
        if self.furniture_qty:
            u = self._PRICE_FURNITURE
            q = self.furniture_qty
            lines.append({
                'label': 'Комплект мебели',
                'quantity': q,
                'unit_price': str(u),
                'line_total': str((Decimal(q) * u * mult).quantize(Decimal('0.01'))),
            })
        if self.chairs_qty:
            u = self._PRICE_CHAIR
            q = self.chairs_qty
            lines.append({
                'label': 'Стул раскладной',
                'quantity': q,
                'unit_price': str(u),
                'line_total': str((Decimal(q) * u).quantize(Decimal('0.01'))),
            })
        if self.bulb_qty:
            u = self._PRICE_BULB
            q = self.bulb_qty
            lines.append({
                'label': 'Лампочка',
                'quantity': q,
                'unit_price': str(u),
                'line_total': str((Decimal(q) * u).quantize(Decimal('0.01'))),
            })
        if self.assembly and (self.tent_3x6_qty or self.tent_3x3_qty):
            assembly_total = (
                Decimal(self.tent_3x6_qty) * self._ASSEMBLY_TENT_3X6
                + Decimal(self.tent_3x3_qty) * self._ASSEMBLY_TENT_3X3
            )
            lines.append({
                'label': 'Сборка/разборка шатров',
                'quantity': 1,
                'unit_price': str(assembly_total),
                'line_total': str(assembly_total.quantize(Decimal('0.01'))),
            })
        if self.furniture_qty >= self._ASSEMBLY_FURNITURE_THRESHOLD:
            lines.append({
                'label': 'Установка мебели',
                'quantity': 1,
                'unit_price': str(self._ASSEMBLY_FURNITURE_PRICE),
                'line_total': str(self._ASSEMBLY_FURNITURE_PRICE),
            })
        return lines

    def composition_summary(self) -> str:
        if self._has_dynamic_items():
            parts = []
            for item in self.items.all():
                if item.quantity > 0:
                    parts.append(f'{item.quantity} - {item.title}')
            return ', '.join(parts) if parts else '—'

        parts = []
        if self.tent_3x6_qty:
            parts.append(f'{self.tent_3x6_qty} - 3×6')
        if self.tent_3x3_qty:
            parts.append(f'{self.tent_3x3_qty} - 3×3')
        if self.furniture_qty:
            parts.append(f'{self.furniture_qty} - мебель')
        if self.chairs_qty:
            parts.append(f'{self.chairs_qty} - стулья')
        if self.bulb_qty:
            parts.append(f'{self.bulb_qty} - ламп.')
        return ', '.join(parts) if parts else '—'

    def save(self, *args, **kwargs):
        if not getattr(self, '_skip_price_compute', False):
            self.total_price = self.compute_total_price()
        super().save(*args, **kwargs)

    def recompute_with_items(self):
        self._skip_price_compute = True
        self.save()
        self._skip_price_compute = False
        self.total_price = self.compute_total_price()
        Application.objects.filter(pk=self.pk).update(total_price=self.total_price)


class ApplicationItem(models.Model):
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name='items'
    )
    service = models.ForeignKey(
        'services.Service', on_delete=models.SET_NULL, null=True, blank=True
    )
    title = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=0)
    unit_price = models.PositiveIntegerField(default=0)
    price_unit = models.CharField(max_length=16, default='day')
    assembly_price = models.PositiveIntegerField(default=0)
    half_price_next_days = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f'{self.title} x{self.quantity}'
