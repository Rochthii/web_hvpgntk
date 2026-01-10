from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdmissionPeriodViewSet

router = DefaultRouter()
router.register(r'periods', AdmissionPeriodViewSet, basename='admission-period')

urlpatterns = [
    path('', include(router.urls)),
]
