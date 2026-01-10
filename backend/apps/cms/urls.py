"""CMS URLs - To be implemented"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SiteSettingViewSet, PageViewSet, DepartmentViewSet,
    StaffMemberViewSet, NewsViewSet, FAQViewSet, PartnerViewSet
)

router = DefaultRouter()
router.register(r'settings', SiteSettingViewSet, basename='settings')
router.register(r'pages', PageViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'staff', StaffMemberViewSet)
router.register(r'news', NewsViewSet)
router.register(r'faqs', FAQViewSet)
router.register(r'partners', PartnerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
