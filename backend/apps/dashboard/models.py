from django.db import models


class PageVisit(models.Model):
    session_key = models.CharField(max_length=64)
    date = models.DateField(db_index=True)

    class Meta:
        unique_together = [('session_key', 'date')]

    def __str__(self):
        return f'{self.session_key} @ {self.date}'
