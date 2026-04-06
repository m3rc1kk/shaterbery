from django.db import models
from django.utils import timezone


class Service(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='services/', blank=True, default='')
    price = models.CharField(max_length=64)
    price_postscript = models.CharField(max_length=64, blank=True, default='')
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['sort_order', '-created_at']

    def __str__(self):
        return self.title
