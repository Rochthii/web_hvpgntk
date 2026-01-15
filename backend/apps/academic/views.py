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
    
    @action(detail=False)
    def current(self, request):
        """Get the current active semester based on date."""
        from django.utils import timezone
        today = timezone.now().date()
        
        # First try to find semester that contains today
        semester = Semester.objects.filter(
            start_date__lte=today,
            end_date__gte=today
        ).select_related('academic_year').first()
        
        # Fallback: get latest semester from current academic year
        if not semester:
            current_year = AcademicYear.objects.filter(is_current=True).first()
            if current_year:
                semester = Semester.objects.filter(
                    academic_year=current_year
                ).order_by('-start_date').first()
        
        if semester:
            serializer = self.get_serializer(semester)
            return Response(serializer.data)
        
        return Response({'detail': 'Không tìm thấy học kỳ hiện tại'}, status=404)

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
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_enrollments(self, request):
        """Get current user's enrollments for the active academic year."""
        enrollments = Enrollment.objects.filter(
            student=request.user,
            status='ENROLLED',
            class_instance__semester__academic_year__is_current=True
        ).select_related(
            'class_instance',
            'class_instance__course',
            'class_instance__semester',
            'class_instance__instructor'
        )
        
        # Build response with detailed class info
        data = []
        for enrollment in enrollments:
            cls = enrollment.class_instance
            course = cls.course
            
            # Parse schedule
            schedule_day = None
            schedule_time = None
            if cls.schedule:
                schedules = cls.schedule if isinstance(cls.schedule, list) else [cls.schedule]
                if schedules and isinstance(schedules[0], dict):
                    day_num = schedules[0].get('day', 2)
                    day_names = {2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7'}
                    schedule_day = day_names.get(day_num, f'Thứ {day_num}')
                    schedule_time = f"{schedules[0].get('start', '')} - {schedules[0].get('end', '')}"
            
            data.append({
                'id': enrollment.id,
                'status': enrollment.status,
                'class_info': {
                    'id': cls.id,
                    'class_code': cls.class_code,
                    'course': {
                        'id': course.id,
                        'code': course.code,
                        'name_vi': course.name_vi,
                        'credits': course.credits,
                    },
                    'classroom': cls.room,
                    'schedule_day': schedule_day,
                    'schedule_time': schedule_time,
                }
            })
        
        return Response(data)

from apps.core.permissions import CanViewGrades, CanEditGrades

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.select_related('enrollment__student', 'enrollment__class_instance__course').all()
    serializer_class = GradeSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [CanViewGrades()]
        return [CanEditGrades()]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        
        if user.is_staff or user.role in ['admin', 'abbot']:
            return qs
        if user.role == 'teacher':
             # Teachers view grades for classes they teach
             return qs.filter(enrollment__class_instance__instructor=user)
        if user.role == 'student':
             # Students view their own grades
             return qs.filter(enrollment__student=user)
        
        # Others (Secretary, Admission) might view all or nothing?
        # Based on Matrix "Grades View": Admin, Abbot, Teacher, Student
        # Secretary/Admission not explicitly listed, but logical to allow view?
        # For now, restrict to defined roles.
        return qs.none() 

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
        status='COMPLETED'
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
                
                if grade.gpa_points: # Note: model has gpa_points, script used gpa_points
                    total_grade_points += grade.gpa_points * course_credits
                    completed_courses += 1
        except:
            pass
    
    # Calculate GPA
    gpa = None
    if completed_courses > 0 and earned_credits > 0:
        gpa = round(total_grade_points / earned_credits, 2)
    
    # Get current semester courses count
    # Logic: Enrolled in classes of current academic year
    current_semester_courses = Enrollment.objects.filter(
        student=user,
        status='ENROLLED',
        class_instance__semester__academic_year__is_current=True
    ).count()
    
    # Get upcoming exams (next 30 days)
    from django.utils import timezone
    from datetime import timedelta
    
    upcoming_exams = []
    try:
        today = timezone.now().date()
        next_month = today + timedelta(days=30)
        exams = ExamSchedule.objects.filter(
            class_instance__enrollments__student=user,
            exam_date__gte=today,
            exam_date__lte=next_month
        ).select_related('class_instance__course').order_by('exam_date', 'exam_time')[:5]
        
        for exam in exams:
            upcoming_exams.append({
                'course_name': exam.class_instance.course.name_vi,
                'exam_type': exam.get_exam_type_display(),
                'exam_date': exam.exam_date.strftime('%d/%m/%Y'),
                'exam_time': exam.exam_time.strftime('%H:%M') if exam.exam_time else None,
                'room': exam.room,
            })
    except:
        pass
    
    return Response({
        'cohort': cohort,
        'current_year': current_year,
        'program_name': 'Cử nhân Phật học',
        'earned_credits': earned_credits,
        'total_credits': 140, # Standard curriculum
        'gpa': gpa,
        'current_semester_courses': current_semester_courses,
        'upcoming_exams': upcoming_exams,
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_my_schedule(request):
    """
    Get weekly schedule for the current semester.
    Returns list of enrolled classes with schedule details.
    """
    user = request.user
    
    # Get enrollments for current semester
    # Use academic_year__is_current=True.
    enrollments = Enrollment.objects.filter(
        student=user,
        status='ENROLLED',
        class_instance__semester__academic_year__is_current=True
    ).select_related('class_instance', 'class_instance__course', 'class_instance__instructor')
    
    schedule_data = []
    
    for enrollment in enrollments:
        cls = enrollment.class_instance
        course = cls.course
        
        # Parse schedule JSON
        # Expected format: [{"day": 2, "start": "07:00", "end": "09:00", "room": "A101"}]
        # or single object: {"day": 2, "start": "07:00", "end": "09:00"}
        schedule_info = cls.schedule
        
        if not schedule_info:
            continue
            
        # Normalize to list
        schedules = schedule_info if isinstance(schedule_info, list) else [schedule_info]
        
        for slot in schedules:
            if not isinstance(slot, dict):
                continue
                
            schedule_data.append({
                'class_id': cls.id,
                'course_code': course.code,
                'course_name': course.name_vi,
                'lecturer': cls.instructor.display_name if cls.instructor else "Chưa phân công",
                'day_of_week': slot.get('day', 2),  # 2=Mon, 8=Sun
                'start_time': slot.get('start', '07:00'),
                'end_time': slot.get('end', '09:00'),
                'room': slot.get('room', cls.room)
            })
            
    return Response(schedule_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_my_grades(request):
    """
    Get all grades for the logged-in student, grouped by semester.
    """
    user = request.user
    
    # Get all completed/enrolled enrollments with grades
    enrollments = Enrollment.objects.filter(
        student=user
    ).select_related(
        'class_instance', 
        'class_instance__course', 
        'class_instance__semester',
        'class_instance__semester__academic_year',
        'grade'
    ).order_by('-class_instance__semester__academic_year__year_code', '-class_instance__semester__semester_number')
    
    # Group by semester
    semesters_data = {}
    
    for enrollment in enrollments:
        cls = enrollment.class_instance
        sem = cls.semester
        year = sem.academic_year
        
        sem_key = f"{year.year_code}_{sem.semester_number}"
        
        if sem_key not in semesters_data:
            semesters_data[sem_key] = {
                'semester_info': {
                    'term': f"Học kỳ {sem.semester_number}",
                    'year': year.year_code,
                    'is_current': year.is_current,
                },
                'grades': [],
                'semester_gpa': 0,
                'semester_credits': 0
            }
            
        grade_data = {
            'course_code': cls.course.code,
            'course_name': cls.course.name_vi,
            'credits': cls.course.credits,
            'midterm': None,
            'final': None,
            'total': None,
            'letter': None,
            'status': enrollment.get_status_display()
        }
        
        try:
            if hasattr(enrollment, 'grade'):
                g = enrollment.grade
                grade_data['midterm'] = g.midterm_score
                grade_data['final'] = g.final_score
                grade_data['total'] = g.gpa_points  # Or calculate 10-scale total
                grade_data['letter'] = g.grade_letter
        except:
            pass
            
        semesters_data[sem_key]['grades'].append(grade_data)
        

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_available_classes(request):
    """
    Get classes available for registration in the current semester.
    """
    user = request.user
    
    # Get current semester
    # Logic: Get semester with is_current=True in current academic year
    # For now, just find any semester marked is_current=True on AcademicYear? 
    # Or Semester model doesn't have is_current, AcademicYear does.
    # Let's assume we find the active semester based on date or strict flag.
    # Checking models again: AcademicYear has is_current. Semester is part of Year.
    # We need to find the specific semester active NOW.
    # Let's pick the semester within current year that contains Today, or just all classes of Current Year?
    # Ideally: Classes belonging to AcademicYear.is_current=True. 
    # But usually registration is for a specific semester (HK1 or HK2).
    # Let's filter classes where class.semester.academic_year.is_current = True
    
    classes = Class.objects.filter(
        semester__academic_year__is_current=True
    ).select_related('course', 'instructor', 'semester').order_by('course__code')
    
    # Get IDs of classes user already enrolled in
    enrolled_class_ids = Enrollment.objects.filter(
        student=user,
        status='ENROLLED'
    ).values_list('class_instance_id', flat=True)
    
    data = []
    for cls in classes:
        # Calculate current enrollment count
        current_count = Enrollment.objects.filter(
            class_instance=cls,
            status__in=['ENROLLED', 'APPROVED']
        ).count()
        
        is_full = current_count >= cls.max_students
        is_enrolled = cls.id in enrolled_class_ids
        
        data.append({
            'id': cls.id,
            'class_code': cls.class_code,
            'course_name': cls.course.name_vi,
            'course_code': cls.course.code,
            'credits': cls.course.credits,
            'instructor': cls.instructor.display_name if cls.instructor else 'Chưa phân công',
            'schedule': cls.schedule, # JSON
            'room': cls.room,
            'max_students': cls.max_students,
            'current_students': current_count,
            'is_full': is_full,
            'is_enrolled': is_enrolled,
            'semester': str(cls.semester)
        })
        
    return Response(data)


def check_time_overlap(schedule1, schedule2):
    """
    Helper to check if two schedule lists overlap.
    Schedule format: [{'day': 2, 'start': '07:00', 'end': '09:00'}, ...]
    """
    def parse_time(t_str):
        h, m = map(int, t_str.split(':'))
        return h * 60 + m

    list1 = schedule1 if isinstance(schedule1, list) else [schedule1]
    list2 = schedule2 if isinstance(schedule2, list) else [schedule2]

    for s1 in list1:
        if not isinstance(s1, dict): continue
        for s2 in list2:
            if not isinstance(s2, dict): continue
            
            if s1.get('day') != s2.get('day'):
                continue
            
            start1 = parse_time(s1.get('start', '00:00'))
            end1 = parse_time(s1.get('end', '00:00'))
            start2 = parse_time(s2.get('start', '00:00'))
            end2 = parse_time(s2.get('end', '00:00'))

            # Check overlap: (Start1 < End2) and (Start2 < End1)
            if start1 < end2 and start2 < end1:
                return True
    return False

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def enroll_class(request):
    """
    Enroll in a class.
    Validations:
    - Already enrolled
    - Class full
    - Max credits (25)
    - Prerequisites met
    - Time conflicts
    """
    user = request.user
    class_id = request.data.get('class_id')
    
    if not class_id:
        return Response({'detail': 'Thiếu class_id'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        cls = Class.objects.select_related('course', 'semester', 'semester__academic_year').get(id=class_id)
    except Class.DoesNotExist:
        return Response({'detail': 'Lớp học không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
        
    # 1. Check if already enrolled
    if Enrollment.objects.filter(student=user, class_instance=cls, status__in=['ENROLLED', 'APPROVED']).exists():
        return Response({'detail': 'Bạn đã đăng ký lớp này rồi'}, status=status.HTTP_400_BAD_REQUEST)
        
    # 2. Check Capacity
    current_count = Enrollment.objects.filter(class_instance=cls, status__in=['ENROLLED', 'APPROVED']).count()
    if current_count >= cls.max_students:
        return Response({'detail': 'Lớp học đã đầy'}, status=status.HTTP_400_BAD_REQUEST)

    # Get all current enrollments for context
    current_enrollments = Enrollment.objects.filter(
        student=user, 
        class_instance__semester=cls.semester,
        status='ENROLLED'
    ).select_related('class_instance', 'class_instance__course')

    # 3. Check Max Credits (Limit: 25)
    current_credits = sum(e.class_instance.course.credits for e in current_enrollments)
    if current_credits + cls.course.credits > 25:
         return Response({'detail': f'Vượt quá giới hạn tín chỉ (25). Hiện tại: {current_credits}, Thêm: {cls.course.credits}'}, status=status.HTTP_400_BAD_REQUEST)

    # 4. Check Time Conflict
    for enrollment in current_enrollments:
        existing_cls = enrollment.class_instance
        if check_time_overlap(cls.schedule, existing_cls.schedule):
             return Response({
                 'detail': f'Trùng lịch học với môn {existing_cls.course.name_vi} ({existing_cls.class_code})'
             }, status=status.HTTP_400_BAD_REQUEST)

    # 5. Check Prerequisites
    # Find prerequisites for this course
    prereqs = cls.course.prerequisites.all()
    if prereqs.exists():
        # Get user's completed courses
        passed_course_ids = Enrollment.objects.filter(
            student=user,
            status='COMPLETED', 
            grade__grade_letter__in=['A', 'B+', 'B', 'C+', 'C', 'D'] # Assuming D is pass
        ).values_list('class_instance__course_id', flat=True)
        
        missing_prereqs = []
        for p in prereqs:
            if p.id not in passed_course_ids:
                missing_prereqs.append(p.name_vi)
        
        if missing_prereqs:
             return Response({
                 'detail': f'Bạn chưa hoàn thành môn tiên quyết: {", ".join(missing_prereqs)}'
             }, status=status.HTTP_400_BAD_REQUEST)

    # Proceed to enroll
    Enrollment.objects.create(student=user, class_instance=cls, status='ENROLLED')
    
    return Response({'detail': 'Đăng ký thành công', 'class_id': cls.id}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def unenroll_class(request, class_id):
    """
    Cancel enrollment for a class.
    """
    user = request.user
    
    try:
        enrollment = Enrollment.objects.get(
            student=user, 
            class_instance_id=class_id,
            status__in=['ENROLLED', 'APPROVED']
        )
        enrollment.delete() # Or set to DROPPED if we want to keep history
        # For registration phase, hard delete is usually fine.
        return Response({'detail': 'Đã hủy đăng ký'}, status=status.HTTP_200_OK)
    except Enrollment.DoesNotExist:
        return Response({'detail': 'Không tìm thấy đăng ký hợp lệ'}, status=status.HTTP_404_NOT_FOUND)

