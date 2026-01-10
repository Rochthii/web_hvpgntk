
from django.core.management.base import BaseCommand
from apps.cms.models import StaffMember

class Command(BaseCommand):
    help = 'Checks leadership data'

    def handle(self, *args, **options):
        self.stdout.write('Checking StaffMember data...')
        
        all_staff = StaffMember.objects.all()
        self.stdout.write(f'Total Staff: {all_staff.count()}')
        
        leadership = StaffMember.objects.filter(staff_type='leadership')
        self.stdout.write(f"Leadership (lower 'leadership'): {leadership.count()}")

        leadership_upper = StaffMember.objects.filter(staff_type='LEADERSHIP')
        self.stdout.write(f"Leadership (upper 'LEADERSHIP'): {leadership_upper.count()}")
        
        for s in all_staff:
            self.stdout.write(f" - {s.display_name_vi} ({s.staff_type}) order={s.display_order}")
