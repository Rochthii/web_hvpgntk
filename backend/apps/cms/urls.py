from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SiteSettingViewSet, PageViewSet, DepartmentViewSet, 
    StaffMemberViewSet, NewsViewSet, FAQViewSet, PartnerViewSet,
    ContactMessageViewSet, HistoryMilestoneViewSet
)

router = DefaultRouter()
router.register(r'settings', SiteSettingViewSet, basename='settings')
router.register(r'pages', PageViewSet, basename='pages')
router.register(r'departments', DepartmentViewSet, basename='departments')
router.register(r'staff', StaffMemberViewSet, basename='staff')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'faqs', FAQViewSet, basename='faqs')
router.register(r'partners', PartnerViewSet)
router.register(r'contact', ContactMessageViewSet)
router.register(r'history-milestones', HistoryMilestoneViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
