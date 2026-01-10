from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AdmissionPeriod
from .serializers import AdmissionPeriodSerializer

class AdmissionPeriodViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API for viewing Admission Periods
    """
    queryset = AdmissionPeriod.objects.all()
    serializer_class = AdmissionPeriodSerializer
    
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
