# Generated by Django 4.2.5 on 2023-10-03 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Pokemon',
            fields=[
                ('id', models.PositiveBigIntegerField(primary_key=True, serialize=False)),
                ('english_name', models.CharField(max_length=50)),
                ('types', models.JSONField()),
            ],
        ),
    ]
