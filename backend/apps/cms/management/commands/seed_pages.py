from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.cms.models import Page


class Command(BaseCommand):
    help = 'Seed Pages (About, Mission, Curriculum) with bilingual content (VN + KM)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🌱 Seeding Pages (Bilingual)...'))
        
        pages_data = [
            {
                'title_vi': 'Giới thiệu Học viện',
                'title_km': 'សេចក្តីផ្តើមគ្រឹះស្ថានសិក្សា',
                'slug': 'gioi-thieu',
                'page_type': 'about',
                'content_vi': '''
<h2>Học viện Phật giáo Nam Tông Khmer Cần Thơ</h2>

<h3>Lịch sử hình thành</h3>
<p>Học viện Phật giáo Nam tông Khmer Cần Thơ được thành lập theo Quyết định số 171/QĐ/TGCP ngày 14 tháng 9 năm 2006 của Ban Tôn giáo Chính phủ.</p>

<p>Ngày 16 tháng 10 năm 2006, UBND thành phố Cần Thơ ban hành Quyết định số 4077/UBND-XDCB, phê duyệt việc cấp 6,7 hecta đất xây dựng Học viện tại Khu vực 12, phường Châu Văn Liêm, quận Ô Môn.</p>

<p>Sau gần 20 năm xây dựng, ngôi Chánh điện đã được khánh thành vào ngày 15 tháng 2 năm 2025, đánh dấu hoàn thiện công trình Học viện.</p>

<h3>Sứ mệnh</h3>
<p>Học viện là cơ sở giáo dục đại học và nghiên cứu khoa học Phật giáo duy nhất tại Việt Nam đào tạo trình độ Cử nhân Phật học Pali-Khmer cho tăng ni sinh Phật giáo Nam tông Khmer tại các tỉnh thành Nam Bộ.</p>

<h3>Phạm vi hoạt động</h3>
<p>Phục vụ đào tạo tăng ni sinh Khmer tại 8 tỉnh: Cần Thơ, Sóc Trăng, Trà Vinh, Bạc Liêu, Cà Mau, Hậu Giang, Kiên Giang và các tỉnh lân cận.</p>
                ''',
                'content_km': '''
<h2>សាលាព្រះពុទ្ធសាសនាតេរវាទខ្មែរ កន្ទោ</h2>

<h3>ប្រវត្តិនៃការបង្កើត</h3>
<p>សាលាព្រះពុទ្ធសាសនាតេរវាទខ្មែរ កន្ទោ ត្រូវបានបង្កើតឡើងតាមសេចក្តីសម្រេចលេខ ១៧១/QĐ/TGCP ថ្ងៃទី១៤ ខែកញ្ញា ឆ្នាំ២០០៦ របស់គណៈកម្មាធិការសាសនានៃរដ្ឋាភិបាល។</p>

<p>ថ្ងៃទី១៦ ខែតុលា ឆ្នាំ២០០៦ គណៈកម្មាធិការប្រជាជនទីក្រុងកន្ទោ បានចេញសេចក្តីសម្រេចលេខ ៤០៧៧/UBND-XDCB អនុម័តការផ្តល់ដី ៦,៧ ហិកតា សម្រាប់សាងសាលាសិក្សានៅតំបន់១២ រង្វង់ Châu Văn Liêm ស្រុក Ô Môn។</p>

<p>បន្ទាប់ពីការសាងសង់ជិត២០ឆ្នាំ សាលាធំបានធ្វើពិធីបើកនៅថ្ងៃទី១៥ ខែកុម្ភៈ ឆ្នាំ២០២៥ សម្គាល់នូវការបញ្ចប់នៃគម្រោងសាលាសិក្សា។</p>

<h3>បេសកកម្ម</h3>
<p>សាលាសិក្សានេះគឺជាមូលដ្ឋានអប់រំឧត្តមសិក្សានិងស្រាវជ្រាវអំពីព្រះពុទ្ធសាសនាតែមួយគត់នៅវៀតណាម ដែលបណ្តុះបណ្តាលថ្នាក់បរិញ្ញាបត្រព្រះពុទ្ធសាសនា Pali-Khmer សម្រាប់ព្រះសង្ឃនិងព្រះសង្ឃស្រីព្រះពុទ្ធសាសនាតេរវាទខ្មែរនៅខេត្តភាគខាងត្បូង។</p>

<h3>វិសាលភាពសកម្មភាព</h3>
<p>បម្រើការបណ្តុះបណ្តាលព្រះសង្ឃខ្មែរនៅ៨ខេត្ត៖ កន្ទោ, សុខត្រង់, ត្រាវិញ, ប៉ាក់លៀវ, កាម៉ៅ, ហឺងគៀង, កៀនចង់ និងខេត្តជិតខាងផ្សេងទៀត។</p>
                ''',
                'status': 'published',
                'menu_order': 1,
                'published_at': timezone.now()
            },
            {
                'title_vi': 'Chương trình đào tạo',
                'title_km': 'កម្មវិធីបណ្តុះបណ្តាល',
                'slug': 'chuong-trinh-dao-tao',
                'page_type': 'curriculum',
                'content_vi': '''
<h2>Chương trình đào tạo Cử nhân Phật học Pali-Khmer</h2>

<h3>Thời gian đào tạo</h3>
<p>Chương trình kéo dài 4 năm, quy định thành 4 năm thực học.</p>

<h3>Cấu trúc chương trình</h3>
<ul>
    <li><strong>Ngôn ngữ Pali:</strong> 12 môn (Văn phạm, Cú pháp, Dịch thuật các cấp độ)</li>
    <li><strong>Ngôn ngữ khác:</strong> Thái ngữ, Sanskrit, Anh ngữ, Văn học Khmer</li>
    <li><strong>Phật học:</strong> Abhidhamma, Tổng phái Phật giáo, Lịch sử Phật giáo, Triết học Phật giáo</li>
    <li><strong>Thực hành:</strong> Thiền học 4 cấp độ</li>
    <li><strong>Kiến thức chung:</strong> Tư tưởng HCM, Đường lối ĐCSVN, Logic, Tôn giáo học, Tin học</li>
</ul>

<p>Học viện có hợp tác quốc tế với Viện Đại học Mahachulalongkornrajavidyalaya (Thái Lan) và liên kết với Đại học Cần Thơ.</p>
                ''',
                'content_km': '''
<h2>កម្មវិធីបណ្តុះបណ្តាលបរិញ្ញាបត្រព្រះពុទ្ធសាសនា Pali-Khmer</h2>

<h3>រយៈពេលបណ្តុះបណ្តាល</h3>
<p>កម្មវិធីមានរយៈពេល៤ឆ្នាំ កំណត់ជា៤ឆ្នាំសិក្សាជាក់ស្តែង។</p>

<h3>រចនាសម្ព័ន្ធកម្មវិធី</h3>
<ul>
    <li><strong>ភាសា Pali:</strong> ១២មុខវិជ្ជា (វេយ្យាករណ៍ បទសម្ព័ន្ធ ការបកប្រែថ្នាក់ផ្សេងៗ)</li>
    <li><strong>ភាសាផ្សេងទៀត:</strong> ភាសាថៃ សំស្ក្រឹត អង់គ្លេស អក្សរសាស្ត្រខ្មែរ</li>
    <li><strong>ព្រះពុទ្ធសាសនា:</strong> អភិធម្ម និកាយព្រះពុទ្ធសាសនា ប្រវត្តិសាស្ត្រព្រះពុទ្ធសាសនា ទស្សនវិជ្ជាព្រះពុទ្ធសាសនា</li>
    <li><strong>អនុវត្ត:</strong> សមថៈវិបស្សនា៤ថ្នាក់</li>
    <li><strong>ចំណេះដឹងទូទៅ:</strong> គំនិតហូ ជី មិញ ផ្លូវដំណើរគណបក្សសាធារណរដ្ឋវៀតណាម តក្កវិទ្យា សាសនាវិទ្យា전산</li>
</ul>

<p>សាលាសិក្សាមានកិច្ចសហការអន្តរជាតិជាមួយសាកលវិទ្យាល័យ Mahachulalongkornrajavidyalaya (ប្រទេសថៃ) និងផ្សារភ្ជាប់ជាមួយសាកលវិទ្យាល័យកន្ទោ។</p>
                ''',
                'status': 'published',
                'menu_order': 2,
                'published_at': timezone.now()
            },
            {
                'title_vi': 'Sứ mệnh & Tầm nhìn',
                'title_km': 'បេសកកម្ម និងចក្ខុវិស័យ',
                'slug': 'su-menh',
                'page_type': 'mission',
                'content_vi': '''
<h2>Sứ mệnh</h2>
<p>Học viện Phật giáo Nam tông Khmer là cơ sở giáo dục đại học, đào tạo Tăng sinh, Tu nữ và Phật tử Khmer trình độ Cử nhân Phật học, góp phần phát triển nguồn nhân lực có phẩm hạnh và trí tuệ cho Giáo hội và xã hội.</p>
<p>Học viện cam kết bảo tồn và phát huy bản sắc văn hóa dân tộc, ngôn ngữ Pali - Khmer và các giá trị đạo đức Phật giáo Nam tông truyền thống.</p>

<h2>Tầm nhìn</h2>
<p>Trở thành trung tâm đào tạo và nghiên cứu Phật học Nam tông Khmer hàng đầu tại Việt Nam và khu vực, kết nối với các nền giáo dục Phật giáo tiên tiến trên thế giới.</p>
<p>Xây dựng môi trường tu học trang nghiêm, hiện đại, nơi kết hợp hài hòa giữa tri thức Phật học và tri thức thế học.</p>

<h2>Giá trị cốt lõi</h2>
<ul>
    <li><strong>Trí tuệ (Paññā):</strong> Đề cao sự hiểu biết đúng đắn và tư duy phản biện.</li>
    <li><strong>Đạo đức (Sīla):</strong> Giữ gìn giới luật và phẩm hạnh người xuất gia.</li>
    <li><strong>Từ bi (Mettā):</strong> Phụng sự chúng sinh và xã hội với lòng từ bi.</li>
</ul>
                ''',
                'content_km': '''
<h2>បេសកកម្ម</h2>
<p>សាលាព្រះពុទ្ធសាសនាតេរវាទខ្មែរ គឺជាមូលដ្ឋានអប់រំឧត្តមសិក្សា បណ្តុះបណ្តាលព្រះសង្ឃ ព្រះសង្ឃស្រី និងពុទ្ធបរិស័ទខ្មែរថ្នាក់បរិញ្ញាបត្រព្រះពុទ្ធសាសនា ចូលរួមអភិវឌ្ឍធនធានមនុស្សដែលមានគុណធម៌និងប្រាជ្ញាសម្រាប់សហគមន៍និងសង្គម។</p>
<p>សាលាសិក្សាប្តេජ្ញាអនុរក្សនិងលើកតម្កើងអត្តសញ្ញាណវប្បធម៌ជាតិ ភាសា Pali-Khmer និងគុណតម្លៃសីលធម៌ព្រះពុទ្ធសាសនាតេរវាទបុរាណ។</p>

<h2>ចក្ខុវិស័យ</h2>
<p>ក្លាយជាមជ្ឈមណ្ឌលបណ្តុះបណ្តាលនិងស្រាវជ្រាវព្រះពុទ្ធសាសនាតេរវាទខ្មែរលំដាប់លេខមួយនៅវៀតណាមនិងតំបន់ ភ្ជាប់ទំនាក់ទំនងជាមួយប្រព័ន្ធអប់រំព្រះពុទ្ធសាសនាកម្រិតខ្ពស់នៅលើពិភពលោក។</p>
<p>សាងសង់បរិស្ថានអក្សរសិក្សាដ៏ថ្លៃថ្នូរនិងទំនើប កន្លែងរួមបញ្ចូលគ្នានូវចំណេះដឹងព្រះពុទ្ធសាសនានិងចំណេះដឹងលោកិយ។</p>

<h2>តម្លៃស្នូល</h2>
<ul>
    <li><strong>ប្រាជ្ញា (Paññā):</strong> លើកកម្ពស់ការយល់ដឹងត្រឹមត្រូវនិងការគិតរិះរក។</li>
    <li><strong>សីល (Sīla):</strong> រក្សាសីលនិងគុណធម៌របស់អ្នកបួស។</li>
    <li><strong>មេត្តា (Mettā):</strong> បំរើសត្វនិងសង្គមដោយសេចក្តីមេត្តា។</li>
</ul>
                ''',
                'status': 'published',
                'menu_order': 3,
                'published_at': timezone.now()
            },
        ]
        
        for page_data in pages_data:
            page, created = Page.objects.update_or_create(
                slug=page_data['slug'],
                defaults=page_data
            )
            status = '✅ Created' if created else '🔄 Updated'
            self.stdout.write(f'  {status}: {page_data["title_vi"]} / {page_data["title_km"]}')
        
        self.stdout.write(self.style.SUCCESS(f'✅ {len(pages_data)} pages seeded (Bilingual)!'))
