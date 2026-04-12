from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0005_alter_application_phone'),
        ('services', '0004_city_service_city'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='city',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='applications',
                to='services.city',
            ),
        ),
    ]
