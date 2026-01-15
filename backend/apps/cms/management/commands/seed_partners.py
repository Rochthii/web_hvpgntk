from django.core.management.base import BaseCommand
from apps.cms.models import Partner

class Command(BaseCommand):
    help = 'Seed Partners with bilingual content'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🌱 Seeding Partners...'))
        
        Partner.objects.all().delete()
        
        partners = [
            {
                'name': 'Học viện Phật giáo Việt Nam tại TP.HCM',
                'website_url': 'https://vbu.edu.vn',
                'partner_type': 'ACADEMIC',
                'description': 'Đối tác chiến lược trong đào tạo và nghiên cứu Phật học.',
                'display_order': 1
            },
            {
                'name': 'Đại học Mahachulalongkornrajavidyalaya (MCU)',
                'website_url': 'https://mcu.ac.th',
                'partner_type': 'ACADEMIC',
                'description': 'Hợp tác trao đổi sinh viên và giảng viên quốc tế.',
                'display_order': 2
            },
            {
                'name': 'GHPGVN Tỉnh Cần Thơ',
                'website_url': 'https://phatgiaocantho.vn',
                'partner_type': 'RELIGIOUS',
                'description': 'Cơ quan chủ quản, hỗ trợ pháp lý và tài chính.',
                'display_order': 3
            },
             {
                'name': 'Đại học Trà Vinh (Khoa Ngôn ngữ Khmer)',
                'website_url': 'https://tvu.edu.vn',
                'partner_type': 'ACADEMIC',
                'description': 'Hợp tác biên soạn giáo trình tiếng Khmer và Pali.',
                'display_order': 4
            },
        ]
        
        count = 0
        for p in partners:
            Partner.objects.create(**p)
            count += 1
            self.stdout.write(f'  ✅ Created Partner: {p["name"]}')
            
        self.stdout.write(self.style.SUCCESS(f'✅ Successfully seeded {count} Partners!'))
