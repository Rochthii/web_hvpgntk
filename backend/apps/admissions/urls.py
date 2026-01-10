from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdmissionPeriodViewSet, AdmissionApplicationViewSet

router = DefaultRouter()
router.register(r'periods', AdmissionPeriodViewSet, basename='admission-period')
router.register(r'applications', AdmissionApplicationViewSet, basename='admission-application')

urlpatterns = [
    path('', include(router.urls)),
]
