from django.core.management.base import BaseCommand
from apps.users.models import User


class Command(BaseCommand):
    help = 'Set password for admin user'

    def handle(self, *args, **options):
        try:
            admin = User.objects.get(email='admin@hocvienphatgiaonamtong.vn')
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('✅ Password set successfully!'))
            self.stdout.write(self.style.SUCCESS('Email: admin@hocvienphatgiaonamtong.vn'))
            self.stdout.write(self.style.SUCCESS('Password: admin123'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('❌ Admin user not found'))
