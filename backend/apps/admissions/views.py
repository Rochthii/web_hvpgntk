from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AdmissionPeriod, AdmissionApplication
from .serializers import AdmissionPeriodSerializer, AdmissionApplicationSerializer
from rest_framework import viewsets, permissions, status

class AdmissionPeriodViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API for viewing Admission Periods
    """
    queryset = AdmissionPeriod.objects.all()
    serializer_class = AdmissionPeriodSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get the currently open or upcoming admission period"""
        # Priority: OPEN -> UPCOMING -> Most Recent
        period = AdmissionPeriod.objects.filter(status='OPEN').first()
        if not period:
            period = AdmissionPeriod.objects.filter(status='UPCOMING').order_by('application_start_date').first()
        if not period:
            period = AdmissionPeriod.objects.order_by('-created_at').first()
            
        if period:
            serializer = self.get_serializer(period)
            return Response(serializer.data)
        return Response(None)

class AdmissionApplicationViewSet(viewsets.ModelViewSet):
    """
    API for submitting Admission Applications
    """
    queryset = AdmissionApplication.objects.all()
    serializer_class = AdmissionApplicationSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        # Optional: Add logic to check if AdmissionPeriod is currently open
        return super().create(request, *args, **kwargs)
