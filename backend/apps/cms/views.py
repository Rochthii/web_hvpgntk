from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SiteSetting, Page, Department, StaffMember, News, FAQ, Partner
from .serializers import (
    SiteSettingSerializer, PageSerializer, DepartmentSerializer,
    StaffMemberSerializer, NewsSerializer, NewsLiteSerializer, FAQSerializer, PartnerSerializer
)

from apps.core.permissions import CanEditCMS, CanViewCMS

class SiteSettingViewSet(viewsets.ViewSet):
    """
    Singleton viewset for Site Settings.
    """
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        settings = SiteSetting.get_settings()
        serializer = SiteSettingSerializer(settings)
        return Response(serializer.data)

    @action(detail=False, methods=['post', 'patch'], permission_classes=[CanEditCMS])
    def update_settings(self, request):
        settings = SiteSetting.get_settings()
        serializer = SiteSettingSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PageViewSet(viewsets.ModelViewSet):
    """
    Pages Management. Public View / CMS Edit.
    """
    queryset = Page.objects.all().order_by('menu_order')
    serializer_class = PageSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
             return [permissions.AllowAny()]
        return [CanEditCMS()]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by('display_order')
    serializer_class = DepartmentSerializer
    pagination_class = None

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
             return [permissions.AllowAny()]
        return [CanEditCMS()]

class StaffMemberViewSet(viewsets.ModelViewSet):
    queryset = StaffMember.objects.all().order_by('display_order')
    serializer_class = StaffMemberSerializer
    pagination_class = None
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'leadership']:
             return [permissions.AllowAny()]
        return [CanEditCMS()]
    
    @action(detail=False)
    def leadership(self, request):
        """Filter for leadership team"""
        leaders = self.queryset.filter(staff_type='leadership')
        serializer = self.get_serializer(leaders, many=True)
        return Response(serializer.data)

class NewsViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        user = self.request.user
        # Check if user has CMS View permission
        can_view_all = user.is_authenticated and (
            user.role in ['admin', 'abbot', 'teacher', 'content', 'secretary'] or user.is_staff
        )
        if self.action in ['list', 'retrieve'] and not can_view_all:
             return News.objects.filter(status='PUBLISHED').order_by('-published_at')
        return News.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return NewsLiteSerializer
        return NewsSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured', 'latest', 'announcements']:
            return [permissions.AllowAny()]
        return [CanEditCMS()]

    lookup_field = 'slug'
    
    @action(detail=False)
    def featured(self, request):
        """Get featured news"""
        featured = self.get_queryset().filter(is_featured=True)[:5]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def latest(self, request):
        """Get latest 3 news for Home Page"""
        latest = self.get_queryset()[:3]
        serializer = self.get_serializer(latest, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def announcements(self, request):
        """Get urgent announcements (Thông báo quan trọng)"""
        announcements = self.get_queryset().filter(
            is_announcement=True,
            status='PUBLISHED'
        )[:5]
        serializer = self.get_serializer(announcements, many=True)
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
