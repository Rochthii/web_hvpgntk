from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from apps.cms.models import News, Page, SiteSetting
from apps.admissions.models import AdmissionApplication, AdmissionPeriod

class Command(BaseCommand):
    help = 'Seeds initial user groups and permissions'

    def handle(self, *args, **options):
        # 1. Ban Biên Tập (Editorial Board)
        editors_group, created = Group.objects.get_or_create(name='Ban Biên Tập')
        self.stdout.write(f"{'Created' if created else 'Found'} group 'Ban Biên Tập'")

        # Define permissions for Editors
        editor_models = [News, Page, SiteSetting]
        editor_perms = []
        for model in editor_models:
            ct = ContentType.objects.get_for_model(model)
            perms = Permission.objects.filter(content_type=ct)
            editor_perms.extend(perms)
        
        editors_group.permissions.set(editor_perms)
        self.stdout.write(self.style.SUCCESS(f"Assigned {len(editor_perms)} permissions to 'Ban Biên Tập'"))

        # 2. Ban Tuyển Sinh (Admissions Board)
        admissions_group, created = Group.objects.get_or_create(name='Ban Tuyển Sinh')
        self.stdout.write(f"{'Created' if created else 'Found'} group 'Ban Tuyển Sinh'")

        # Define permissions for Admissions
        admission_models = [AdmissionApplication, AdmissionPeriod]
        admission_perms = []
        for model in admission_models:
            ct = ContentType.objects.get_for_model(model)
            # Admissions staff usually need to view and change, maybe not delete everything, but let's give full control for now within their domain
            perms = Permission.objects.filter(content_type=ct) 
            admission_perms.extend(perms)
            
        admissions_group.permissions.set(admission_perms)
        self.stdout.write(self.style.SUCCESS(f"Assigned {len(admission_perms)} permissions to 'Ban Tuyển Sinh'"))

        self.stdout.write(self.style.SUCCESS("Successfully seeded groups and permissions!"))
