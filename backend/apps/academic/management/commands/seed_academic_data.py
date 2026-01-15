from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.users.models import User, MonkProfile
from apps.academic.models import AcademicYear, Semester, Course, Class, Enrollment, Grade
from datetime import date, timedelta
import random

class Command(BaseCommand):
    help = 'Seeds academic data: Curriculum, Classes, Schedule, Student Grades'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Academic Data...')

        # 0. Clean up existing sample data (optional, for idempotency within this scope)
        User.objects.filter(username__in=['TS2024001', 'GV001']).delete()

        # 1. Setup Academic Years & Semesters
        # Create past year (2024-2025) and current year (2025-2026)
        # Note: Model only identifies by year_code (e.g. "2024-2025")
        year_24_25, _ = AcademicYear.objects.get_or_create(
            year_code='2024-2025',
            defaults={'start_date': date(2024, 9, 1), 'end_date': date(2025, 6, 30), 'is_current': False}
        )
        year_25_26, _ = AcademicYear.objects.get_or_create(
            year_code='2025-2026',
            defaults={'start_date': date(2025, 9, 1), 'end_date': date(2026, 6, 30), 'is_current': True}
        )

        # Semesters
        sem1_24, _ = Semester.objects.get_or_create(academic_year=year_24_25, semester_number=1, defaults={'start_date': date(2024, 9, 15), 'end_date': date(2025, 1, 15)})
        sem2_24, _ = Semester.objects.get_or_create(academic_year=year_24_25, semester_number=2, defaults={'start_date': date(2025, 2, 15), 'end_date': date(2025, 6, 15)})
        
        sem1_25, _ = Semester.objects.get_or_create(academic_year=year_25_26, semester_number=1, defaults={'start_date': date(2025, 9, 15), 'end_date': date(2026, 1, 15)})
        sem2_25, _ = Semester.objects.get_or_create(academic_year=year_25_26, semester_number=2, defaults={'start_date': date(2026, 2, 15), 'end_date': date(2026, 6, 15)})

        # 2. Define Curriculum Data (As provided by User)
        curriculum = {
            1: [ # Year 1
                ('TH014', 'Thái Ngữ', 4), ('SV013', 'Xã Hội Học', 3), ('SS014', 'Sanskrit', 4),
                ('SD013', 'Thiền Học', 3), ('PL314', 'Dịch Thuật Pali – I', 4), ('PL214', 'Cú Pháp Pali – I', 4),
                ('PL114', 'Văn Phạm Pali – I', 4), ('PB014', 'Lịch Sử PG Thế Giới (Khmer)', 4),
                ('MB013', 'Phật Pháp Căn Bản', 3), ('EN014', 'Anh Ngữ – I', 3), ('CT013', 'Chính Sách Tôn Giáo & Dân Tộc', 3),
                ('CP013', 'Tin Học Đại Cương', 3), ('AS014', 'Văn Học Khmer – I', 4), ('AK014', 'Văn Minh Khmer – I', 4),
                ('NK013', 'Tông Phái Phật Giáo (V&K)', 3), ('LV013', 'Phương Pháp Viết Luận Văn', 3)
            ],
            2: [ # Year 2
                ('SD243', 'Thiền Học – II', 3), ('TH244', 'Thái Ngữ – II', 4), ('EN244', 'Anh Ngữ – II', 4),
                ('TM012', 'Tư Tưởng HCM', 3), ('ML015', 'Những NL Cơ Bản của CN. Mác – Lênin', 5),
                ('LV013_2', 'Lịch Sử Việt Nam Đại Cương', 3), ('LP013', 'Pháp Luật Đại Cương', 3), ('CM013', 'Đường Lối CM của ĐCSVN', 3),
                ('PL644', 'Dịch Thuật Pali – II', 4), ('PL544', 'Cú Pháp Pali – II', 4), ('PL444', 'Văn Phạm Pali – II', 4),
                ('DP013', 'Triết Học Phật Giáo', 3), ('SS244', 'Sanskrit – II', 4), ('AS224', 'Văn Học Khmer – II', 4),
                ('AK224', 'Văn Minh Khmer – II', 4), ('PA133', 'Văn Học Pali – I', 4), ('AB123', 'Abhidhamma (V&K)', 3),
                ('NK013_2', 'Tông Phái Phật giáo (K)', 3)
            ],
            3: [ # Year 3
                ('TK033', 'Logic Học', 3), ('TH334', 'Thái Ngữ – III', 4), ('SS334', 'Sanskrit – III', 4),
                ('SK034', 'Tôn Giáo Học', 4) # ... incomplete list in code but adequate for sample
            ],
            4: [ # Year 4
                ('VB014', 'Văn Hóa Phật Giáo', 4), ('TH444', 'Thái Ngữ – IV', 4) # ...
            ]
        }

        # 3. Create Courses & Lecturers
        created_courses = {}
        lecturer_user, _ = User.objects.get_or_create(email='giangvien@hvpgntk.edu.vn', defaults={'username': 'GV001', 'role': 'teacher'})
        if _: lecturer_user.set_password('12345678')
        lecturer_user.save()

        for year_num, subjects in curriculum.items():
            for code, name, credits in subjects:
                course, _ = Course.objects.get_or_create(
                    code=code,
                    defaults={'name_vi': name, 'credits': credits, 'description': f'Môn học năm thứ {year_num}'}
                )
                created_courses[code] = (course, year_num)

        # 4. Create Student "TS2024001" (Year 2 Student)
        student, created = User.objects.get_or_create(
            username='TS2024001',
            defaults={
                'email': 'student_sample@hvpgntk.edu.vn', # Changed to avoid collision
                'phone': '0909000888',
                'role': 'student',
                'user_type': 'monk',
                'is_active': True
            }
        )
        if created:
            student.set_password('12345678')
            student.save()
            MonkProfile.objects.update_or_create(
                user=student,
                defaults={
                    'dharma_name_khmer': 'Venerable Sample',
                    'cohort': 'XIV',
                    'current_year': 2,
                    'student_code': 'TS2024001',
                    'date_of_birth': date(1995, 1, 1),
                    'ordination_temple': 'Chùa Mẫu'
                }
            )
            self.stdout.write(f'Created/Updated student: TS2024001 / 12345678')

        # 5. Seed History (Year 1 - Completed)
        # Allocate Year 1 subjects to Sem 1 & Sem 2 of 2024-2025
        year1_subjects = curriculum[1]
        mid_idx = len(year1_subjects) // 2
        sem1_subjects = year1_subjects[:mid_idx]
        sem2_subjects = year1_subjects[mid_idx:]

        def seed_classes_and_grades(subjects, semester, is_completed=True):
            for code, name, credits in subjects:
                course = created_courses[code][0]
                # Create Class
                cls_instance, _ = Class.objects.get_or_create(
                    class_code=f"{code}_{semester.academic_year.year_code}_{semester.semester_number}",
                    defaults={
                        'course': course, 'semester': semester, 'instructor': lecturer_user,
                        'max_students': 50, 'room': 'A101'
                    }
                )
                
                # Enroll Student
                status = 'COMPLETED' if is_completed else 'ENROLLED'
                enrollment, _ = Enrollment.objects.get_or_create(
                    student=student, class_instance=cls_instance,
                    defaults={'status': status}
                )
                
                if is_completed:
                    # Give Grade ~ 8.0 - 9.5
                    score = round(random.uniform(7.5, 9.8), 1)
                    midterm = round(random.uniform(7.0, 9.5), 1)
                    # Simple letter grading
                    letter = 'A' if score >= 8.5 else 'B+' if score >= 8.0 else 'B'
                    
                    Grade.objects.update_or_create(
                        enrollment=enrollment,
                        defaults={
                            'midterm_score': midterm,
                            'final_score': score,
                            'gpa_points': score, # Assuming 10-scale
                            'grade_letter': letter
                        }
                    )

        seed_classes_and_grades(sem1_subjects, sem1_24, is_completed=True)
        seed_classes_and_grades(sem2_subjects, sem2_24, is_completed=True)

        # 6. Seed Current Semester (Year 2 - Semester 2 of 2025-2026? Or Sem 1?)
        # Let's say we are in Sem 1 of 2025-2026 (first half of Year 2)
        # Actually in script above, 25-26 Sem 1 is past, Sem 2 is current.
        # Let's seed Year 2 subjects into Sem 2 2025-2026 (Current)
        
        year2_subjects = curriculum[2]
        current_subjects = year2_subjects[:6] # Take first 6 subjects of Year 2
        
        # Schedule Templates
        days = [{'day': 2, 'name': 'Thứ 2'}, {'day': 3, 'name': 'Thứ 3'}, {'day': 4, 'name': 'Thứ 4'}, {'day': 5, 'name': 'Thứ 5'}, {'day': 6, 'name': 'Thứ 6'}]
        periods = [{'start': '07:00', 'end': '09:00'}, {'start': '09:15', 'end': '11:15'}, {'start': '13:30', 'end': '15:30'}]
        
        for idx, (code, name, credits) in enumerate(current_subjects):
            course = created_courses[code][0]
            # Create Class
            day = days[idx % 5]
            period = periods[idx % 3]
            schedule_json = [{"day": day['day'], "start": period['start'], "end": period['end'], "room": "B202"}]
            
            cls_instance, _ = Class.objects.get_or_create(
                class_code=f"{code}_2526_2",
                defaults={
                    'course': course, 'semester': sem2_25, 'instructor': lecturer_user,
                    'max_students': 60, 'room': 'B202',
                    'schedule': schedule_json
                }
            )
            
            # Enroll Student (Active)
            Enrollment.objects.get_or_create(
                student=student, class_instance=cls_instance,
                defaults={'status': 'ENROLLED'}
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded academic data and student TS2024001'))
