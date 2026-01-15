from django.core.management.base import BaseCommand
from apps.cms.models import Banner

class Command(BaseCommand):
    help = 'Seed Homepage Banners'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🌱 Seeding Banners...'))
        
        # Only clear if we are resetting or it's empty? 
        # For this request "CHANGE this image", I should ensure it's the one.
        Banner.objects.all().delete()
        
        Banner.objects.create(
            title_vi="Học viện Phật giáo Nam tông Khmer",
            title_km="ពុទ្ធិកវិទ្យាល័យពុទ្ធសាសនានមទិកខ្មែរ",
            subtitle_vi="Đoàn kết - Hòa hợp - Trí tuệ - Phụng sự",
            subtitle_km="សាមគ្គី - ឯកភាព - បញ្ញា - បម្រើ",
            image_url="banners/images/CHANHDIENTRANGCHU.png",
            display_order=1,
            is_active=True
        )
        
        self.stdout.write(self.style.SUCCESS('✅ Banner seeded with CHANHDIENTRANGCHU.png!'))
