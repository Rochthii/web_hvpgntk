from rest_framework import viewsets, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os

from .models import Notification
from apps.cms.models import ContactMessage
from .serializers import NotificationSerializer, ContactMessageSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for user notifications (read-only).
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read."""
        self.get_queryset().filter(is_read=False).update(
            is_read=True,
            read_at=timezone.now()
        )
        return Response({'status': 'all_read'})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a single notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        return Response({'status': 'read'})


class DashboardStatsView(APIView):
    """
    View for dashboard statistics.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from apps.cms.models import News
        from apps.academic.models import Student

        stats = {
            'total_news': News.objects.filter(status='published').count(),
            'total_students': Student.objects.filter(status='ENROLLED').count(),
            'pending_news': News.objects.filter(status='draft').count(),
        }
        return Response(stats)


class ContactMessageView(APIView):
    """
    Public API for contact form submissions.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ip_address=request.META.get('REMOTE_ADDR'))
            return Response(
                {'message': 'Tin nhắn đã được gửi thành công!'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicFileUploadView(APIView):
    """
    Public file upload endpoint (for forms, attachments).
    """
    permission_classes = [permissions.AllowAny]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file size (max 10MB)
        max_size = 10 * 1024 * 1024
        if file.size > max_size:
            return Response(
                {'error': 'File too large. Maximum 10MB.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Save to storage
            filename = f"uploads/{file.name}"
            path = default_storage.save(filename, ContentFile(file.read()))
            url = default_storage.url(path)

            return Response({
                'url': url,
                'filename': file.name
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ImageUploadView(APIView):
    """
    API endpoint for uploading images to Supabase storage.
    Used by RichTextEditor for inline image uploads.
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
    def post(self, request):
        file = request.FILES.get('file')
        
        if not file:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if file.content_type not in allowed_types:
            return Response(
                {'error': 'Invalid file type. Only images allowed.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (max 5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        if file.size > max_size:
            return Response(
                {'error': 'File too large. Maximum size is 5MB.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Generate unique filename
            ext = os.path.splitext(file.name)[1]
            filename = f"editor/{request.user.id}/{file.name}"
            
            # Save to Supabase via Django storage
            path = default_storage.save(filename, ContentFile(file.read()))
            url = default_storage.url(path)
            
            return Response({
                'url': url,
                'filename': file.name
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
