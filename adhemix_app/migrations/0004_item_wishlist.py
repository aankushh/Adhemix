# Generated by Django 3.0.4 on 2020-06-30 02:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adhemix_app', '0003_item_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='wishlist',
            field=models.BooleanField(default=False),
        ),
    ]
