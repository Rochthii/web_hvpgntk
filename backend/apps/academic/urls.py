"""Academic URLs - To be implemented"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AcademicYearViewSet, SemesterViewSet, CourseViewSet,
    ClassViewSet, EnrollmentViewSet, GradeViewSet, ExamScheduleViewSet
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
    path('', include(router.urls)),
]
