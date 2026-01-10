from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.users.models import User, MonkProfile, LaypersonProfile
from apps.academic.models import AcademicYear, Semester, Course, Class, Enrollment, Grade, ExamSchedule
from datetime import timedelta, time
import random

class Command(BaseCommand):
    help = 'Seed academic data for testing Student Portal'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding academic data...")
        
        # 0. Create Admission Period (Active)
        from apps.admissions.models import AdmissionPeriod
        current_date = timezone.now().date()
        AdmissionPeriod.objects.get_or_create(
            admission_year=2025,
            defaults={
                'application_start_date': current_date - timedelta(days=15),
                'application_end_date': current_date + timedelta(days=45), # Open for 45 more days
                'status': 'OPEN',
                'notes': 'Tuyển sinh Cử nhân Phật học Khóa VI năm học 2025-2029'
            }
        )

        # 1. Create Academic Years
        current_date = timezone.now().date()
        
        # 2024-2025 (Current)
        ay_24_25, _ = AcademicYear.objects.get_or_create(
            year_code='2024-2025',
            defaults={
                'start_date': current_date - timedelta(days=120),
                'end_date': current_date + timedelta(days=200),
                'is_current': True
            }
        )
        
        # 2023-2024 (Past)
        ay_23_24, _ = AcademicYear.objects.get_or_create(
            year_code='2023-2024',
            defaults={
                'start_date': current_date - timedelta(days=485),
                'end_date': current_date - timedelta(days=121),
                'is_current': False
            }
        )

        # 2. Create Semesters
        # Current Year Semesters
        sem1_24_25, _ = Semester.objects.get_or_create(
            academic_year=ay_24_25,
            semester_number=1,
            defaults={
                'start_date': ay_24_25.start_date,
                'end_date': ay_24_25.start_date + timedelta(days=120)
            }
        )
        
        # Past Year Semesters
        sem1_23_24, _ = Semester.objects.get_or_create(
            academic_year=ay_23_24,
            semester_number=1,
            defaults={
                'start_date': ay_23_24.start_date,
                'end_date': ay_23_24.start_date + timedelta(days=120)
            }
        )
        sem2_23_24, _ = Semester.objects.get_or_create(
            academic_year=ay_23_24,
            semester_number=2,
            defaults={
                'start_date': ay_23_24.start_date + timedelta(days=150),
                'end_date': ay_23_24.end_date
            }
        )

        # 3. Create Courses
        courses_data = [
            # Code, Vi Name, Pali Name, Credits
            ('PL101', 'Pali Sơ Cấp 1', 'Pali Primer I', 3),
            ('PL102', 'Pali Sơ Cấp 2', 'Pali Primer II', 3),
            ('VN101', 'Luật Tỳ Kheo 1', 'Vinaya Pitaka I', 4),
            ('VN102', 'Luật Tỳ Kheo 2', 'Vinaya Pitaka II', 4),
            ('ST101', 'Kinh Tạng 1', 'Suttanta Pitaka I', 3),
            ('AP101', 'Vi Diệu Pháp 1', 'Abhidhamma I', 4),
            ('HIS101', 'Lịch Sử Phật Giáo Nam Tông', 'Theravada History', 2),
        ]
        
        created_courses = []
        for code, vi, pali, cred in courses_data:
            c, _ = Course.objects.get_or_create(
                code=code,
                defaults={
                    'name_vi': vi,
                    'name_pali': pali,
                    'credits': cred,
                    'level': 'FOUNDATIONAL',
                    'description': f'Môn học {vi} cơ bản.'
                }
            )
            created_courses.append(c)

        # 4. Create Student User
        student_email = 'student@hvpgntk.edu.vn'
        student, created = User.objects.get_or_create(
            email=student_email,
            defaults={
                'user_type': 'monk',
                'role': 'student',
                'is_active': True
            }
        )
        if created:
            student.set_password('student123')
            student.save()
            MonkProfile.objects.create(
                user=student,
                dharma_name_khmer='Visuddhi',
                student_code='TS24001',
                vassa_count=3,
                date_of_birth='1999-01-01',
                place_of_birth='Tra Vinh'
            )
            self.stdout.write(f"Created student: {student_email} / student123")
        else:
            self.stdout.write(f"Student already exists: {student_email}")

        # 5. Create Classes & Enrollments (History)
        # Year 23-24 Sem 1
        for idx, course in enumerate(created_courses[:3]): # First 3 courses
            cls, _ = Class.objects.get_or_create(
                course=course,
                semester=sem1_23_24,
                class_code=f"{course.code}-231",
                defaults={'max_students': 30, 'room': 'A101'}
            )
            # Add completed enrollment
            enr, _ = Enrollment.objects.get_or_create(
                student=student,
                class_instance=cls,
                defaults={'status': 'COMPLETED'}
            )
            # Add Grade
            Grade.objects.get_or_create(
                enrollment=enr,
                defaults={
                    'midterm_score': random.uniform(7.0, 9.0),
                    'final_score': random.uniform(7.5, 9.5),
                    'gpa_points': 3.5, # Simplified
                    'grade_letter': 'A' if idx == 0 else 'B+'
                }
            )

        # 6. Create Classes & Enrollments (Current Semester)
        # Year 24-25 Sem 1
        current_classes = []
        schedule_slots = [
            {'day': 2, 'start': '07:00', 'end': '09:00', 'room': 'B202'}, # Mon
            {'day': 3, 'start': '08:00', 'end': '10:00', 'room': 'B202'}, # Tue
            {'day': 4, 'start': '13:00', 'end': '15:00', 'room': 'C303'}, # Wed
            {'day': 5, 'start': '07:00', 'end': '10:00', 'room': 'Lab1'}, # Thu
        ]
        
        for idx, course in enumerate(created_courses[3:]): # Remaining courses
            slot = schedule_slots[idx % len(schedule_slots)]
            cls, _ = Class.objects.get_or_create(
                course=course,
                semester=sem1_24_25,
                class_code=f"{course.code}-241",
                defaults={
                    'max_students': 40, 
                    'room': slot['room'],
                    'schedule': [slot] # JSON List
                }
            )
            current_classes.append(cls)
            
            # Enroll student
            Enrollment.objects.get_or_create(
                student=student,
                class_instance=cls,
                defaults={'status': 'ENROLLED', 'enrollment_date': current_date}
            )
            
            # Create Exam Schedule
            ExamSchedule.objects.get_or_create(
                class_instance=cls,
                exam_type='FINAL',
                defaults={
                    'exam_date': current_date + timedelta(days=30 + idx),
                    'exam_time': time(8, 00),
                    'duration_minutes': 90,
                    'room': 'Hall A'
                }
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded academic data and student account!"))
