from django.core.management.base import BaseCommand
from apps.cms.models import HistoryMilestone
from django.core.files import File
import os

class Command(BaseCommand):
    help = 'Seed initial history milestones from frontend data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding history milestones...')
        
        # Path to the placeholder image provided by user
        image_path = r'e:\web_HVPGNTK\trangchu_chanhdien.jpg'
        
        image_file = None
        if os.path.exists(image_path):
             image_file = open(image_path, 'rb')
        else:
            self.stdout.write(self.style.WARNING(f'Image not found at {image_path}'))

        milestones = [
            {
                "year": "2006",
                "title_vi": "Thành lập Học viện",
                "description_vi": "Được thành lập theo Quyết định số 171/QĐ/TGCP ngày 14/9/2006 của Ban Tôn giáo Chính phủ. Đây là Học viện Phật giáo thứ tư của cả nước và là đầu tiên dành cho hệ phái Nam tông Khmer.",
            },
            {
                "year": "2017",
                "title_vi": "Khởi công xây dựng",
                "description_vi": "Lễ đặt đá khởi công xây dựng cơ sở mới tại Quận Ô Môn, TP. Cần Thơ trên diện tích gần 7ha với tổng kinh phí dự kiến trên 450 tỷ đồng.",
            },
            {
                "year": "2019",
                "title_vi": "Khánh thành Giai đoạn 1",
                "description_vi": "Hoàn thành và đưa vào sử dụng các hạng mục cơ bản sau 2 năm xây dựng, chính thức phục vụ công tác đào tạo và tu học của Tăng sinh.",
            },
            {
                "year": "2023",
                "title_vi": "Khánh thành Trai đường",
                "description_vi": "Khánh thành tòa nhà Trai đường (nhà ăn) khang trang sau 4 năm xây dựng, nâng cao chất lượng đời sống cho Tăng sinh.",
            },
            {
                "year": "2025",
                "title_vi": "Hoàn thiện Chánh điện",
                "description_vi": "Khánh thành ngôi Chánh điện và Kiết giới Sima, đánh dấu sự hoàn thiện cơ bản của quần thể kiến trúc Học viện sau gần 20 năm hình thành và phát triển.",
            }
        ]

        for i, item in enumerate(milestones):
            milestone, created = HistoryMilestone.objects.get_or_create(
                year=item['year'],
                defaults={
                    'title_vi': item['title_vi'],
                    'description_vi': item['description_vi'],
                    'display_order': i + 1,
                    'is_active': True
                }
            )
            
            # Update data
            milestone.title_vi = item['title_vi']
            milestone.description_vi = item['description_vi']
            
            if image_file:
                # Seek to start of file for each save
                image_file.seek(0)
                # Save checks if file is different usually, but for seed we can force or checking
                milestone.image.save(f"history_{item['year']}.jpg", File(image_file), save=True)
            
            milestone.save()
            self.stdout.write(f'Processed {item["year"]}')

        if image_file:
            image_file.close()

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(milestones)} milestones'))
