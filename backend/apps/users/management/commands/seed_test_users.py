from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.users.models import LaypersonProfile, MonkProfile

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds test user accounts for Teacher and Content roles'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating test users...')

        # 1. Teacher (Giảng viên) - Hòa thượng
        if not User.objects.filter(email='teacher@hvpgntk.edu.vn').exists():
            teacher_user = User.objects.create_user(
                email='teacher@hvpgntk.edu.vn',
                phone='0901111111',
                password='teacher123',
                role='teacher'
            )
            MonkProfile.objects.create(
                user=teacher_user,
                dharma_name='Minh Tuệ',
                gender='male',
                nationality='Việt Nam'
            )
            self.stdout.write(self.style.SUCCESS('✅ Teacher created: teacher@hvpgntk.edu.vn / teacher123'))
        else:
            self.stdout.write('Teacher already exists')

        # 2. Content Creator (Biên tập viên) 
        if not User.objects.filter(email='content@hvpgntk.edu.vn').exists():
            content_user = User.objects.create_user(
                email='content@hvpgntk.edu.vn',
                phone='0902222222',
                password='content123',
                role='content'
            )
            LaypersonProfile.objects.create(
                user=content_user,
                full_name='Nguyễn Văn An',
                gender='male',
                nationality='Việt Nam'
            )
            self.stdout.write(self.style.SUCCESS('✅ Content Creator created: content@hvpgntk.edu.vn / content123'))
        else:
            self.stdout.write('Content Creator already exists')

        # 3. Student (Học viên) - For testing
        if not User.objects.filter(email='student@hvpgntk.edu.vn').exists():
            student_user = User.objects.create_user(
                email='student@hvpgntk.edu.vn',
                phone='0903333333',
                password='student123',
                role='student'
            )
            MonkProfile.objects.create(
                user=student_user,
                dharma_name='Tâm An',
                gender='male',
                student_code='TS2024001',
                nationality='Việt Nam'
            )
            self.stdout.write(self.style.SUCCESS('✅ Student created: student@hvpgntk.edu.vn / student123'))
        else:
            self.stdout.write('Student already exists')

        self.stdout.write(self.style.SUCCESS('🎉 Test users seeding COMPLETED!'))
