import django
import os
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.cms.models import Page

def seed_pages():
    pages_data = [
        {
            "title_vi": "Lịch sử hình thành",
            "slug": "lich-su",
            "page_type": "ABOUT",
            "menu_order": 2,
            "status": "PUBLISHED",
            "content_vi": """
            <div class="space-y-6">
                <div class="border-l-4 border-amber-300 pl-6">
                    <h3 class="text-xl font-bold text-primary">1995 - Thành lập Ban Vận động</h3>
                    <p>Thành lập Ban Vận động thành lập Học viện, đặt nền móng đầu tiên cho sự phát triển sau này.</p>
                </div>
                <div class="border-l-4 border-amber-300 pl-6">
                    <h3 class="text-xl font-bold text-primary">2005 - Khởi công xây dựng</h3>
                    <p>Khởi công xây dựng cơ sở chính tại Cần Thơ với quy mô lớn, đáp ứng nhu cầu tu học của Tăng Ni sinh.</p>
                </div>
                <div class="border-l-4 border-amber-300 pl-6">
                    <h3 class="text-xl font-bold text-primary">2010 - Khánh thành giai đoạn 1</h3>
                    <p>Khánh thành giai đoạn 1 và chính thức khai giảng Khóa I cử nhân Phật học Nam tông Khmer.</p>
                </div>
                <div class="border-l-4 border-amber-300 pl-6">
                    <h3 class="text-xl font-bold text-primary">2020 - Hoàn thiện và Phát triển</h3>
                    <p>Hoàn thiện cơ sở vật chất, mở rộng hợp tác quốc tế, nâng cao chất lượng đào tạo.</p>
                </div>
            </div>
            """
        },
        {
            "title_vi": "Sứ mệnh và Tầm nhìn",
            "slug": "su-menh",
            "page_type": "ABOUT",
            "menu_order": 3,
            "status": "PUBLISHED",
            "content_vi": """
            <h3 class="text-2xl font-serif font-bold text-secondary mb-4">Sứ Mệnh</h3>
            <p class="mb-6">Đào tạo Tăng Ni sinh và Cư sĩ có kiến thức sâu sắc về Phật học, đặc biệt là Phật giáo Nam tông Khmer, đồng thời trang bị kiến thức thế học cần thiết để phụng sự Đạo pháp và Dân tộc.</p>
            
            <h3 class="text-2xl font-serif font-bold text-secondary mb-4">Tầm Nhìn</h3>
            <p>Trở thành trung tâm giáo dục, nghiên cứu và văn hóa Phật giáo Nam tông hàng đầu tại khu vực Đồng bằng sông Cửu Long và cả nước.</p>
            """
        },
        {
            "title_vi": "Cơ cấu Tổ chức",
            "slug": "co-cau",
            "page_type": "ABOUT",
            "menu_order": 4,
            "status": "PUBLISHED",
            "content_vi": """
            <h3 class="text-2xl font-serif font-bold text-secondary mb-4">Hội đồng Điều hành</h3>
            <p class="mb-4">Học viện được điều hành bởi Hội đồng Điều hành gồm các vị Hòa thượng, Thượng tọa, Đại đức có uy tín và năng lực.</p>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Viện trưởng:</strong> Hòa thượng Đào Như</li>
                <li><strong>Phó Viện trưởng Thường trực:</strong> Thượng tọa Trần Sone</li>
                <li><strong>Các Phó Viện trưởng chuyên trách:</strong> Đào tạo, Hành chính, Nghiên cứu...</li>
            </ul>
            
            <h3 class="text-2xl font-serif font-bold text-secondary mb-4">Các Phòng Ban</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Phòng Đào tạo</li>
                <li>Phòng Hành chính - Tổng hợp</li>
                <li>Phòng Công tác Sinh viên</li>
                <li>Ban Thư viện</li>
            </ul>
            """
        }
    ]

    for p in pages_data:
        Page.objects.update_or_create(
            slug=p['slug'],
            defaults=p
        )
        print(f"Seeded Page: {p['title_vi']}")

if __name__ == '__main__':
    seed_pages()
