from django.core.management.base import BaseCommand
from apps.cms.models import SiteSetting

class Command(BaseCommand):
    help = 'Update Site Settings Hero Image'

    def handle(self, *args, **options):
        obj = SiteSetting.get_settings()
        # Relative path within MEDIA_ROOT
        obj.hero_image = 'settings/hero/CHANHDIENTRANGCHU.png'
        # Ensure title/slogan fallback is present if not set
        if not obj.site_name_vi:
            obj.site_name_vi = "Học viện Phật giáo Nam tông Khmer"
        if not obj.site_slogan_vi:
            obj.site_slogan_vi = "Đoàn kết - Hòa hợp - Trí tuệ - Phụng sự"
            
        obj.save()
        self.stdout.write(self.style.SUCCESS('✅ Site Setting Hero Image Updated!'))
