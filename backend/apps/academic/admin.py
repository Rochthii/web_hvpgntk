from django.contrib import admin
from .models import AcademicYear, Semester, Course, Class, Enrollment, Grade, ExamSchedule


@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display = ['year_code', 'start_date', 'end_date', 'is_current']
    list_filter = ['is_current']
    ordering = ['-year_code']


@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'academic_year', 'semester_number', 'start_date', 'end_date']
    list_filter = ['academic_year']
    ordering = ['-academic_year', 'semester_number']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name_vi', 'credits', 'level', 'category']
    list_filter = ['level', 'category']
    search_fields = ['code', 'name_vi', 'name_pali']
    ordering = ['level', 'code']


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ['class_code', 'course', 'semester', 'instructor', 'room', 'max_students']
    list_filter = ['semester', 'course']
    search_fields = ['class_code', 'course__code']
    autocomplete_fields = ['instructor']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'class_instance', 'enrollment_date', 'status']
    list_filter = ['status', 'class_instance__semester']
    search_fields = ['student__email', 'class_instance__course__code']
    autocomplete_fields = ['student']
    readonly_fields = ['enrollment_date']


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ['enrollment', 'midterm_score', 'final_score', 'grade_letter', 'gpa_points']
    list_filter = ['grade_letter']
    search_fields = ['enrollment__student__email']


@admin.register(ExamSchedule)
class ExamScheduleAdmin(admin.ModelAdmin):
    list_display = ['class_instance', 'exam_type', 'exam_date', 'exam_time', 'room', 'duration_minutes']
    list_filter = ['exam_type', 'exam_date']
    search_fields = ['class_instance__course__code']
    ordering = ['exam_date', 'exam_time']
