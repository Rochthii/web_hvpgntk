
import os
import django
import sys

# Setup Django environment
sys.path.append('e:\\web_HVPGNTK\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

from apps.cms.models import StaffMember

print(f"Total Staff: {StaffMember.objects.count()}")
leadership = StaffMember.objects.filter(staff_type='LEADERSHIP')
print(f"Leadership count (UPPER): {leadership.count()}")

leadership_lower = StaffMember.objects.filter(staff_type='leadership')
print(f"Leadership count (lower): {leadership_lower.count()}")

for s in StaffMember.objects.all():
    print(f"ID: {s.id} | Name: {s.display_name_vi} | Type: '{s.staff_type}' | Order: {s.display_order}")
