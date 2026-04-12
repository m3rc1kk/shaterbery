from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='PageVisit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_key', models.CharField(max_length=64)),
                ('date', models.DateField(db_index=True)),
            ],
            options={
                'unique_together': {('session_key', 'date')},
            },
        ),
    ]
