from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SiteSettingViewSet, PageViewSet, DepartmentViewSet, 
    StaffMemberViewSet, NewsViewSet, FAQViewSet, PartnerViewSet
)

router = DefaultRouter()
router.register(r'settings', SiteSettingViewSet, basename='settings')
router.register(r'pages', PageViewSet, basename='pages')
router.register(r'departments', DepartmentViewSet, basename='departments')
router.register(r'staff', StaffMemberViewSet, basename='staff')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'faqs', FAQViewSet, basename='faqs')
router.register(r'partners', PartnerViewSet, basename='partners')

urlpatterns = [
    path('', include(router.urls)),
]
