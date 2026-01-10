"""
URL patterns for user management.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MonkProfileViewSet, LaypersonProfileViewSet

router = DefaultRouter()
router.register('', UserViewSet, basename='users')
router.register('monks', MonkProfileViewSet, basename='monks')
router.register('laypersons', LaypersonProfileViewSet, basename='laypersons')

urlpatterns = router.urls
