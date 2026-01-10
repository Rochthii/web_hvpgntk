from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RequestTypeViewSet, StudentRequestViewSet

router = DefaultRouter()
router.register(r'types', RequestTypeViewSet)
router.register(r'requests', StudentRequestViewSet, basename='student-request')

urlpatterns = [
    path('', include(router.urls)),
]
