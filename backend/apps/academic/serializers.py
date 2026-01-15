from rest_framework import serializers
from .models import AcademicYear, Semester, Course, Class, Enrollment, Grade, ExamSchedule

class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'year_code', 'start_date', 'end_date', 'is_current']

class SemesterSerializer(serializers.ModelSerializer):
    academic_year_code = serializers.CharField(source='academic_year.year_code', read_only=True)
    
    class Meta:
        model = Semester
        fields = ['id', 'academic_year', 'academic_year_code', 'semester_number', 'start_date', 'end_date']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id', 'code', 'name_vi', 'name_km', 'name_pali', 'description', 
            'credits', 'level', 'category', 'knowledge_block'
        ]

class ClassSerializer(serializers.ModelSerializer):
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_name = serializers.CharField(source='course.name_vi', read_only=True)
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    semester_str = serializers.CharField(source='semester.__str__', read_only=True)
    
    class Meta:
        model = Class
        fields = [
            'id', 'class_code', 'course', 'course_code', 'course_name', 
            'semester', 'semester_str', 'instructor', 'instructor_name',
            'room', 'schedule', 'max_students'
        ]

class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    class_info = serializers.CharField(source='class_instance.__str__', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_name', 'class_instance', 'class_info', 'enrollment_date', 'status', 'drop_date', 'drop_reason']

class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='enrollment.student.get_full_name', read_only=True)
    course_code = serializers.CharField(source='enrollment.class_instance.course.code', read_only=True)
    
    class Meta:
        model = Grade
        fields = [
            'id', 'enrollment', 'student_name', 'course_code',
            'attendance_rate', 'midterm_score', 'final_score',
            'grade_letter', 'gpa_points', 'comments'
        ]

class ExamScheduleSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='class_instance.course.name_vi', read_only=True)
    
    class Meta:
        model = ExamSchedule
        fields = [
            'id', 'class_instance', 'course_name', 'exam_type',
            'exam_date', 'exam_time', 'duration_minutes', 'room', 'notes'
        ]
