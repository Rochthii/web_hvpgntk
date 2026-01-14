import os
from django.core.management.base import BaseCommand
from django.core.files import File
from apps.cms.models import News
from django.conf import settings

class Command(BaseCommand):
    help = 'Migrates local news images to Supabase Storage'

    def handle(self, *args, **options):
        self.stdout.write('Migrating news images to Supabase...')

        # Map Slugs to Filenames (based on seed_news.py)
        # We use absolute paths to the frontend public folder
        FRONTEND_IMAGES_DIR = r'e:\web_HVPGNTK\frontend\public\images\news'
        
        mapping = {
            'le-khanh-thanh-chanh-dien-2025': 'buddhist_ceremony.png',
            'tong-ket-khoa-thien-vipassana-2024': 'vipassana_meditation.png',
            'mung-tet-chol-chnam-thmay-2024': 'khmer_new_year.png',
            'le-ok-om-bok-cung-trang-2024': 'ok_om_bok.png',
            'trao-hoc-bong-duc-nhuan-2024': 'scholarship.png',
            'le-sene-dolta-bao-hieu-2024': 'sene_dolta.png',
            'chuong-trinh-dao-tao-cu-nhan-phat-hoc-pali': 'monks_studying.png',
            'kien-truc-chua-khmer-ban-sac-doc-dao': 'temple_architecture.png',
            'hoc-vien-xay-duong-noi-bo-chung-tay-cong-dong': 'community_service.png',
            'thong-bao-tuyen-sinh-khoa-xviii-2025': 'graduation.png',
        }

        updated_count = 0
        
        for slug, filename in mapping.items():
            try:
                news = News.objects.get(slug=slug)
                file_path = os.path.join(FRONTEND_IMAGES_DIR, filename)
                
                if os.path.exists(file_path):
                    self.stdout.write(f"Uploading {filename} for {slug}...")
                    
                    # Open the local file
                    with open(file_path, 'rb') as f:
                        # Save to the ImageField
                        # This triggers storage.save() -> SupabaseStorage._save()
                        # Which enables our compression logic automatically!
                        news.featured_image_url.save(filename, File(f), save=True)
                        
                    updated_count += 1
                    self.stdout.write(self.style.SUCCESS(f"✅ Uploaded: {filename}"))
                else:
                    self.stdout.write(self.style.WARNING(f"File not found: {file_path}"))
                    
            except News.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"News not found: {slug}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error uploading {slug}: {e}"))

        self.stdout.write(self.style.SUCCESS(f'\nComplete! Updated {updated_count} news articles.'))
