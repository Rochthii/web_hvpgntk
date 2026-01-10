import uuid
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.cms.models import SiteSetting, Page, News, StaffMember
from apps.academic.models import AcademicYear, Course, Semester, Class, Enrollment
from apps.admissions.models import AdmissionPeriod

class Command(BaseCommand):
    help = 'Seeds core data for the application to run out-of-the-box'

    def handle(self, *args, **options):
        self.stdout.write('🌱 Seeding core data...')

        # 1. Site Settings
        self.seed_settings()

        # 2. Basic Pages
        self.seed_pages()

        # 3. Academic Data
        self.seed_academic()

        # 4. Admissions Data
        self.seed_admissions()

        # 5. News Data
        self.seed_news()

        self.stdout.write(self.style.SUCCESS('✨ Core data seeded successfully!'))

    def seed_settings(self):
        defaults = {
            'site_name_vi': 'Học viện Phật giáo Nam tông Khmer',
            'site_name_km': 'ពុទ្ធិកវិទ្យាល័យពុទ្ធសាសនានមទិកខ្មែរ',
            'site_slogan_vi': 'Đoàn kết - Hòa hợp - Trí tuệ - Phụng sự',
            'contact_email': 'hvpgntk@edu.vn',
            'contact_phone': '0292 738 925',
            'contact_address': 'Khu vực 12, Phường Châu Văn Liêm, Quận Ô Môn, TP. Cần Thơ',
            'founded_year': '2006',
            'student_count': '450+',
            'course_count': '30+'
        }
        SiteSetting.objects.update_or_create(
            pk=uuid.UUID('00000000-0000-0000-0000-000000000001'),
            defaults=defaults
        )
        self.stdout.write('- Set up Site Settings')

    def seed_pages(self):
        pages = [
            {
                'title_vi': 'Giới thiệu chung',
                'slug': 'gioi-thieu',
                'content_vi': '''
                <p>Học viện Phật giáo Nam tông Khmer là cơ sở giáo dục đại học, đào tạo Cử nhân Phật học và các chuyên ngành liên quan, trực thuộc Giáo hội Phật giáo Việt Nam.</p>
                <p>Được thành lập vào năm 2006, Học viện mang sứ mệnh đào tạo Tăng tài, giữ gìn và phát huy bản sắc văn hóa Phật giáo Nam tông Khmer, đồng thời góp phần xây dựng khối đại đoàn kết dân tộc.</p>
                <p>Với cơ sở vật chất khang trang tại TP. Cần Thơ và đội ngũ giảng viên uy tín, Học viện đang là điểm đến tâm linh và học thuật quan trọng của khu vực Đồng bằng sông Cửu Long.</p>
                ''',
                'page_type': 'ABOUT',
                'menu_order': 1
            },
            {
                'title_vi': 'Lịch sử hình thành',
                'slug': 'lich-su',
                'content_vi': '''
                <h3>Khởi nguồn và Thành lập (2006)</h3>
                <p>Ngày 14/9/2006, Ban Tôn giáo Chính phủ ban hành Quyết định số 171/QĐ/TGCP chấp thuận thành lập Học viện Phật giáo Nam tông Khmer. Đây là cột mốc lịch sử, đánh dấu sự ra đời của cơ sở giáo dục đại học đầu tiên dành riêng cho hệ phái Nam tông Khmer tại Việt Nam.</p>
                <p>Ngày 16/10/2006, UBND TP. Cần Thơ cấp quyết định đầu tư xây dựng trên quỹ đất 11,3ha tại quận Ô Môn. Trong thời gian chờ xây dựng, Học viện hoạt động tạm thời tại Chùa Pothisomron (Ô Môn).</p>
                
                <h3>Giai đoạn đào tạo đầu tiên (2007 - 2016)</h3>
                <p>Năm 2007, Học viện khai giảng Khóa I với 69 Tăng sinh. Năm 2011, khóa đầu tiên tốt nghiệp, đánh dấu thành quả đào tạo ban đầu.</p>
                <p>Trong giai đoạn này, Học viện liên kết với ĐH KHXH&NV (ĐHQG Hà Nội) để đào tạo Cử nhân Tôn giáo học, mở rộng kiến thức xã hội cho Tăng sinh.</p>

                <h3>Kiến thiết cơ sở mới (2017 - 2019)</h3>
                <p>Ngày 25/3/2017, Lễ đặt đá khởi công xây dựng Học viện mới được tổ chức trọng thể với tổng kinh phí dự kiến 451 tỷ đồng.</p>
                <p>Ngày 09/01/2019, Giai đoạn I (Khu Hiệu bộ, Giảng đường, Tăng xá) hoàn thành và đưa vào sử dụng.</p>

                <h3>Hoàn thiện và Phát triển (2025 - Nay)</h3>
                <p>Tháng 2/2025, Chánh điện và Kiết giới Sima được khánh thành, hoàn thiện quần thể kiến trúc tâm linh và giáo dục. Học viện trở thành trung tâm đào tạo, nghiên cứu văn hóa - tôn giáo lớn nhất của Phật giáo Nam tông Khmer vùng ĐBSCL.</p>
                ''',
                'page_type': 'HISTORY',
                'menu_order': 2
            },
            {
                'title_vi': 'Sứ mệnh & Tầm nhìn',
                'slug': 'su-menh',
                'content_vi': '''
                <h2>Tầm nhìn</h2>
                <p>Trở thành trung tâm giáo dục và nghiên cứu Phật học Nam tông hàng đầu khu vực Đông Nam Á, nơi hội tụ và lan tỏa tri thức, đạo đức và văn hóa Khmer.</p>
                
                <h2>Sứ mệnh</h2>
                <ul>
                    <li><strong>Đào tạo Tăng tài:</strong> Cung cấp nguồn nhân lực chất lượng cao (Cử nhân, Thạc sĩ, Tiến sĩ Phật học) có đạo hạnh và trí tuệ cho Giáo hội.</li>
                    <li><strong>Bảo tồn Văn hóa:</strong> Giữ gìn tiếng nói, chữ viết và các giá trị văn hóa truyền thống của đồng bào dân tộc Khmer.</li>
                    <li><strong>Đoàn kết Dân tộc:</strong> Là cầu nối gắn kết đạo và đời, góp phần xây dựng khối đại đoàn kết toàn dân tộc.</li>
                </ul>
                ''',
                'page_type': 'MISSION',
                'menu_order': 3
            },
             {
                'title_vi': 'Cơ cấu tổ chức',
                'slug': 'co-cau',
                'content_vi': '<h2>Hội đồng Điều hành</h2><p>Học viện được điều hành bởi Hội đồng bao gồm...</p>',
                'page_type': 'ORGANIZATION',
                'menu_order': 4
            }
        ]
        
        for p in pages:
            Page.objects.update_or_create(slug=p['slug'], defaults=p)
        self.stdout.write(f'- Seeded {len(pages)} basic pages')

    def seed_academic(self):
        # Current Year
        current_year, _ = AcademicYear.objects.get_or_create(
            year_code='2025-2026',
            defaults={
                'name': '2025-2026',
                'start_date': '2025-09-01',
                'end_date': '2026-06-30',
                'is_current': True
            }
        )
        
        # Courses
        courses = [
            {'code': 'PAL101', 'name_vi': 'Pali Cơ bản 1', 'credits': 3, 'category': 'REQUIRED', 'knowledge_block': 'PALI'},
            {'code': 'VNH101', 'name_vi': 'Văn học Phật giáo', 'credits': 2, 'category': 'ELECTIVE', 'knowledge_block': 'GENERAL'},
            {'code': 'VIN101', 'name_vi': 'Luật học Đại cương', 'credits': 3, 'category': 'REQUIRED', 'knowledge_block': 'VINAYA'},
            {'code': 'SUT101', 'name_vi': 'Kinh Tạng 1', 'credits': 3, 'category': 'REQUIRED', 'knowledge_block': 'SUTTA'},
            {'code': 'ABH101', 'name_vi': 'Thắng Pháp Tập Yếu', 'credits': 3, 'category': 'REQUIRED', 'knowledge_block': 'ABHIDHAMMA'},
        ]
        
        for c in courses:
            Course.objects.update_or_create(code=c['code'], defaults=c)

        # 3. Staff Members (Leadership)
        self.stdout.write('Seeding Leadership...')
        
        # Clear existing leadership to prevent duplicates (both cases)
        StaffMember.objects.filter(staff_type__iexact='leadership').delete()

        staff_list = [
            {
                'display_name_vi': 'HT. Đào Như',
                'position': 'Viện trưởng Học viện',
                'staff_type': 'leadership',
                'title_vi': 'Hòa thượng',
                'display_order': 1
            },
            {
                'display_name_vi': 'HT. Thạch Sok Xane',
                'position': 'Phó Viện trưởng Thường trực',
                'staff_type': 'leadership',
                'title_vi': 'Hòa thượng',
                'display_order': 2
            },
            {
                'display_name_vi': 'HT. Danh Lung',
                'position': 'Phó Viện trưởng kiểm Tổng thư ký',
                'staff_type': 'leadership',
                'title_vi': 'Hòa thượng',
                'display_order': 3
            },
            {
                'display_name_vi': 'HT. Thạch Huônl',
                'position': 'Phó Viện trưởng kiểm Giám luật',
                'staff_type': 'leadership',
                'title_vi': 'Hòa thượng',
                'display_order': 4
            },
            {
                'display_name_vi': 'TT. Lý Hùng',
                'position': 'Phó Viện trưởng kiểm Chánh Văn phòng',
                'staff_type': 'leadership',
                'title_vi': 'Thượng tọa',
                'display_order': 5
            },
            {
                'display_name_vi': 'HT. Danh Thiệp',
                'position': 'Phó Viện trưởng',
                'staff_type': 'leadership',
                'title_vi': 'Hòa thượng',
                'display_order': 6
            },
            {
                'display_name_vi': 'HT. Danh Đổng',
                'position': 'Phó Viện trưởng',
                'staff_type': 'leadership',
                'title_vi': 'Hòa thượng',
                'display_order': 7
            },
            {
                'display_name_vi': 'TT. Sơn Ngọc Huynh',
                'position': 'Phó Tổng Thư ký kiểm Phó Văn phòng',
                'staff_type': 'leadership',
                'title_vi': 'Thượng tọa',
                'display_order': 8
            },
            {
                'display_name_vi': 'TT. Trần Văn Tha',
                'position': 'Phó Văn phòng',
                'staff_type': 'leadership',
                'title_vi': 'Thượng tọa',
                'display_order': 9
            },
            {
                'display_name_vi': 'TT. Trần Sone',
                'position': 'Phó Văn phòng',
                'staff_type': 'leadership',
                'title_vi': 'Thượng tọa',
                'display_order': 10
            },
            {
                'display_name_vi': 'ĐĐ. Thạch Diệp',
                'position': 'Thủ quỹ',
                'staff_type': 'leadership',
                'title_vi': 'Đại đức',
                'display_order': 11
            }
        ]

        for s in staff_list:
            StaffMember.objects.update_or_create(display_name_vi=s['display_name_vi'], defaults=s)
            
        self.stdout.write('- Seeded Academic Year, Courses, and Leadership Staff')

    def seed_admissions(self):
        self.stdout.write('Seeding Admissions...')
        # Create an open admission period for the current year
        AdmissionPeriod.objects.update_or_create(
            admission_year='2025-2026',
            defaults={
                'application_start_date': timezone.now().date(),
                'application_end_date': timezone.now().date() + timezone.timedelta(days=30),
                'status': 'OPEN',
                'notes': 'Tuyển sinh khóa XVII - Hệ Cử nhân Phật học'
            }
        )
        self.stdout.write('- Seeded Active Admission Period')

    def seed_news(self):
        self.stdout.write('Seeding News...')
        news_list = [
            {
                'title_vi': 'Lễ khánh thành Chánh điện và Kiết giới Sima',
                'slug': 'le-khanh-thanh-chanh-dien-2025',
                'featured_image_url': 'https://phatsuonline.com/wp-content/uploads/2024/02/1-4-10.jpg',
                'excerpt_vi': 'Học viện Phật giáo Nam tông Khmer Cần Thơ sẽ trọng thể tổ chức Lễ khánh thành ngôi Chánh điện và Kiết giới Sima vào ngày 15/02/2025.',
                'content_vi': '''
                <p>Sau gần 20 năm xây dựng và phát triển, Học viện Phật giáo Nam tông Khmer tại TP. Cần Thơ sẽ chính thức khánh thành ngôi Chánh điện và hoàn thiện toàn bộ công trình vào ngày 15/02/2025.</p>
                <p>Đây là công trình kiến trúc tâm linh lớn nhất của hệ phái Nam tông Khmer tại ĐBSCL, đánh dấu bước ngoặt lịch sử trong công tác giáo dục và đào tạo Tăng tài.</p>
                <p>Buổi lễ dự kiến sẽ có sự tham dự của chư Tôn đức lãnh đạo Giáo hội, đại diện Ban Tôn giáo Chính phủ và hàng ngàn Tăng Ni, Phật tử.</p>
                ''',
                'category': 'PHAT_SU',
                'is_featured': True,
                'published_at': timezone.now() - timezone.timedelta(days=2)
            },
            {
                'title_vi': 'Đại lễ Dâng y Kathina năm 2024 viên mãn',
                'slug': 'dai-le-dang-y-kathina-2024',
                'featured_image_url': 'https://vnanet.vn/Data/Articles/2023/11/04/7272223/upload_2825.jpg',
                'excerpt_vi': 'Đông đảo chư Tăng và Phật tử đã trang nghiêm cử hành Đại lễ Dâng y Kathina, thể hiện tấm lòng hộ trì Tam Bảo.',
                'content_vi': '<p>Sáng ngày 10/11/2024, trong không khí trang nghiêm và thắm tình đạo vị, Học viện đã tổ chức thành công Đại lễ Dâng y Kathina.</p>',
                'category': 'LE_HOI',
                'is_featured': True,
                'published_at': timezone.now() - timezone.timedelta(days=45)
            },
             {
                'title_vi': 'Học viện chuẩn bị đón Tết Chol Chnam Thmay',
                'slug': 'chuan-bi-tet-chol-chnam-thmay',
                'featured_image_url': 'https://media.vov.vn/sites/default/files/styles/large/public/2023-04/thot_1_0.jpg',
                'excerpt_vi': 'Không khí đón Tết cổ truyền Chol Chnam Thmay đang rộn ràng khắp khuôn viên Học viện với nhiều hoạt động ý nghĩa.',
                'content_vi': '<p>Các Tăng sinh đang tích cực dọn dẹp, trang trí khuôn viên để chuẩn bị đón Tết cổ truyền của đồng bào dân tộc Khmer.</p>',
                'category': 'VAN_HOA',
                'is_featured': False,
                'published_at': timezone.now() - timezone.timedelta(days=5)
            },
            {
                'title_vi': 'Bế giảng khóa thiền Vipassana năm 2024',
                'slug': 'be-giang-khoa-thien-vipassana',
                'featured_image_url': 'https://phatsuonline.com/wp-content/uploads/2024/08/z5696803730702_3b1b5c9284242637207455d38c6451e0-scaled.jpg',
                'excerpt_vi': 'Hơn 200 thiền sinh đã hoàn thành khóa thiền Vipassana 10 ngày với nhiều hỷ lạc và an nhiên.',
                'content_vi': '<p>Khóa thiền đã giúp các thiền sinh trải nghiệm những phút giây tĩnh lặng, quay về nương tựa chính mình.</p>',
                'category': 'KHOA_TU',
                'is_featured': False,
                'published_at': timezone.now() - timezone.timedelta(days=120)
            },
             {
                'title_vi': 'Hội thảo: Bảo tồn Ngôn ngữ Pali và Khmer',
                'slug': 'hoi-thao-ngon-ngu-pali-khmer',
                'featured_image_url': 'https://soctrang.dcs.vn/PublishingImages/2023/Thang12/TinHoatDong/hoithao1212.jpg',
                'excerpt_vi': 'Các học giả và chư Tăng đã thảo luận sôi nổi về các giải pháp bảo tồn ngôn ngữ Pali và chữ Khmer trong thời đại số.',
                'content_vi': '<p>Hội thảo nhấn mạnh tầm quan trọng của việc ứng dụng công nghệ thông tin trong giảng dạy và lưu trữ kinh sách.</p>',
                'category': 'GIAO_DUC',
                'is_featured': False,
                'published_at': timezone.now() - timezone.timedelta(days=10)
            }
        ]

        for n in news_list:
            News.objects.update_or_create(slug=n['slug'], defaults=n)
        
        self.stdout.write(f'- Seeded {len(news_list)} news articles')
