from rest_framework import viewsets, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Notification
from .models import Notification
from apps.cms.models import ContactMessage
from .serializers import NotificationSerializer, ContactMessageSerializer
from rest_framework import generics

# Import models
from apps.users.models import User
from apps.petitions.models import Petition
from apps.cms.models import News
from rest_framework.views import APIView

from apps.core.models import AuditLog
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os
import uuid

class PublicFileUploadView(APIView):
    """
    API for uploading files publicly (for Admissions)
    """
    permission_classes = [permissions.AllowAny]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=400)

        # 1. Validate Size (< 5MB)
        if file_obj.size > 5 * 1024 * 1024:
            return Response({'error': 'File too large (Max 5MB)'}, status=400)

        # 2. Validate Extension
        ext = os.path.splitext(file_obj.name)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.pdf']:
            return Response({'error': 'Invalid file type. Only JPG, PNG, PDF allowed.'}, status=400)

        # 3. Save File
        # Path: uploads/admissions/{year}/{uuid}{ext}
        filename = f"{uuid.uuid4()}{ext}"
        save_path = f"uploads/admissions/{filename}"
        
        path = default_storage.save(save_path, ContentFile(file_obj.read()))
        
        # FIX: Use storage.url() to get the correct URL (Supabase or Local)
        # detailed comparison: 
        # Old: full_url = request.build_absolute_uri(settings.MEDIA_URL + path) -> Points to Django server (404)
        # New: full_url = default_storage.url(path) -> Points to Supabase (200)
        full_url = default_storage.url(path)
        
        return Response({
            'url': full_url,
            'path': path
        })

class ContactMessageView(generics.CreateAPIView):
    """
    API for submitting contact messages (Public)
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = ContactMessageSerializer
    queryset = ContactMessage.objects.all()

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        recent_activities = []
        logs = AuditLog.objects.select_related('user').order_by('-created_at')[:5]
        for log in logs:
            user_name = log.user.display_name if log.user else 'System'
            recent_activities.append({
                'id': log.id,
                'text': f"{user_name} {log.action} {log.resource_type}",
                'time': log.created_at
            })

        # Fallback if no logs, use petitions
        if not recent_activities:
            latest_petitions = Petition.objects.all().order_by('-created_at')[:5]
            for petition in latest_petitions:
                recent_activities.append({
                    'id': petition.id,
                    'text': f"{petition.petitioner.get_display_name()} gửi đơn {petition.title}",
                    'time': petition.created_at
                })

        return Response({
            'total_students': User.objects.filter(role='STUDENT').count(),
            'pending_requests': Petition.objects.filter(status__in=['SUBMITTED', 'IN_REVIEW']).count(),
            'processed_requests': Petition.objects.filter(status__in=['APPROVED', 'REJECTED']).count(),
            'total_news': News.objects.count(),
            'recent_activities': recent_activities
        })

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        return Response({'status': 'read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(
            is_read=True, 
            read_at=timezone.now()
        )
        return Response({'status': 'all_read'})
