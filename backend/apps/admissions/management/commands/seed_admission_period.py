from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.admissions.models import AdmissionPeriod
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seeds a sample Admission Period for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Admission Period...')
        
        # Create "Course XVI - 2026"
        # Dates: Open 1 month ago, closes in 2 months (to verify "OPEN" status)
        today = timezone.now().date()
        start_date = today - timedelta(days=30)
        end_date = today + timedelta(days=60)
        
        period, created = AdmissionPeriod.objects.get_or_create(
            admission_year='Khóa XVI - 2026',
            defaults={
                'application_start_date': start_date,
                'application_end_date': end_date,
                'status': 'OPEN',
                'notes': 'Đợt tuyển sinh Cử nhân Phật học Khóa XVI (2026-2030)'
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f'Successfully created period: {period}'))
        else:
            self.stdout.write(self.style.WARNING(f'Period already exists: {period}'))
            # Force status to OPEN just in case
            if period.status != 'OPEN':
                period.status = 'OPEN'
                period.application_end_date = end_date # Extend deadline
                period.save()
                self.stdout.write(self.style.SUCCESS(f'Updated period status to OPEN'))
