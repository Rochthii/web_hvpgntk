"""Academic URLs - To be implemented"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AcademicYearViewSet, SemesterViewSet, CourseViewSet,
    ClassViewSet, EnrollmentViewSet, GradeViewSet, ExamScheduleViewSet,
    get_student_stats, get_my_schedule, get_my_grades,
    get_available_classes, enroll_class, unenroll_class
)

router = DefaultRouter()
router.register(r'years', AcademicYearViewSet)
router.register(r'semesters', SemesterViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'classes', ClassViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'grades', GradeViewSet)
router.register(r'exams', ExamScheduleViewSet)

urlpatterns = [
    path('student/stats/', get_student_stats, name='student-stats'),
    path('student/schedule/', get_my_schedule, name='student-schedule'),
    path('student/grades/', get_my_grades, name='student-grades'),
    
    # Registration logic
    path('registration/available-classes/', get_available_classes, name='available-classes'),
    path('registration/enroll/', enroll_class, name='enroll-class'),
    path('registration/unenroll/<int:class_id>/', unenroll_class, name='unenroll-class'),

    path('', include(router.urls)),
]
