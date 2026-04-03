from decimal import Decimal

from django.db import models
from django.utils import timezone


class Application(models.Model):
    class Status(models.TextChoices):
        NEW = 'new', 'Новый'
        INWORK = 'inwork', 'В работе'
        CLOSED = 'closed', 'Закрыт'

    class Source(models.TextChoices):
        SITE = 'site', 'Сайт'
        MANUAL = 'manual', 'Вручную'

    _PRICE_TENT_3X6 = Decimal('2000')
    _PRICE_TENT_3X3 = Decimal('1500')
    _PRICE_FURNITURE = Decimal('500')
    _PRICE_CHAIR = Decimal('200')
    _PRICE_BULB = Decimal('100')

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=32)
    event_date = models.DateField()
    event_time = models.TimeField()
    location = models.TextField()
    tent_3x6_qty = models.PositiveIntegerField(default=0)
    tent_3x3_qty = models.PositiveIntegerField(default=0)
    furniture_qty = models.PositiveIntegerField(default=0)
    chairs_qty = models.PositiveIntegerField(default=0)
    bulb_qty = models.PositiveIntegerField(default=0)
    delivery = models.BooleanField(default=False)
    assembly = models.BooleanField(default=False)
    source = models.CharField(max_length=32, choices=Source.choices, default=Source.SITE)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NEW)
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at', '-id']

    def compute_total_price(self) -> Decimal:
        total = Decimal('0')
        total += Decimal(self.tent_3x6_qty) * self._PRICE_TENT_3X6
        total += Decimal(self.tent_3x3_qty) * self._PRICE_TENT_3X3
        total += Decimal(self.furniture_qty) * self._PRICE_FURNITURE
        total += Decimal(self.chairs_qty) * self._PRICE_CHAIR
        total += Decimal(self.bulb_qty) * self._PRICE_BULB
        return total.quantize(Decimal('0.01'))

    def goods_lines(self):
        lines = []
        if self.tent_3x6_qty:
            u = self._PRICE_TENT_3X6
            q = self.tent_3x6_qty
            lines.append({
                'label': 'Шатёр 3×6 м',
                'quantity': q,
                'unit_price': str(u),
                'line_total': str((Decimal(q) * u).quantize(Decimal('0.01'))),
            })
        if self.tent_3x3_qty:
            u = self._PRICE_TENT_3X3
            q = self.tent_3x3_qty
            lines.append({
                'label': 'Шатёр 3×3 м',
                'quantity': q,
                'unit_price': str(u),
                'line_total': str((Decimal(q) * u).quantize(Decimal('0.01'))),
            })
        if self.furniture_qty:
            u = self._PRICE_FURNITURE
            q = self.furniture_qty
            lines.append({
                'label': 'Комплект мебели',
                'quantity': q,
                'unit_price': str(u),
                'line_total': str((Decimal(q) * u).quantize(Decimal('0.01'))),
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
        return lines

    def composition_summary(self) -> str:
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
        self.total_price = self.compute_total_price()
        super().save(*args, **kwargs)
