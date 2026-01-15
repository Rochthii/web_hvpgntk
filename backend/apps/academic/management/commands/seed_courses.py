from django.core.management.base import BaseCommand
from apps.academic.models import Course


class Command(BaseCommand):
    help = 'Seed Courses (4-year curriculum) with bilingual content (VN + KM)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🌱 Seeding Courses (Bilingual)...'))
        
        # Delete existing courses to avoid duplicates
        Course.objects.all().delete()
        
        courses_data = [
            # ===== NĂM 1 =====
            {
                'study_year': 1,
                'code': 'TH014',
                'name_vi': 'Thái Ngữ – I',
                'name_km': 'ភាសាថៃ – ១',
                'credits': 4,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 1,
                'code': 'SV013',
                'name_vi': 'Xã Hội Học',
                'name_km': 'សង្គមវិទ្យា',
                'credits': 3,
                'level': 'FOUNDATIONAL',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 1,
                'code': 'SS014',
                'name_vi': 'Sanskrit – I',
                'name_km': 'សំស្ក្រឹត – ១',
                'credits': 4,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 1,
                'code': 'SD013',
                'name_vi': 'Thiền Học – I',
                'name_km': 'សមាធិវិជ្ជា – ១',
                'credits': 3,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'PRACTICE'
            },
            {
                'study_year': 1,
                'code': 'PL314',
                'name_vi': 'Dịch Thuật Pali – I',
                'name_km': 'ការបកប្រែបាលី – ១',
                'credits': 4,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 1,
                'code': 'PL214',
                'name_vi': 'Cú Pháp Pali – I',
                'name_km': 'បទសម្ព័ន្ធបាលី – ១',
                'credits': 4,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 1,
                'code': 'PL114',
                'name_vi': 'Văn Phạm Pali – I',
                'name_km': 'វេយ្យាករណ៍បាលី – ១',
                'credits': 4,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 1,
                'code': 'PB014',
                'name_vi': 'Lịch Sử Phật Giáo Thế Giới',
                'name_km': 'ប្រវត្តិសាស្ត្រព្រះពុទ្ធសាសនាពិភពលោក',
                'credits': 4,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'BUDDHIST_HISTORY'
            },
            {
                'study_year': 1,
                'code': 'MB013',
                'name_vi': 'Phật Pháp Căn Bản',
                'name_km': 'ព្រះធម៌មូលដ្ឋាន',
                'credits': 3,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'SUTTA'
            },
            {
                'study_year': 1,
                'code': 'EN014',
                'name_vi': 'Anh Ngữ – I',
                'name_km': 'អង់គ្លេស – ១',
                'credits': 3,
                'level': 'FOUNDATIONAL',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 1,
                'code': 'CT013',
                'name_vi': 'Chính Sách Tôn Giáo & Dân Tộc',
                'name_km': 'គោលនយោបាយសាសនានិងជនជាតិ',
                'credits': 3,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 1,
                'code': 'CP013',
                'name_vi': 'Tin Học Đại Cương',
                'name_km': 'គណិតវិទ្យាទូទៅ',
                'credits': 3,
                'level': 'FOUNDATIONAL',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 1,
                'code': 'AS014',
                'name_vi': 'Văn Học Khmer – I',
                'name_km': 'អក្សរសាស្ត្រខ្មែរ – ១',
                'credits': 4,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
            {
                'study_year': 1,
                'code': 'AK014',
                'name_vi': 'Văn Minh Khmer – I',
                'name_km': 'អរិយធម៌ខ្មែរ – ១',
                'credits': 4,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
            {
                'study_year': 1,
                'code': 'NK013',
                'name_vi': 'Tông Phái Phật Giáo',
                'name_km': 'និកាយព្រះពុទ្ធសាសនា',
                'credits': 3,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'BUDDHIST_HISTORY'
            },
            {
                'study_year': 1,
                'code': 'LV013',
                'name_vi': 'Phương Pháp Viết Luận Văn',
                'name_km': 'វិធីសាស្រ្តសរសេរនិក្ខេបបទ',
                'credits': 3,
                'level': 'FOUNDATIONAL',
                'category': 'REQUIRED',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            
            # ===== NĂM 2 =====
            {
                'study_year': 2,
                'code': 'SD243',
                'name_vi': 'Thiền Học – II',
                'name_km': 'សមាធិវិជ្ជា – ២',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PRACTICE'
            },
            {
                'study_year': 2,
                'code': 'TH244',
                'name_vi': 'Thái Ngữ – II',
                'name_km': 'ភាសាថៃ – ២',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 2,
                'code': 'EN244',
                'name_vi': 'Anh Ngữ – II',
                'name_km': 'អង់គ្លេស – ២',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 2,
                'code': 'TM012',
                'name_vi': 'Tư Tưởng Hồ Chí Minh',
                'name_km': 'គំនិតហូជីមិញ',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 2,
                'code': 'ML015',
                'name_vi': 'Những Nguyên Lý Cơ Bản CN Mác-Lênin',
                'name_km': 'គោលការណ៍មូលដ្ឋានលទ្ធិម៉ាកស៍-លេនីន',
                'credits': 5,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 2,
                'code': 'LV013-2',
                'name_vi': 'Lịch Sử Việt Nam Đại Cương',
                'name_km': 'ប្រវត្តិសាស្ត្រវៀតណាមទូទៅ',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 2,
                'code': 'LP013',
                'name_vi': 'Pháp Luật Đại Cương',
                'name_km': 'ច្បាប់ទូទៅ',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 2,
                'code': 'CM013',
                'name_vi': 'Đường Lối Cách Mạng ĐCSVN',
                'name_km': 'ផ្លូវដំណើរបដិវត្តន៍គណបក្សសាធារណរដ្ឋ',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 2,
                'code': 'PL644',
                'name_vi': 'Dịch Thuật Pali – II',
                'name_km': 'ការបកប្រែបាលី – ២',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 2,
                'code': 'PL544',
                'name_vi': 'Cú Pháp Pali – II',
                'name_km': 'បទសម្ព័ន្ធបាលី – ២',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 2,
                'code': 'PL444',
                'name_vi': 'Văn Phạm Pali – II',
                'name_km': 'វេយ្យាករណ៍បាលី – ២',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 2,
                'code': 'DP013',
                'name_vi': 'Triết Học Phật Giáo',
                'name_km': 'ទស្សនវិជ្ជាព្រះពុទ្ធសាសនា',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
            {
                'study_year': 2,
                'code': 'SS244',
                'name_vi': 'Sanskrit – II',
                'name_km': 'សំស្ក្រឹត – ២',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 2,
                'code': 'AS224',
                'name_vi': 'Văn Học Khmer – II',
                'name_km': 'អក្សរសាស្ត្រខ្មែរ – ២',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
            {
                'study_year': 2,
                'code': 'AK224',
                'name_vi': 'Văn Minh Khmer – II',
                'name_km': 'អរិយធម៌ខ្មែរ – ២',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
            {
                'study_year': 2,
                'code': 'PA133',
                'name_vi': 'Văn Học Pali – I',
                'name_km': 'អក្សរសាស្ត្របាលី – ១',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 2,
                'code': 'AB123',
                'name_vi': 'Abhidhamma',
                'name_km': 'អភិធម្ម',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'ABHIDHAMMA'
            },
            
            # ===== NĂM 3 =====
            {
                'study_year': 3,
                'code': 'TK033',
                'name_vi': 'Logic Học',
                'name_km': 'តក្កវិទ្យា',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 3,
                'code': 'TH334',
                'name_vi': 'Thái Ngữ – III',
                'name_km': 'ភាសាថៃ – ៣',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 3,
                'code': 'SS334',
                'name_vi': 'Sanskrit – III',
                'name_km': 'សំស្ក្រឹត – ៣',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 3,
                'code': 'SK034',
                'name_vi': 'Tôn Giáo Học',
                'name_km': 'សាសនាវិទ្យា',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
            {
                'study_year': 3,
                'code': 'SD333',
                'name_vi': 'Thiền Học – III',
                'name_km': 'សមាធិវិជ្ជា – ៣',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PRACTICE'
            },
            {
                'study_year': 3,
                'code': 'PL334',
                'name_vi': 'Dịch Thuật Pali – III',
                'name_km': 'ការបកប្រែបាលី – ៣',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 3,
                'code': 'PL234',
                'name_vi': 'Cú Pháp Pali – III',
                'name_km': 'បទសម្ព័ន្ធបាលី – ៣',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 3,
                'code': 'PL124',
                'name_vi': 'Văn Phạm Pali – III',
                'name_km': 'វេយ្យាករណ៍បាលី – ៣',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 3,
                'code': 'PA233',
                'name_vi': 'Văn Học Pali – II',
                'name_km': 'អក្សរសាស្ត្របាលី – ២',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 3,
                'code': 'EN334',
                'name_vi': 'Anh Ngữ – III',
                'name_km': 'អង់គ្លេស – ៣',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 3,
                'code': 'AS334',
                'name_vi': 'Văn Học Khmer – III',
                'name_km': 'អក្សរសាស្ត្រខ្មែរ – ៣',
                'credits': 4,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
            {
                'study_year': 3,
                'code': 'AB233',
                'name_vi': 'Abhidhamma – II',
                'name_km': 'អភិធម្ម – ២',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'ABHIDHAMMA'
            },
            {
                'study_year': 3,
                'code': 'BG013',
                'name_vi': 'Mỹ Thuật và Kiến Trúc Phật Giáo Khmer',
                'name_km': 'សិល្បៈនិងស្ថាបត្យកម្មព្រះពុទ្ធសាសនាខ្មែរ',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'ELECTIVE',
                'knowledge_block': 'OTHER'
            },
            {
                'study_year': 3,
                'code': 'MB013-2',
                'name_vi': 'Phật Pháp Căn Bản – II',
                'name_km': 'ព្រះធម៌មូលដ្ឋាន – ២',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'SUTTA'
            },
            {
                'study_year': 3,
                'code': 'AK224-2',
                'name_vi': 'Văn Minh Khmer – III',
                'name_km': 'អរិយធម៌ខ្មែរ – ៣',
                'credits': 3,
                'level': 'INTERMEDIATE',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
            
            # ===== NĂM 4 =====
            {
                'study_year': 4,
                'code': 'VB014',
                'name_vi': 'Văn Hóa Phật Giáo',
                'name_km': 'វប្បធម៌ព្រះពុទ្ធសាសនា',
                'credits': 4,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
            {
                'study_year': 4,
                'code': 'TH444',
                'name_vi': 'Thái Ngữ – IV',
                'name_km': 'ភាសាថៃ – ៤',
                'credits': 4,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 4,
                'code': 'EN444',
                'name_vi': 'Anh Ngữ – IV',
                'name_km': 'អង់គ្លេស – ៤',
                'credits': 4,
                'level': 'ADVANCED',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 4,
                'code': 'SD443',
                'name_vi': 'Thiền Học – IV',
                'name_km': 'សមាធិវិជ្ជា – ៤',
                'credits': 3,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'PRACTICE'
            },
            {
                'study_year': 4,
                'code': 'CS013',
                'name_vi': 'Tâm Lý Học',
                'name_km': 'ចិត្តវិទ្យា',
                'credits': 3,
                'level': 'ADVANCED',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 4,
                'code': 'SS444',
                'name_vi': 'Sanskrit – IV',
                'name_km': 'សំស្ក្រឹត – ៤',
                'credits': 4,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 4,
                'code': 'PL944',
                'name_vi': 'Dịch Thuật Pali – IV',
                'name_km': 'ការបកប្រែបាលី – ៤',
                'credits': 4,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 4,
                'code': 'PL844',
                'name_vi': 'Cú Pháp Pali – IV',
                'name_km': 'បទសម្ព័ន្ធបាលី – ៤',
                'credits': 4,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 4,
                'code': 'PL744',
                'name_vi': 'Văn Phạm Pali – IV',
                'name_km': 'វេយ្យាករណ៍បាលី – ៤',
                'credits': 4,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 4,
                'code': 'PL343',
                'name_vi': 'Văn Học Pali – III',
                'name_km': 'អក្សរសាស្ត្របាលី – ៣',
                'credits': 4,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'PALI_LANGUAGE'
            },
            {
                'study_year': 4,
                'code': 'VX013',
                'name_vi': 'Văn Hóa Xã Hội',
                'name_km': 'វប្បធម៌សង្គម',
                'credits': 3,
                'level': 'ADVANCED',
                'category': 'GENERAL',
                'knowledge_block': 'GENERAL_EDUCATION'
            },
            {
                'study_year': 4,
                'code': 'AS334-2',
                'name_vi': 'Văn Học Khmer – IV',
                'name_km': 'អក្សរសាស្ត្រខ្មែរ – ៤',
                'credits': 4,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
            {
                'study_year': 4,
                'code': 'NK013-3',
                'name_vi': 'Tông Phái Phật Giáo',
                'name_km': 'និកាយព្រះពុទ្ធសាសនា',
                'credits': 3,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'BUDDHIST_HISTORY'
            },
            {
                'study_year': 4,
                'code': 'SB033',
                'name_vi': 'Xã Hội Phật Giáo (Khmer)',
                'name_km': 'សង្គមព្រះពុទ្ធសាសនា (ខ្មែរ)',
                'credits': 3,
                'level': 'ADVANCED',
                'category': 'REQUIRED',
                'knowledge_block': 'OTHER'
            },
        ]
        
        created_count = 0
        for course_data in courses_data:
            course, created = Course.objects.update_or_create(
                code=course_data['code'],
                defaults=course_data
            )
            if created:
                created_count += 1
                status = '✅ Created'
            else:
                status = '🔄 Updated'
            self.stdout.write(f'  {status}: {course_data["code"]} - {course_data["name_vi"]} / {course_data["name_km"]}')
        
        self.stdout.write(self.style.SUCCESS(f'✅ {created_count} courses created, {len(courses_data) - created_count} updated (Bilingual)!'))
