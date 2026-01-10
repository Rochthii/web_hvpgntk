from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import RequestType, StudentRequest
from .serializers import RequestTypeSerializer, StudentRequestSerializer

class RequestTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List available request types.
    """
    queryset = RequestType.objects.filter(is_active=True)
    serializer_class = RequestTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

from apps.core.permissions import CanApprovePetitions

class StudentRequestViewSet(viewsets.ModelViewSet):
    """
    Manage student requests.
    """
    serializer_class = StudentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Logic view access: Student view own, Staff/Admin view all
        if user.is_staff or getattr(user, 'role', '') in ['admin', 'abbot', 'teacher', 'approval_board', 'secretary']:
            return StudentRequest.objects.all().order_by('-created_at')
        return StudentRequest.objects.filter(student=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        student_request = self.get_object()
        if student_request.student != request.user:
             return Response({'detail': 'Không có quyền hủy đơn này.'}, status=status.HTTP_403_FORBIDDEN)
        
        if student_request.status != 'PENDING':
            return Response({'detail': 'Chỉ có thể hủy đơn khi đang chờ xử lý.'}, status=status.HTTP_400_BAD_REQUEST)
        
        student_request.status = 'CANCELLED'
        student_request.save()
        return Response({'detail': 'Đã hủy đơn thành công.'})

    @action(detail=True, methods=['post'], permission_classes=[CanApprovePetitions])
    def approve(self, request, pk=None):
        student_request = self.get_object()
        student_request.status = 'APPROVED'
        student_request.admin_response = request.data.get('note', '')
        student_request.save()
        return Response({'detail': 'Đã duyệt đơn.'})

    @action(detail=True, methods=['post'], permission_classes=[CanApprovePetitions])
    def reject(self, request, pk=None):
        student_request = self.get_object()
        student_request.status = 'REJECTED'
        student_request.admin_response = request.data.get('reason', '')
        student_request.save()
        return Response({'detail': 'Đã từ chối đơn.'})
