from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SiteSetting, Page, Department, StaffMember, News, FAQ, Partner
from .serializers import (
    SiteSettingSerializer, PageSerializer, DepartmentSerializer,
    StaffMemberSerializer, NewsSerializer, NewsLiteSerializer, FAQSerializer, PartnerSerializer
)

class SiteSettingViewSet(viewsets.ViewSet):
    """
    Singleton viewset for Site Settings.
    """
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        settings = SiteSetting.get_settings()
        serializer = SiteSettingSerializer(settings)
        return Response(serializer.data)

class PageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ReadOnly ViewSet for Pages (About, History, etc.)
    """
    queryset = Page.objects.filter(status='PUBLISHED').order_by('menu_order')
    serializer_class = PageSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    lookup_field = 'slug'

class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all().order_by('display_order')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

class StaffMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StaffMember.objects.all().order_by('display_order')
    serializer_class = StaffMemberSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    
    @action(detail=False)
    def leadership(self, request):
        """Filter for leadership team"""
        leaders = self.queryset.filter(staff_type='leadership')
        serializer = self.get_serializer(leaders, many=True)
        return Response(serializer.data)

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = News.objects.filter(status='PUBLISHED').order_by('-published_at')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return NewsSerializer
        return NewsLiteSerializer

    permission_classes = [permissions.AllowAny]
    # Re-enable pagination for the main list
    # pagination_class = None 
    lookup_field = 'slug'
    
    @action(detail=False)
    def featured(self, request):
        """Get featured news"""
        featured = self.queryset.filter(is_featured=True)[:5]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def latest(self, request):
        """Get latest 3 news for Home Page"""
        latest = self.queryset[:3]
        serializer = self.get_serializer(latest, many=True)
        return Response(serializer.data)

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True).order_by('display_order')
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

class PartnerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Partner.objects.filter(is_active=True).order_by('display_order')
    serializer_class = PartnerSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
