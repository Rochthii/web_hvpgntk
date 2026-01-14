# -*- coding: utf-8 -*-
"""
Management command to seed Departments and Staff Members for HVPGNTK.
Based on actual organizational structure research.
"""
from django.core.management.base import BaseCommand
from apps.cms.models import Department, StaffMember
import uuid


class Command(BaseCommand):
    help = 'Seeds Departments and Staff Members'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Departments and Staff Members...')

        # === DEPARTMENTS ===
        departments_data = [
            {
                'code': 'PALI',
                'name_vi': 'Khoa Ngôn ngữ Pali',
                'name_km': 'គណៈភាសាបាលី',
                'description_vi': 'Chuyên về giảng dạy ngôn ngữ Pali cổ điển, nền tảng của Kinh tạng Phật giáo Theravada.',
                'display_order': 1,
            },
            {
                'code': 'TRIPITAKA',
                'name_vi': 'Khoa Tam Tạng',
                'name_km': 'គណៈត្រៃបិដក',
                'description_vi': 'Nghiên cứu và giảng dạy Kinh tạng (Suttanta Pitaka), Luật tạng (Vinaya Pitaka), Luận tạng (Abhidhamma Pitaka).',
                'display_order': 2,
            },
            {
                'code': 'CULTURE',
                'name_vi': 'Khoa Lịch sử - Văn hóa Khmer',
                'name_km': 'គណៈប្រវត្តិសាស្រ្ត និងវប្បធម៌ខ្មែរ',
                'description_vi': 'Đào tạo về lịch sử Phật giáo, văn hóa dân tộc Khmer và các nghi lễ truyền thống.',
                'display_order': 3,
            },
            {
                'code': 'PRACTICE',
                'name_vi': 'Khoa Thiền định - Tu tập',
                'name_km': 'គណៈសមាធិ និងអនុវត្ត',
                'description_vi': 'Hướng dẫn thiền Vipassana, thực hành Giới - Định - Tuệ theo truyền thống Theravada.',
                'display_order': 4,
            },
        ]

        created_depts = 0
        dept_objects = {}
        
        for data in departments_data:
            dept, created = Department.objects.get_or_create(
                code=data['code'],
                defaults=data
            )
            dept_objects[data['code']] = dept
            if created:
                created_depts += 1
                self.stdout.write(self.style.SUCCESS(f"Created Department: {data['name_vi']}"))
            else:
                self.stdout.write(self.style.WARNING(f"Department already exists: {data['code']}"))

        # === STAFF MEMBERS ===
        staff_data = [
            # Ban Giám hiệu (Leadership)
            {
                'display_name_vi': 'TT.TS. Sơn Hạnh Bửu (Cao Phong Tu)',
                'display_name_km': 'អ.ឧ. សុន ហាញប៊ូ',
                'title_vi': 'Viện trưởng',
                'title_km': 'ប្រធានវិទ្យាស្ថាន',
                'position': 'Viện trưởng',
                'bio_vi': 'Tiến sĩ Phật học, Trưởng lão Hội đồng Trị sự, có hơn 30 năm tu học và hoằng pháp.',
                'staff_type': 'leadership',
                'display_order': 1,
                'is_featured': True,
            },
            {
                'display_name_vi': 'TT.ThS. Thạch Phú Ma Ra (Danh Dung)',
                'display_name_km': 'អ.ថ. ថាច ភូម៉ារ៉ា',
                'title_vi': 'Phó Viện trưởng',
                'title_km': 'អនុប្រធានវិទ្យាស្ថាន',
                'position': 'Phó Viện trưởng',
                'bio_vi': 'Thạc sĩ Phật học, chuyên về Luận tạng Abhidhamma và phương pháp giảng dạy.',
                'staff_type': 'leadership',
                'display_order': 2,
                'is_featured': True,
            },
            {
                'display_name_vi': 'TT. Kim An Minh (Kiết Đức)',
                'display_name_km': 'អ. គីម អានមីញ',
                'title_vi': 'Phó Viện trưởng',
                'title_km': 'អនុប្រធានវិទ្យាស្ថាន',
                'position': 'Phó Viện trưởng',
                'bio_vi': 'Phụ trách công tác hành chính và quản lý cơ sở vật chất.',
                'staff_type': 'leadership',
                'display_order': 3,
                'is_featured': True,
            },
            
            # Giáo thọ (Faculty) - Khoa Pali
            {
                'display_name_vi': 'Giáo thọ Lê Văn Ngộ Đức',
                'display_name_km': 'គ្រូបង្រៀន លេវ៉ាន់ ងូដឹក',
                'title_vi': 'Giáo thọ',
                'title_km': 'គ្រូក្រមុំ',
                'position': 'Giảng viên Ngữ pháp Pali',
                'bio_vi': 'Cử nhân Phật học, 15 năm kinh nghiệm giảng dạy ngôn ngữ Pali.',
                'department_code': 'PALI',
                'staff_type': 'faculty',
                'display_order': 10,
            },
            {
                'display_name_vi': 'Giáo thọ Minh Pháp Kiệt',
                'display_name_km': 'គ្រូបង្រៀន មីញផាកិត',
                'title_vi': 'Giảng viên chính',
                'title_km': 'ប្រធានគ្រូបង្រៀន',
                'position': 'Giảng viên Pali nâng cao',
                'bio_vi': 'Thạc sĩ Phật học tốt nghiệp Thái Lan, chuyên về văn phạm Pali và Chú giải kinh điển.',
                'department_code': 'PALI',
                'staff_type': 'faculty',
                'display_order': 11,
            },
            
            # Giáo thọ - Khoa Tam Tạng
            {
                'display_name_vi': 'Giáo thọ Thạch Hạnh Ngộ',
                'display_name_km': 'គ្រូបង្រៀន ថាចហាញងូ',
                'title_vi': 'Giáo thọ',
                'title_km': 'គ្រូក្រមុំ',
                'position': 'Giảng viên Kinh tạng',
                'bio_vi': 'Chuyên về Suttanta Pitaka, 20 năm kinh nghiệm nghiên cứu kinh điển.',
                'department_code': 'TRIPITAKA',
                'staff_type': 'faculty',
                'display_order': 20,
            },
            {
                'display_name_vi': 'Giáo thọ Bửu Minh Ân',
                'display_name_km': 'គ្រូបង្រៀន ប៊ូមីញអន្ត',
                'title_vi': 'Giảng viên',
                'title_km': 'គ្រូបង្រៀន',
                'position': 'Giảng viên Luật tạng Vinaya',
                'bio_vi': 'Cử nhân Phật học, am hiểu sâu rộng về Giới luật Tỳ kheo.',
                'department_code': 'TRIPITAKA',
                'staff_type': 'faculty',
                'display_order': 21,
            },
            {
                'display_name_vi': 'Giáo thọ Tuệ Minh Trúc',
                'display_name_km': 'គ្រូបង្រៀន ទុយមីញទ្រុក',
                'title_vi': 'Giảng viên',
                'title_km': 'គ្រូបង្រៀន',
                'position': 'Giảng viên Luận tạng Abhidhamma',
                'bio_vi': 'Thạc sĩ Phật học, chuyên sâu về triết học Abhidhamma.',
                'department_code': 'TRIPITAKA',
                'staff_type': 'faculty',
                'display_order': 22,
            },
            
            # Giáo thọ - Khoa Lịch sử Văn hóa
            {
                'display_name_vi': 'Giáo thọ Nguyễn Văn Thành',
                'display_name_km': 'គ្រូបង្រៀន ង្គុយេនវ៉ាន់ថាញ',
                'title_vi': 'Giảng viên',
                'title_km': 'គ្រូបង្រៀន',
                'position': 'Giảng viên Lịch sử Phật giáo',
                'bio_vi': 'Cử nhân Lịch sử, chuyên về lịch sử Phật giáo Đông Nam Á.',
                'department_code': 'CULTURE',
                'staff_type': 'faculty',
                'display_order': 30,
            },
            {
                'display_name_vi': 'Giáo thọ Thạch Văn Ni',
                'display_name_km': 'គ្រូបង្រៀន ថាចវ៉ាន់នី',
                'title_vi': 'Giảng viên',
                'title_km': 'គ្រូបង្រៀន',
                'position': 'Giảng viên Văn hóa dân gian Khmer',
                'bio_vi': 'Nghiên cứu viên văn hóa Khmer, tác giả nhiều bài viết về lễ hội truyền thống.',
                'department_code': 'CULTURE',
                'staff_type': 'faculty',
                'display_order': 31,
            },
            
            # Giáo thọ - Khoa Thiền định
            {
                'display_name_vi': 'Thiền sư Pháp Tánh An',
                'display_name_km': 'គ្រូសមាធិ ផាតាញអន្ត',
                'title_vi': 'Thiền sư',
                'title_km': 'គ្រូសមាធិ',
                'position': 'Hướng dẫn thiền Vipassana',
                'bio_vi': 'Thiền sư Vipassana với 25 năm thực hành, đã hướng dẫn hơn 50 khóa thiền.',
                'department_code': 'PRACTICE',
                'staff_type': 'faculty',
                'display_order': 40,
            },
            
            # Cố vấn (Advisory)
            {
                'display_name_vi': 'HT. Thạch Danh Tuyển',
                'display_name_km': 'ព្រះថេរៈ ថាចដាញទុយន្ដ',
                'title_vi': 'Cố vấn Trưởng',
                'title_km': 'ទីប្រឹក្សាជាន់ខ្ពស់',
                'position': 'Cố vấn Trưởng',
                'bio_vi': 'Hòa thượng Trưởng lão, có công khai sáng lập Học viện năm 2006.',
                'staff_type': 'advisory',
                'display_order': 50,
                'is_featured': True,
            },
        ]

        created_staff = 0
        for data in staff_data:
            # Get department if specified
            dept_code = data.pop('department_code', None)
            if dept_code and dept_code in dept_objects:
                data['department'] = dept_objects[dept_code]
            
            # Check if staff already exists
            if not StaffMember.objects.filter(display_name_vi=data['display_name_vi']).exists():
                StaffMember.objects.create(
                    id=uuid.uuid4(),
                    **data
                )
                created_staff += 1
                self.stdout.write(self.style.SUCCESS(f"Created Staff: {data['display_name_vi']}"))
            else:
                self.stdout.write(self.style.WARNING(f"Staff already exists: {data['display_name_vi']}"))

        self.stdout.write(self.style.SUCCESS(f'\n✅ Successfully seeded {created_depts} departments and {created_staff} staff members!'))
