from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.cms.models import SiteSetting, News
from apps.users.models import LaypersonProfile
from apps.admissions.models import AdmissionPeriod
from django.utils import timezone
from datetime import timedelta
from uuid import UUID

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial data for the application'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # 1. Create Superuser
        admin_user = None
        if not User.objects.filter(email='admin@hvpgntk.edu.vn').exists():
            # Don't pass full_name to create_superuser as User model doesn't have it
            admin_user = User.objects.create_superuser(
                email='admin@hvpgntk.edu.vn',
                phone='0909999999',
                password='admin',
                role='admin'
            )
            # Create Profile
            LaypersonProfile.objects.create(
                user=admin_user,
                full_name='Quản trị viên hệ thống',
                gender='male',
                nationality='Việt Nam'
            )
            self.stdout.write(self.style.SUCCESS('Superuser created (admin@hvpgntk.edu.vn / admin)'))
        else:
            admin_user = User.objects.get(email='admin@hvpgntk.edu.vn')
            self.stdout.write('Superuser already exists')

        # 2. Site Settings
        if not SiteSetting.objects.exists():
            SiteSetting.objects.create(
                id=UUID('00000000-0000-0000-0000-000000000001'),
                site_name_vi='Học viện Phật giáo Nam tông Khmer',
                site_slogan_vi='Đoàn kết - Hòa hợp - Trí tuệ - Phụng sự',
                site_name_km='ពុទ្ធិកវិទ្យាល័យខ្មែរថេរវាទ',
                site_slogan_km='សាមគ្គី - ស្មោះត្រង់ - បញ្ញា - បម្រើ',
                contact_email='contact@hvpgntk.edu.vn',
                contact_phone='0292 738 925',
                contact_address='Ô Môn, Cần Thơ',
                founded_year='2006',
                student_count='450+',
                course_count='30+'
            )
            self.stdout.write(self.style.SUCCESS('Site Settings created'))

        # 3. Dummy News
        if News.objects.count() < 3:
            News.objects.create(
                title_vi='Thông báo Tuyển sinh Khóa VIII (2025-2029)',
                slug='thong-bao-tuyen-sinh-khoa-8',
                excerpt_vi='Học viện Phật giáo Nam tông Khmer thông báo tuyển sinh khóa VIII hệ Cử nhân Phật học.',
                content_vi='<p>Học viện thông báo tuyển sinh...</p>',
                author=admin_user,
                status='published',
                category='announcement', # News.Category.ANNOUNCEMENT
                published_at=timezone.now(),
                is_featured=True
            )
            
            News.objects.create(
                title_vi='Lễ Khai giảng năm học mới 2025',
                slug='le-khai-giang-nam-hoc-moi',
                excerpt_vi='Học viện long trọng tổ chức lễ khai giảng năm học 2025-2026 với sự tham dự của chư Tôn đức.',
                content_vi='<p>Nội dung chi tiết lễ khai giảng...</p>',
                author=admin_user,
                status='published',
                category='academy_news', # News.Category.ACADEMY_NEWS
                published_at=timezone.now() - timedelta(days=2)
            )
            
            News.objects.create(
                title_vi='Hội thảo Phật giáo Nam tông và Văn hóa Khmer',
                slug='hoi-thao-phat-giao-nam-tong',
                excerpt_vi='Hội thảo khoa học quốc tế về vai trò của Phật giáo Nam tông trong văn hóa Khmer.',
                content_vi='<p>Nội dung chi tiết hội thảo...</p>',
                author=admin_user,
                status='published',
                category='academy_news', # Corrected to valid choice
                published_at=timezone.now() - timedelta(days=5)
            )
            self.stdout.write(self.style.SUCCESS('Dummy News created'))

        # 4. Admission Period
        if not AdmissionPeriod.objects.exists():
            AdmissionPeriod.objects.create(
                admission_year='2025-2029',
                application_start_date=timezone.now().date(),
                application_end_date=timezone.now().date() + timedelta(days=90),
                status='OPEN',
                notes='Đợt tuyển sinh chính quy Khóa VIII'
            )
            self.stdout.write(self.style.SUCCESS('Admission Period created'))

        self.stdout.write(self.style.SUCCESS('Seeding COMPLETED!'))
