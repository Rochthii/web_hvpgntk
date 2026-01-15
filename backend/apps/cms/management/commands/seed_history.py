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
                "title_km": "បង្កើតពុទ្ធិកវិទ្យាល័យ",
                "description_vi": "Được thành lập theo Quyết định số 171/QĐ/TGCP ngày 14/9/2006 của Ban Tôn giáo Chính phủ. Đây là Học viện Phật giáo thứ tư của cả nước và là đầu tiên dành cho hệ phái Nam tông Khmer.",
                "description_km": "ត្រូវបានបង្កើតឡើងតាមសេចក្តីសម្រេចលេខ១៧១/QĐ/TGCP ចុះថ្ងៃទី១៤/៩/២០០៦ របស់ក្រុមប្រឹក្សាសាសនារដ្ឋាភិបាល។ នេះគឺជាពុទ្ធិកវិទ្យាល័យទីបួននៃប្រទេស និងជាដំបូងបង្អស់សម្រាប់និកាយថេរវាទខ្មែរ។",
            },
            {
                "year": "2017",
                "title_vi": "Khởi công xây dựng",
                "title_km": "ចាប់ផ្តើមសាងសង់",
                "description_vi": "Lễ đặt đá khởi công xây dựng cơ sở mới tại Quận Ô Môn, TP. Cần Thơ trên diện tích gần 7ha với tổng kinh phí dự kiến trên 450 tỷ đồng.",
                "description_km": "ពិធីដាក់ថ្មចាប់ផ្តើមសាងសង់មូលដ្ឋានថ្មីនៅស្រុក Ô Môn ទីក្រុង Can Tho លើផ្ទៃដីជិត៧ហិកតា ជាមួយថវិកាសរុបរំពឹងទុកលើសពី៤៥០ពាន់លានដុង។",
            },
            {
                "year": "2019",
                "title_vi": "Khánh thành Giai đoạn 1",
                "title_km": "សម្ពោធដំណាក់កាលទី១",
                "description_vi": "Hoàn thành và đưa vào sử dụng các hạng mục cơ bản sau 2 năm xây dựng, chính thức phục vụ công tác đào tạo và tu học của Tăng sinh.",
                "description_km": "បញ្ចប់ និងដាក់ឱ្យប្រើប្រាស់គម្រោងមូលដ្ឋានបន្ទាប់ពី២ឆ្នាំនៃការសាងសង់ ផ្តល់សេវាជាផ្លូវការដល់ការបណ្តុះបណ្តាល និងការសិក្សារបស់សង្ឃសិស្ស។",
            },
            {
                "year": "2023",
                "title_vi": "Khánh thành Trai đường",
                "title_km": "សម្ពោធសាលាបាយ",
                "description_vi": "Khánh thành tòa nhà Trai đường (nhà ăn) khang trang sau 4 năm xây dựng, nâng cao chất lượng đời sống cho Tăng sinh.",
                "description_km": "សម្ពោធអគារសាលាបាយ (ខ្នាលអាហារ) ដ៏ទំនើបបន្ទាប់ពី៤ឆ្នាំនៃការសាងសង់ កែលម្អគុណភាពជីវិតរបស់សង្ឃសិស្ស។",
            },
            {
                "year": "2025",
                "title_vi": "Hoàn thiện Chánh điện",
                "title_km": "បញ្ចប់ព្រះវិហារធំ",
                "description_vi": "Khánh thành ngôi Chánh điện và Kiết giới Sima, đánh dấu sự hoàn thiện cơ bản của quần thể kiến trúc Học viện sau gần 20 năm hình thành và phát triển.",
                "description_km": "សម្ពោធព្រះវិហារធំ និងកំណត់ព្រំដែនសីមា បង្ហាញពីការបញ្ចប់មូលដ្ឋាននៃស្ថាបត្យកម្មពុទ្ធិកវិទ្យាល័យបន្ទាប់ពីជិត២០ឆ្នាំនៃការបង្កើត និងអភិវឌ្ឍន៍។",
            }
        ]

        for i, item in enumerate(milestones):
            milestone, created = HistoryMilestone.objects.get_or_create(
                year=item['year'],
                defaults={
                    'title_vi': item['title_vi'],
                    'title_km': item.get('title_km', ''),
                    'description_vi': item['description_vi'],
                    'description_km': item.get('description_km', ''),
                    'display_order': i + 1,
                    'is_active': True
                }
            )
            
            # Update data
            milestone.title_vi = item['title_vi']
            milestone.title_km = item.get('title_km', '')
            milestone.description_vi = item['description_vi']
            milestone.description_km = item.get('description_km', '')
            
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
