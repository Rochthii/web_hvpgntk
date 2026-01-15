from django.core.management.base import BaseCommand
from apps.cms.models import FAQ

class Command(BaseCommand):
    help = 'Seed FAQs with bilingual content (VN + KM)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🌱 Seeding FAQs (Bilingual)...'))
        
        # Delete existing FAQs
        FAQ.objects.all().delete()
        
        faqs_data = [
            # GENERAL
            {
                'question_vi': 'Học viện có ký túc xá cho Tăng sinh không?',
                'question_km': 'តើវិទ្យាស្ថានមានអន្តេវាសិកដ្ឋានសម្រាប់សមណនិស្សិតដែរឬទេ?',
                'answer_vi': 'Có. Học viện cung cấp ký túc xá miễn phí với đầy đủ tiện nghi cho toàn bộ Tăng sinh theo học hệ chính quy. Các Tăng sinh sẽ sinh hoạt tập trung theo quy định của Học viện và Giáo hội.',
                'answer_km': 'មាន។ វិទ្យាស្ថានផ្តល់អន្តេវាសិកដ្ឋានដោយឥតគិតថ្លៃ ជាមួយនឹងបរិក្ខារពេញលេញសម្រាប់សមណនិស្សិតទាំងអស់ដែលសិក្សាក្នុងប្រព័ន្ធសិក្សាពេញម៉ោង។ សមណនិស្សិតនឹងរស់នៅជុំគ្នា និងអនុវត្តតាមបទប្បញ្ញត្តិរបស់វិទ្យាស្ថាន និងសង្ឃគណៈ។',
                'category': 'GENERAL',
                'display_order': 1
            },
            {
                'question_vi': 'Thời gian đào tạo Cử nhân Phật học là bao lâu?',
                'question_km': 'តើរយៈពេលបណ្តុះបណ្តាលបរិញ្ញាបត្រពុទ្ធសាសនាមានរយៈពេលប៉ុន្មាន?',
                'answer_vi': 'Chương trình Cử nhân Phật học tại Học viện Phật giáo Nam tông Khmer kéo dài 04 năm (8 học kỳ). Tăng sinh sẽ hoàn thành khối lượng kiến thức khoảng 120-130 tín chỉ bao gồm các môn Phật học, Ngoại ngữ, và Giáo dục đại cương.',
                'answer_km': 'កម្មវិធីបរិញ្ញាបត្រពុទ្ធសាសនានៅពុទ្ធិកវិទ្យាល័យពុទ្ធសាសនានមទិកខ្មែរមានរយៈពេល ០៤ ឆ្នាំ (០៨ ឆមាស)។ សមណនិស្សិតនឹងត្រូវបំពេញបរិមាណចំណេះដឹងប្រហែល ១២០-១៣០ ក្រេឌីត រួមមានមុខវិជ្ជាពុទ្ធសាសនា ភាសាបរទេស និងការអប់រំទូទៅ។',
                'category': 'ACADEMIC',
                'display_order': 2
            },
            # ADMISSION
            {
                'question_vi': 'Điều kiện nộp hồ sơ tuyển sinh là gì?',
                'question_km': 'តើលក្ខខណ្ឌដាក់ពាក្យស្នើសុំចូលរៀនមានអ្វីខ្លះ?',
                'answer_vi': 'Thí sinh cần đáp ứng các điều kiện sau: 1) Là Tăng ni sinh Phật giáo Nam tông Khmer; 2) Đã tốt nghiệp THPT hoặc tương đương; 3) Có đạo hạnh tốt và sức khỏe đảm bảo; 4) Được sự giới thiệu của Bổn sư hoặc Ban Trị sự địa phương.',
                'answer_km': 'បេក្ខជនត្រូវបំពេញតាមលក្ខខណ្ឌដូចខាងក្រោម៖ ១) ជាសមណនិស្សិតពុទ្ធសាសនានមទិកខ្មែរ ២) បានបញ្ចប់ការសិក្សាកម្រិតវិទ្យាល័យ ឬសមមូល ៣) មានអាកប្បកិរិយាល្អ និងសុខភាពល្អ ៤) មានការណែនាំពីគ្រូឧបជ្ឈាយ៍ ឬគណៈកម្មការគ្រប់គ្រងមូលដ្ឋាន។',
                'category': 'ADMISSION',
                'display_order': 3
            },
            # ACADEMIC
            {
                'question_vi': 'Học viện có dạy tiếng Pali và Khmer không?',
                'question_km': 'តើវិទ្យាស្ថានមានបង្រៀនភាសាបាលី និងខ្មែរដែរឬទេ?',
                'answer_vi': 'Có. Tiếng Pali là ngôn ngữ nòng cốt để nghiên cứu Tam Tạng Kinh Điển. Tiếng Khmer và Văn hóa Khmer cũng là các môn học bắt buộc và mũi nhọn trong chương trình đào tạo.',
                'answer_km': 'មាន។ ភាសាបាលីគឺជាភាសាស្នូលសម្រាប់ការសិក្សាព្រះត្រៃបិដក។ ភាសាខ្មែរ និងវប្បធម៌ខ្មែរក៏ជាមុខវិជ្ជាកាតព្វកិច្ច និងជាមុខវិជ្ជាសំខាន់ក្នុងកម្មវិធីបណ្តុះបណ្តាលផងដែរ។',
                'category': 'ACADEMIC',
                'display_order': 4
            },
        ]

        count = 0
        for faq in faqs_data:
            FAQ.objects.create(**faq)
            count += 1
            self.stdout.write(f'  ✅ Created FAQ: {faq["question_vi"]}')
            
        self.stdout.write(self.style.SUCCESS(f'✅ Successfully seeded {count} FAQs (Bilingual)!'))
