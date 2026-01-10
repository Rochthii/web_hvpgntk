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

class StudentRequestViewSet(viewsets.ModelViewSet):
    """
    Manage student requests.
    """
    serializer_class = StudentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Students see their own requests
        return StudentRequest.objects.filter(student=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Student can cancel their request if it's still PENDING.
        """
        student_request = self.get_object()
        if student_request.status != 'PENDING':
            return Response({'detail': 'Chỉ có thể hủy đơn khi đang chờ xử lý.'}, status=status.HTTP_400_BAD_REQUEST)
        
        student_request.status = 'CANCELLED'
        student_request.save()
        return Response({'detail': 'Đã hủy đơn thành công.'})
