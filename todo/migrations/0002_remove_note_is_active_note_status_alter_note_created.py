# Generated by Django 4.0.4 on 2022-05-28 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='note',
            name='is_active',
        ),
        migrations.AddField(
            model_name='note',
            name='status',
            field=models.CharField(choices=[('Active', 'Active'), ('Closed', 'Closed')], default='Active', max_length=16),
        ),
        migrations.AlterField(
            model_name='note',
            name='created',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]