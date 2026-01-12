from rest_framework import viewsets, permissions, status
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
