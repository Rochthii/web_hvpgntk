# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0002_sitesetting_course_count_sitesetting_founded_year_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='news',
            name='is_announcement',
            field=models.BooleanField(default=False),
        ),
    ]
