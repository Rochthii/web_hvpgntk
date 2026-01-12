"""
Petitions URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PetitionTypeViewSet, PetitionViewSet

router = DefaultRouter()
router.register(r'types', PetitionTypeViewSet, basename='petition-type')
router.register(r'', PetitionViewSet, basename='petition')

urlpatterns = [
    path('', include(router.urls)),
]
