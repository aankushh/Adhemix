# Generated by Django 3.0.4 on 2020-06-25 08:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adhemix_app', '0002_auto_20200625_1316'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='image',
            field=models.ImageField(default=2, upload_to=''),
            preserve_default=False,
        ),
    ]
