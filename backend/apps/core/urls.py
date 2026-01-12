from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, DashboardStatsView, ContactMessageView, PublicFileUploadView


router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('contact/', ContactMessageView.as_view(), name='contact-message'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('upload/', PublicFileUploadView.as_view(), name='public-file-upload'),
]
