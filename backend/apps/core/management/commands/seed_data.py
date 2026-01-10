import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.users.models import User, MonkProfile, LaypersonProfile
from apps.cms.models import News, SiteSetting, Page
from apps.approvals.models import RequestType, StudentRequest
from apps.academic.models import Course, Enrollment, Semester, AcademicYear, Class

class Command(BaseCommand):
    help = 'Seeds the database with initial data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')
        
        # 1. Site Settings
        self.stdout.write('Creating/Updating Site Settings...')
        SiteSetting.objects.update_or_create(
            id=1, # Assuming singleton
            defaults={
                "site_name_vi": "Học viện Phật giáo Nam tông Khmer",
                "site_name_km": "ពុទ្ធិកវិទ្យាល័យពុទ្ធសាសនានមាកមខ្មែរ",
                "contact_email": "contact@hvpg.edu.vn",
                "contact_phone": "0292.3838.3838",
                "address": "Châu Văn Liêm, Ô Môn, Cần Thơ"
            }
        )

        # 2. Users & Roles
        users_data = [
            {'email': 'admin@hvpg.edu.vn', 'role': User.Role.ADMIN, 'name': 'Quản Trị Viên', 'type': User.UserType.LAYPERSON},
            {'email': 'abbot@hvpg.edu.vn', 'role': User.Role.ABBOT, 'name': 'Hòa Thượng Hiệu Trưởng', 'type': User.UserType.MONK},
            {'email': 'teacher@hvpg.edu.vn', 'role': User.Role.TEACHER, 'name': 'Giảng Viên A', 'type': User.UserType.MONK},
            {'email': 'admission@hvpg.edu.vn', 'role': User.Role.ADMISSION, 'name': 'Cán Bộ Tuyển Sinh', 'type': User.UserType.LAYPERSON},
            {'email': 'content@hvpg.edu.vn', 'role': User.Role.CONTENT, 'name': 'Ban Biên Tập', 'type': User.UserType.LAYPERSON},
            {'email': 'secretary@hvpg.edu.vn', 'role': User.Role.SECRETARY, 'name': 'Thư Ký Văn Phòng', 'type': User.UserType.LAYPERSON},
            {'email': 'monk@hvpg.edu.vn', 'role': User.Role.STUDENT, 'name': 'Thích Pháp Hạnh', 'type': User.UserType.MONK},
            {'email': 'student@hvpg.edu.vn', 'role': User.Role.STUDENT, 'name': 'Nguyễn Văn An', 'type': User.UserType.LAYPERSON},
        ]

        for u_data in users_data:
            user, created = User.objects.update_or_create(
                email=u_data['email'],
                defaults={
                    'phone': f"090{random.randint(1000000, 9999999)}",
                    'role': u_data['role'],
                    'user_type': u_data['type'],
                    'is_active': True,
                    'is_staff': u_data['role'] == User.Role.ADMIN
                }
            )
            
            if created:
                user.set_password('123456')
                user.save()
                self.stdout.write(f"Created user: {u_data['email']}")
            else:
                self.stdout.write(f"Updated user: {u_data['email']}")

            # Update Profiles
            if u_data['type'] == User.UserType.MONK:
                MonkProfile.objects.update_or_create(
                    user=user,
                    defaults={
                        'dharma_name_khmer': u_data['name'],
                        'dharma_name_vietnamese': u_data['name'],
                        'status': MonkProfile.Status.ACTIVE
                    }
                )
            else:
                LaypersonProfile.objects.update_or_create(
                    user=user,
                    defaults={
                        'full_name': u_data['name'],
                        'status': LaypersonProfile.Status.ACTIVE
                    }
                )

        # 3. Request Types
        req_types = [
            'Xin nghỉ phép', 'Xin bảo lưu', 'Xin bảng điểm', 'Xin giấy xác nhận sinh viên'
        ]
        for rt in req_types:
            RequestType.objects.get_or_create(
                name=rt,
                defaults={'code': rt.upper().replace(' ', '_'), 'is_active': True}
            )

        # 4. Run Sub-Seeders for Rich Content
        self.stdout.write(self.style.WARNING("🚀 Launching accurate data seeder (CMS, Courses, Staff)..."))
        from django.core.management import call_command
        call_command('seed_accurate_data')
        
        self.stdout.write(self.style.WARNING("🎓 Launching academic data seeder (Classes, Enrollments)..."))
        call_command('seed_academic_data')

        self.stdout.write(self.style.SUCCESS('Successfully seeded database with FULL DATASET'))
