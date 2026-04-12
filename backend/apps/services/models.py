from django.db import models
from django.utils import timezone


class City(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    region_label = models.CharField(max_length=200, blank=True, default='')

    class Meta:
        ordering = ['name']
        verbose_name = 'Город'
        verbose_name_plural = 'Города'

    def __str__(self):
        return self.name


class Service(models.Model):
    UNIT_CHOICES = [
        ('day', 'сутки'),
        ('piece', 'шт'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='services/', blank=True, default='')
    price_value = models.PositiveIntegerField(default=0)
    price_unit = models.CharField(max_length=16, choices=UNIT_CHOICES, default='day')
    assembly_price = models.PositiveIntegerField(default=0)
    half_price_next_days = models.BooleanField(default=False)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, related_name='services')
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['sort_order', '-created_at']

    def __str__(self):
        return self.title
