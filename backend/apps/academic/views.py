from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import AcademicYear, Semester, Course, Class, Enrollment, Grade, ExamSchedule
from .serializers import (
    AcademicYearSerializer, SemesterSerializer, CourseSerializer,
    ClassSerializer, EnrollmentSerializer, GradeSerializer, ExamScheduleSerializer
)

class AcademicYearViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ReadOnly ViewSet for Academic Years
    """
    queryset = AcademicYear.objects.all().order_by('-start_date')
    serializer_class = AcademicYearSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False)
    def current(self, request):
        current_year = AcademicYear.objects.filter(is_current=True).first()
        if not current_year:
            current_year = AcademicYear.objects.first()
        
        if current_year:
            serializer = self.get_serializer(current_year)
            return Response(serializer.data)
        return Response(status=404)

class SemesterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Semester.objects.select_related('academic_year').all().order_by('-start_date')
    serializer_class = SemesterSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['academic_year']

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all().order_by('code')
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['level', 'category']
    search_fields = ['code', 'name_vi', 'name_pali', 'description']

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.select_related('course', 'semester', 'instructor').all().order_by('class_code')
    serializer_class = ClassSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['semester', 'course', 'instructor']

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.select_related('student', 'class_instance__course').all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'class_instance', 'status']

class GradeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Grade.objects.select_related('enrollment__student', 'enrollment__class_instance__course').all()
    serializer_class = GradeSerializer
    permission_classes = [permissions.AllowAny]

class ExamScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ExamSchedule.objects.select_related('class_instance__course').all().order_by('exam_date', 'exam_time')
    serializer_class = ExamScheduleSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['class_instance', 'exam_type']


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_student_stats(request):
    """
    Get student dashboard statistics.
    Returns cohort, program, earned credits, GPA, etc.
    """
    user = request.user
    
    # Get profile based on user type
    profile = None
    cohort = None
    current_year = None
    
    if user.user_type == 'monk':
        try:
            profile = user.monk_profile
            cohort = profile.cohort
            current_year = profile.current_year
        except:
            pass
    else:
        try:
            profile = user.layperson_profile
            cohort = profile.cohort
            current_year = profile.current_year
        except:
            pass
    
    # Calculate earned credits from completed enrollments
    enrollments = Enrollment.objects.filter(
        student=user,
        status='APPROVED'
    ).select_related('class_instance__course')
    
    earned_credits = 0
    total_grade_points = 0
    completed_courses = 0
    
    for enrollment in enrollments:
        try:
            grade = enrollment.grade
            if grade and grade.grade_letter:
                course_credits = enrollment.class_instance.course.credits
                earned_credits += course_credits
                
                if grade.grade_point:
                    total_grade_points += grade.grade_point * course_credits
                    completed_courses += 1
        except:
            pass
    
    # Calculate GPA
    gpa = None
    if completed_courses > 0 and earned_credits > 0:
        gpa = round(total_grade_points / earned_credits, 2)
    
    return Response({
        'cohort': cohort,
        'current_year': current_year,
        'program_name': 'Cử nhân Phật học',  # TODO: Get from program config
        'earned_credits': earned_credits,
        'total_credits': 140,  # TODO: Get from program requirements
        'gpa': gpa,
        'status': profile.status if profile else 'active',
    })
