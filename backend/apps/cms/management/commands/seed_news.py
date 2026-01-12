# -*- coding: utf-8 -*-
"""
Management command to seed real news articles about HVPGNTK.
Based on actual events and research.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.cms.models import News
from datetime import timedelta
import uuid


class Command(BaseCommand):
    help = 'Seeds 10 real news articles about HVPGNTK'

    def handle(self, *args, **options):
        self.stdout.write('Seeding news articles...')

        # Delete existing news if you want a clean slate
        # News.objects.all().delete()

        base_url = '/images/news/'

        news_data = [
            # 1. Lễ Khánh Thành Chánh Điện - Sự kiện trọng đại 2025
            {
                'slug': 'le-khanh-thanh-chanh-dien-2025',
                'title_vi': 'Lễ Khánh Thành Chánh Điện và Kiết Giới Sima tại Học viện Phật giáo Nam tông Khmer',
                'excerpt_vi': 'Ngày 15/2/2025, Học viện Phật giáo Nam tông Khmer tổ chức trọng thể Lễ Khánh thành Chánh điện - công trình 20 năm xây dựng, đánh dấu bước ngoặt quan trọng trong sự nghiệp đào tạo Tăng tài.',
                'content_vi': '''
<h2>Sự kiện trọng đại của Phật giáo Nam tông Khmer</h2>

<p>Sáng ngày 15 tháng 2 năm 2025, tại Học viện Phật giáo Nam tông Khmer (phường Châu Văn Liêm, quận Ô Môn, TP. Cần Thơ), đã diễn ra trọng thể Lễ Khánh thành Chánh điện và Kiết giới Sima - một sự kiện lịch sử đánh dấu sự hoàn thiện các hạng mục chính của Học viện sau hành trình 20 năm xây dựng.</p>

<p>Công trình Chánh điện được khởi công xây dựng từ tháng 5 năm 2020, với kiến trúc truyền thống Phật giáo Nam tông Khmer, thể hiện sự hài hòa giữa tín ngưỡng và thẩm mỹ dân tộc. Đây là nơi trang nghiêm để chư Tăng hành lễ, tụng kinh và các Phật tử chiêm bái, lễ Phật.</p>

<h3>Ý nghĩa của Lễ Kiết giới Sima</h3>

<p>Lễ Kiết giới Sima (Sīmā-sammuti) là nghi thức quan trọng bậc nhất trong Phật giáo Theravada, xác lập ranh giới thiêng liêng của Chánh điện - nơi chư Tăng thực hiện các nghi lễ Tăng sự như thọ giới Tỳ kheo, Bố tát, An cư kiết hạ. Sau khi kiết giới, Chánh điện chính thức trở thành nơi trụ xứ của Tăng đoàn theo đúng Luật tạng.</p>

<p>Tham dự buổi lễ có Chư tôn đức Hội đồng Chứng minh, Hội đồng Trị sự Giáo hội Phật giáo Việt Nam, đại diện các cấp chính quyền Thành phố Cần Thơ, cùng hàng ngàn Phật tử từ các tỉnh thành Nam Bộ về tham dự.</p>

<blockquote>"Đây là niềm vui lớn của đồng bào Phật tử Khmer. Chánh điện hoàn thành không chỉ là công trình kiến trúc mà còn là biểu tượng của sự đoàn kết, tinh thần hộ trì Tam Bảo của toàn thể Tăng Ni, Phật tử." - Trích lời Ban Giám hiệu Học viện.</blockquote>
                ''',
                'featured_image_url': f'{base_url}buddhist_ceremony.png',
                'category': 'academy_news',
                'is_pinned': True,
                'is_featured': True,
                'view_count': 1250,
                'published_at': timezone.now() - timedelta(days=2),
            },
            # 2. Khóa Thiền Vipassana
            {
                'slug': 'tong-ket-khoa-thien-vipassana-2024',
                'title_vi': 'Tổng Kết Khóa Thiền Vipassana: Hơn 200 Thiền Sinh Hoàn Thành Chương Trình',
                'excerpt_vi': 'Ngày 3/8/2024, Học viện đã tổ chức lễ tổng kết khóa thiền Vipassana với sự tham gia của hơn 200 thiền sinh và Phật tử, đánh dấu thành công của chương trình tu học mùa hè.',
                'content_vi': '''
<h2>Khóa Thiền Vipassana - Trở về với hiện tại</h2>

<p>Vào ngày 3 tháng 8 năm 2024, Học viện Phật giáo Nam tông Khmer đã long trọng tổ chức lễ tổng kết khóa thiền Vipassana mùa hè, với sự tham gia của hơn 200 thiền sinh và Phật tử từ khắp các tỉnh miền Tây Nam Bộ.</p>

<h3>Vipassana - Con đường tuệ giác</h3>

<p>Thiền Vipassana (Thiền Minh Sát) là phương pháp thiền cổ truyền của Phật giáo Theravada, được Đức Phật truyền dạy cách đây hơn 2.500 năm. Phương pháp này nhấn mạnh sự quan sát thân, tâm một cách khách quan, từ đó thấy rõ bản chất vô thường, khổ và vô ngã của các pháp.</p>

<p>Khóa thiền kéo dài 10 ngày, trong đó các thiền sinh thực hành theo thời khóa nghiêm ngặt:</p>
<ul>
<li>4:00 - Thức dậy, vệ sinh cá nhân</li>
<li>4:30 - 6:30 - Thiền tọa buổi sáng</li>
<li>6:30 - 8:00 - Điểm tâm và nghỉ ngơi</li>
<li>8:00 - 11:00 - Thiền tọa và thiền hành xen kẽ</li>
<li>11:00 - 13:00 - Thọ trai và nghỉ trưa</li>
<li>13:00 - 17:00 - Thiền tọa buổi chiều</li>
<li>17:00 - 18:00 - Giải lao</li>
<li>18:00 - 21:00 - Pháp thoại và thiền tọa tối</li>
</ul>

<p>Kết thúc khóa thiền, nhiều thiền sinh chia sẻ những trải nghiệm sâu sắc về sự an lạc, tĩnh tâm và cái nhìn mới về cuộc sống.</p>
                ''',
                'featured_image_url': f'{base_url}vipassana_meditation.png',
                'category': 'academy_news',
                'is_pinned': False,
                'is_featured': True,
                'view_count': 890,
                'published_at': timezone.now() - timedelta(days=160),
            },
            # 3. Lễ Chol Chnam Thmay 2024
            {
                'slug': 'mung-tet-chol-chnam-thmay-2024',
                'title_vi': 'Rộn Ràng Không Khí Đón Tết Chol Chnam Thmay 2024 tại Học Viện',
                'excerpt_vi': 'Từ ngày 13-16/4/2024, Học viện Phật giáo Nam tông Khmer tổ chức các hoạt động mừng Tết cổ truyền Chol Chnam Thmay với nhiều nghi lễ truyền thống đặc sắc.',
                'content_vi': '''
<h2>Tết Chol Chnam Thmay - Nét đẹp văn hóa Khmer</h2>

<p>Chol Chnam Thmay (ចូលឆ្នាំថ្មី) - Tết mừng năm mới theo lịch cổ truyền của đồng bào Khmer - được xem là lễ hội lớn nhất trong năm. Năm 2024, Tết Chol Chnam Thmay diễn ra từ ngày 13 đến 16 tháng 4 dương lịch.</p>

<h3>Các nghi lễ truyền thống</h3>

<p><strong>Ngày thứ nhất - Moha Songkran (Đại hội):</strong> Đồng bào Khmer mặc trang phục truyền thống, mang lễ vật đến chùa làm lễ rước Đại Lịch. Đoàn người đi quanh chánh điện 3 vòng, vừa đi vừa tụng kinh lễ bái Tam Bảo.</p>

<p><strong>Ngày thứ hai - Wananabat (Tập trung):</strong> Phật tử chuẩn bị cơm canh dâng lên chư Tăng, làm lễ đắp núi cát tại chùa để cầu phước.</p>

<p><strong>Ngày thứ ba - Leung Saka (Khởi đầu năm mới):</strong> Nghi thức tắm tượng Phật, rước nước thơm tắm cho các vị sư trụ trì và lãnh đạo cộng đồng để tỏ lòng tôn kính.</p>

<h3>Hoạt động tại Học viện</h3>

<p>Tại Học viện, các Tăng sinh đã chuẩn bị chu đáo cho dịp lễ với việc trang hoàng khuôn viên, chuẩn bị các món ăn truyền thống như bánh tét, bánh gừng, bánh ít. Đặc biệt, các hoạt động văn hóa như hát Aday, múa Lâm thôn đã thu hút đông đảo Phật tử về tham dự.</p>
                ''',
                'featured_image_url': f'{base_url}khmer_new_year.png',
                'category': 'khmer_festival',
                'is_pinned': False,
                'is_featured': True,
                'view_count': 1520,
                'published_at': timezone.now() - timedelta(days=275),
            },
            # 4. Lễ Ok Om Bok 2024
            {
                'slug': 'le-ok-om-bok-cung-trang-2024',
                'title_vi': 'Lung Linh Đêm Hội Ok Om Bok - Lễ Cúng Trăng Của Đồng Bào Khmer',
                'excerpt_vi': 'Lễ hội Ok Om Bok 2024 được tổ chức vào ngày rằm tháng 10 âm lịch với nghi thức cúng trăng linh thiêng, đua ghe Ngo và nhiều hoạt động văn hóa đặc sắc.',
                'content_vi': '''
<h2>Ok Om Bok - Di sản văn hóa phi vật thể Quốc gia</h2>

<p>Lễ hội Ok Om Bok (​បុណ្យអកអំបុក) hay còn gọi là "Lễ Cúng Trăng" là một trong ba lễ hội lớn nhất trong năm của đồng bào Khmer Nam Bộ, bên cạnh Chol Chnam Thmay và Sene Dolta. Năm 2024, lễ hội diễn ra trong các ngày 9-15 tháng 11.</p>

<h3>Nguồn gốc và ý nghĩa</h3>

<p>Theo truyền thuyết, Mặt Trăng là vị thần bảo vệ mùa màng, điều hòa thời tiết và mang lại sự no ấm cho con người. Lễ Ok Om Bok là dịp để đồng bào Khmer bày tỏ lòng biết ơn Mặt Trăng sau một năm canh tác bội thu.</p>

<h3>Các nghi thức đặc sắc</h3>

<p><strong>Nghi thức "Đút cốm dẹp":</strong> Khi trăng lên cao, người lớn tuổi trong gia đình lấy cốm dẹp đút vào miệng từng đứa trẻ, rồi hỏi những điều ước nguyện. Trẻ con tin rằng những lời cầu nguyện sẽ được Mặt Trăng chứng giám và ban phước.</p>

<p><strong>Đua ghe Ngo:</strong> Đây là hoạt động hấp dẫn nhất, với những chiếc ghe Ngo dài 20-30m, được chạm khắc tinh xảo, chở 40-60 tay chèo đua tài trên sông. Tiếng trống, tiếng hò reo vang dội tạo nên không khí lễ hội náo nhiệt.</p>

<p><strong>Thả đèn gió, đèn nước:</strong> Khi màn đêm buông xuống, hàng trăm chiếc đèn gió bay lên trời, đèn nước trôi theo dòng sông, tạo nên khung cảnh lung linh huyền ảo.</p>

<p>Lễ hội Ok Om Bok đã được Bộ Văn hóa, Thể thao và Du lịch công nhận là Di sản văn hóa phi vật thể Quốc gia, khẳng định giá trị văn hóa đặc sắc của đồng bào Khmer.</p>
                ''',
                'featured_image_url': f'{base_url}ok_om_bok.png',
                'category': 'khmer_festival',
                'is_pinned': False,
                'is_featured': False,
                'view_count': 1830,
                'published_at': timezone.now() - timedelta(days=60),
            },
            # 5. Trao Học Bổng Đức Nhuận
            {
                'slug': 'trao-hoc-bong-duc-nhuan-2024',
                'title_vi': 'Chư Tôn Đức Hội Đồng Chứng Minh Trao Học Bổng Đức Nhuận Cho Tăng Sinh',
                'excerpt_vi': 'Ngày 13-14/7/2024, Chư vị Trưởng lão Hội đồng Chứng minh GHPGVN đã đến thăm Học viện và trao học bổng Đức Nhuận cho các Tăng sinh xuất sắc.',
                'content_vi': '''
<h2>Học bổng Đức Nhuận - Khuyến khích Tăng tài</h2>

<p>Trong hai ngày 13-14 tháng 7 năm 2024, Học viện Phật giáo Nam tông Khmer vinh dự được đón tiếp Chư vị Trưởng lão Hội đồng Chứng minh Giáo hội Phật giáo Việt Nam đến thăm và trao học bổng Đức Nhuận cho các Tăng sinh có thành tích học tập xuất sắc.</p>

<h3>Về Học bổng Đức Nhuận</h3>

<p>Học bổng Đức Nhuận được thành lập nhằm tôn vinh và khuyến khích các Tăng Ni sinh có thành tích học tập, tu tập tinh tấn tại các Học viện Phật giáo trên cả nước. Học bổng mang tên Hòa thượng Thích Đức Nhuận - vị cao Tăng có nhiều đóng góp trong công tác giáo dục Phật giáo.</p>

<p>Trong đợt trao học bổng này, 15 Tăng sinh của Học viện đã được vinh danh và trao học bổng với tổng giá trị 75 triệu đồng. Đây không chỉ là phần thưởng vật chất mà còn là sự động viên tinh thần to lớn đối với các Tăng sinh trên con đường tu học.</p>

<h3>Lời dạy của Chư Tôn Đức</h3>

<blockquote>"Các Tăng sinh hãy lấy Giới - Định - Tuệ làm nền tảng, chuyên cần học tập kinh điển Pali, giữ gìn và phát huy bản sắc văn hóa Phật giáo Nam tông Khmer. Mai sau có đủ tài đức, các con sẽ là những vị Tăng tài hoằng pháp lợi sinh, phụng sự đạo pháp và dân tộc."</blockquote>
                ''',
                'featured_image_url': f'{base_url}scholarship.png',
                'category': 'academy_news',
                'is_pinned': False,
                'is_featured': False,
                'view_count': 670,
                'published_at': timezone.now() - timedelta(days=180),
            },
            # 6. Lễ Sene Dolta
            {
                'slug': 'le-sene-dolta-bao-hieu-2024',
                'title_vi': 'Lễ Sene Dolta - Mùa Báo Hiếu Của Đồng Bào Khmer',
                'excerpt_vi': 'Lễ Sene Dolta là dịp để người Khmer tưởng nhớ công ơn tổ tiên, ông bà, cha mẹ. Năm 2024, Học viện tổ chức lễ với nhiều nghi thức truyền thống trang nghiêm.',
                'content_vi': '''
<h2>Sene Dolta - Vu Lan của đồng bào Khmer</h2>

<p>Sene Dolta (​បុណ្យភ្ជុំបិណ្ឌ) là lễ hội lớn thứ hai trong năm của đồng bào Khmer, tương tự lễ Vu Lan của người Kinh, diễn ra vào các ngày cuối tháng 8 đến đầu tháng 9 âm lịch. Đây là dịp để con cháu bày tỏ lòng hiếu kính với ông bà, cha mẹ, tổ tiên đã khuất.</p>

<h3>Ý nghĩa tâm linh</h3>

<p>Theo quan niệm Phật giáo Nam tông, trong 15 ngày của lễ Sene Dolta, linh hồn những người đã khuất được phép trở về thăm con cháu. Vì vậy, các gia đình chuẩn bị cơm canh, bánh trái dâng cúng tại chùa để hồi hướng công đức cho họ.</p>

<h3>Các nghi thức chính</h3>

<ul>
<li><strong>Ngày đầu tiên - Đưa tiếp nguồn:</strong> Phật tử đem cơm, bánh đến chùa dâng cúng, mời vong linh tổ tiên về thọ hưởng.</li>
<li><strong>Trong 15 ngày:</strong> Mỗi ngày, Phật tử luân phiên đến chùa dâng cơm cho chư Tăng, cầu nguyện cho ông bà, cha mẹ.</li>
<li><strong>Ngày cuối cùng - Tiễn đưa:</strong> Lễ cúng tiễn đưa vong linh về cõi an lành, kết thúc mùa báo hiếu.</li>
</ul>

<p>Tại Học viện, lễ Sene Dolta năm 2024 đã thu hút hàng ngàn Phật tử từ các tỉnh Cần Thơ, An Giang, Sóc Trăng, Kiên Giang... về tham dự. Không khí trang nghiêm, thiêng liêng lan tỏa khắp khuôn viên Học viện.</p>
                ''',
                'featured_image_url': f'{base_url}sene_dolta.png',
                'category': 'khmer_festival',
                'is_pinned': False,
                'is_featured': False,
                'view_count': 1150,
                'published_at': timezone.now() - timedelta(days=130),
            },
            # 7. Giới thiệu chương trình đào tạo
            {
                'slug': 'chuong-trinh-dao-tao-cu-nhan-phat-hoc-pali',
                'title_vi': 'Giới Thiệu Chương Trình Đào Tạo Cử Nhân Phật Học Pali - Khmer',
                'excerpt_vi': 'Học viện Phật giáo Nam tông Khmer là nơi duy nhất tại Việt Nam đào tạo Cử nhân Phật học chuyên ngành Pali - Khmer, với chương trình 4 năm bài bản.',
                'content_vi': '''
<h2>Đào tạo Tăng tài - Sứ mệnh thiêng liêng</h2>

<p>Học viện Phật giáo Nam tông Khmer được thành lập năm 2006, là cơ sở giáo dục đại học Phật giáo duy nhất tại Việt Nam chuyên đào tạo Cử nhân Phật học Pali - Khmer cho sư sãi Phật giáo Nam tông Khmer tại các tỉnh Nam Bộ.</p>

<h3>Chương trình đào tạo 4 năm</h3>

<p>Chương trình đào tạo được thiết kế khoa học, kết hợp giữa kiến thức Phật học truyền thống và kiến thức xã hội hiện đại:</p>

<h4>Năm thứ nhất - Nền tảng</h4>
<ul>
<li>Ngữ pháp Pali cơ bản</li>
<li>Chữ Khmer và văn học Khmer</li>
<li>Lịch sử Phật giáo Ấn Độ</li>
<li>Giới luật Tỳ kheo (Vinaya)</li>
</ul>

<h4>Năm thứ hai - Phát triển</h4>
<ul>
<li>Ngữ pháp Pali nâng cao</li>
<li>Kinh tạng Pali (Sutta Pitaka)</li>
<li>Lịch sử Phật giáo Đông Nam Á</li>
<li>Triết học Phật giáo</li>
</ul>

<h4>Năm thứ ba - Chuyên sâu</h4>
<ul>
<li>Luận tạng (Abhidhamma)</li>
<li>Chú giải kinh điển Pali</li>
<li>Nghi lễ Phật giáo Nam tông</li>
<li>Phương pháp thuyết giảng</li>
</ul>

<h4>Năm thứ tư - Hoàn thiện</h4>
<ul>
<li>Luận văn tốt nghiệp</li>
<li>Thực tập hoằng pháp</li>
<li>Nghiên cứu chuyên đề</li>
</ul>

<p>Sau khi tốt nghiệp, các Tăng sinh được cấp bằng Cử nhân Phật học, có đủ năng lực trụ trì các chùa Khmer và tham gia công tác Giáo hội.</p>
                ''',
                'featured_image_url': f'{base_url}monks_studying.png',
                'category': 'academy_news',
                'is_pinned': False,
                'is_featured': False,
                'view_count': 2340,
                'published_at': timezone.now() - timedelta(days=90),
            },
            # 8. Kiến trúc chùa Khmer
            {
                'slug': 'kien-truc-chua-khmer-ban-sac-doc-dao',
                'title_vi': 'Kiến Trúc Chùa Khmer - Nét Đẹp Bản Sắc Văn Hóa Đặc Đáo',
                'excerpt_vi': 'Tìm hiểu về kiến trúc độc đáo của chùa Phật giáo Nam tông Khmer với những ngôi tháp vàng rực rỡ, hoa văn tinh xảo mang đậm bản sắc văn hóa Khmer.',
                'content_vi': '''
<h2>Chùa Khmer - Tác phẩm nghệ thuật kiến trúc</h2>

<p>Chùa Phật giáo Nam tông Khmer (còn gọi là chùa Khmer hoặc chùa Miên) là những công trình kiến trúc độc đáo, mang đậm bản sắc văn hóa của đồng bào Khmer Nam Bộ. Với hơn 450 ngôi chùa trải dài từ Cần Thơ đến Cà Mau, đây là hệ thống di sản văn hóa quý giá của dân tộc.</p>

<h3>Đặc điểm kiến trúc</h3>

<p><strong>Chánh điện (Sala):</strong> Là công trình chính của ngôi chùa, nơi thờ Phật và diễn ra các nghi lễ quan trọng. Chánh điện thường có mái nhọn nhiều tầng, lợp ngói màu vàng hoặc đỏ, trang trí những hình tượng rắn Naga, tiên nữ Apsara.</p>

<p><strong>Tháp nhọn (Prang/Stupa):</strong> Các tháp vàng rực rỡ là điểm nhấn của chùa Khmer, tượng trưng cho núi Meru - trung tâm vũ trụ trong vũ trụ quan Phật giáo.</p>

<p><strong>Hoa văn điêu khắc:</strong> Chùa Khmer nổi tiếng với những hoa văn điêu khắc tinh xảo trên gỗ, đá và thạch cao. Các họa tiết phổ biến gồm hoa sen, rắn thần Naga, voi, chim thiêng Garuda...</p>

<h3>Màu sắc đặc trưng</h3>

<p>Màu vàng và màu đỏ nâu là hai màu chủ đạo của chùa Khmer:</p>
<ul>
<li><strong>Màu vàng:</strong> Tượng trưng cho sự giác ngộ, ánh sáng của Phật pháp.</li>
<li><strong>Màu đỏ nâu:</strong> Màu y phục của nhà sư Theravada, biểu tượng của sự khiêm nhường và từ bỏ.</li>
</ul>

<p>Học viện Phật giáo Nam tông Khmer được xây dựng theo phong cách kiến trúc truyền thống này, vừa là nơi tu học vừa là công trình nghệ thuật giá trị.</p>
                ''',
                'featured_image_url': f'{base_url}temple_architecture.png',
                'category': 'buddhist_news',
                'is_pinned': False,
                'is_featured': False,
                'view_count': 980,
                'published_at': timezone.now() - timedelta(days=45),
            },
            # 9. Hoạt động cộng đồng
            {
                'slug': 'hoc-vien-xay-duong-noi-bo-chung-tay-cong-dong',
                'title_vi': 'Quân Dân Chung Tay Xây Dựng Đường Nội Bộ Tại Học Viện',
                'excerpt_vi': 'Trong khuôn khổ hoạt động mừng Chôl Chnăm Thmây 2024, các cán bộ, chiến sĩ quân đội và dân quân đã hỗ trợ Học viện xây dựng và nâng cấp hệ thống đường nội bộ.',
                'content_vi': '''
<h2>Tình quân dân - Sức mạnh đoàn kết</h2>

<p>Ngày 11 tháng 4 năm 2024, trong khuôn khổ các hoạt động chào mừng Tết Chol Chnam Thmay, đoàn cán bộ, chiến sĩ Bộ Chỉ huy Quân sự TP. Cần Thơ cùng lực lượng dân quân quận Ô Môn đã đến Học viện Phật giáo Nam tông Khmer để hỗ trợ xây dựng đường nội bộ và vệ sinh khuôn viên.</p>

<h3>Hoạt động ý nghĩa</h3>

<p>Với tinh thần "Quân với dân như cá với nước", hơn 100 cán bộ, chiến sĩ đã làm việc từ sáng sớm, tham gia các công việc:</p>
<ul>
<li>San lấp mặt bằng, đổ bê tông đường nội bộ dài 200m</li>
<li>Vệ sinh, dọn dẹp khuôn viên và khu vực xung quanh</li>
<li>Trồng cây xanh, tạo cảnh quan môi trường</li>
<li>Sửa chữa một số hạng mục hư hỏng</li>
</ul>

<h3>Chia sẻ từ Ban Giám hiệu</h3>

<blockquote>"Chúng tôi rất cảm kích trước tình cảm và sự hỗ trợ của các cán bộ, chiến sĩ. Đây không chỉ là công trình vật chất mà còn là biểu tượng của tình đoàn kết quân dân, sự quan tâm của Đảng và Nhà nước đối với đồng bào Khmer." - TT.TS. Thạch Phú Ma Ra, Phó Viện trưởng.</blockquote>

<p>Hoạt động này nằm trong chuỗi các chương trình "Quân đội chung tay vì người Khmer" do Bộ Chỉ huy Quân sự TP. Cần Thơ tổ chức hàng năm, góp phần củng cố khối đại đoàn kết toàn dân tộc.</p>
                ''',
                'featured_image_url': f'{base_url}community_service.png',
                'category': 'buddhist_news',
                'is_pinned': False,
                'is_featured': False,
                'view_count': 560,
                'published_at': timezone.now() - timedelta(days=276),
            },
            # 10. Thông báo tuyển sinh
            {
                'slug': 'thong-bao-tuyen-sinh-khoa-xviii-2025',
                'title_vi': 'Thông Báo Tuyển Sinh Khóa XVIII Năm 2025 - Cử Nhân Phật Học Pali - Khmer',
                'excerpt_vi': 'Học viện Phật giáo Nam tông Khmer thông báo tuyển sinh khóa XVIII (2025-2029) với chỉ tiêu 50 Tăng sinh từ các tỉnh Nam Bộ.',
                'content_vi': '''
<h2>Thông Báo Tuyển Sinh Khóa XVIII</h2>

<p>Học viện Phật giáo Nam tông Khmer trân trọng thông báo đến các chùa, Tăng Ni sinh trong vùng về việc tuyển sinh Cử nhân Phật học Pali - Khmer khóa XVIII (2025-2029).</p>

<h3>Thông tin tuyển sinh</h3>

<p><strong>Chỉ tiêu:</strong> 50 Tăng sinh</p>
<p><strong>Thời gian đào tạo:</strong> 4 năm (2025-2029)</p>
<p><strong>Hình thức:</strong> Nội trú tại Học viện</p>

<h3>Điều kiện dự tuyển</h3>

<ol>
<li>Là Tỳ kheo hoặc Sa-di đã thọ giới ít nhất 1 năm</li>
<li>Tuổi từ 18 đến 40</li>
<li>Tốt nghiệp Trung học Phổ thông hoặc tương đương</li>
<li>Có bằng Trung cấp Phật học (hoặc tương đương)</li>
<li>Đạo hạnh tốt, được Trụ trì và chính quyền địa phương xác nhận</li>
<li>Sức khỏe đảm bảo cho việc tu học</li>
</ol>

<p><em>Lưu ý: Tăng sinh người dân tộc Khmer ở vùng sâu, vùng xa được ưu tiên xét tuyển.</em></p>

<h3>Hồ sơ dự tuyển</h3>

<ul>
<li>Đơn xin nhập học (theo mẫu)</li>
<li>Bằng tốt nghiệp THPT và Trung cấp Phật học (bản sao công chứng)</li>
<li>Giấy xác nhận của Trụ trì và UBND xã/phường</li>
<li>Giấy khám sức khỏe</li>
<li>02 ảnh 3x4</li>
<li>Sơ yếu lý lịch có xác nhận</li>
</ul>

<h3>Thời gian nộp hồ sơ</h3>

<p><strong>Từ ngày 01/03/2025 đến 30/06/2025</strong></p>

<h3>Địa chỉ nộp hồ sơ</h3>

<p>Phòng Đào tạo - Học viện Phật giáo Nam tông Khmer<br>
Địa chỉ: Khu vực 12, Phường Châu Văn Liêm, Quận Ô Môn, TP. Cần Thơ<br>
Điện thoại: 0292 738 925</p>

<p><em>Mọi chi tiết xin liên hệ Phòng Đào tạo trong giờ hành chính.</em></p>
                ''',
                'featured_image_url': f'{base_url}graduation.png',
                'category': 'announcement',
                'is_pinned': True,
                'is_featured': True,
                'is_announcement': True,
                'view_count': 3450,
                'published_at': timezone.now() - timedelta(days=5),
            },
        ]

        created_count = 0
        for data in news_data:
            # Check if slug already exists
            if not News.objects.filter(slug=data['slug']).exists():
                News.objects.create(
                    id=uuid.uuid4(),
                    status='published',
                    **data
                )
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created: {data['title_vi'][:50]}..."))
            else:
                self.stdout.write(self.style.WARNING(f"Skipped (exists): {data['slug']}"))

        self.stdout.write(self.style.SUCCESS(f'\n✅ Successfully seeded {created_count} news articles!'))
