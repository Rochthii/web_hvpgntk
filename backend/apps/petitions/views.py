"""
Petitions Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q

from .models import PetitionType, Petition, PetitionHistory
from .serializers import (
    PetitionTypeSerializer,
    PetitionSerializer,
    PetitionCreateSerializer,
    PetitionApprovalSerializer
)
from apps.core.permissions import CanApprovePetitions
from apps.users.models import User


class PetitionTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for PetitionType.
    Students can view active types, admins can manage.
    """
    queryset = PetitionType.objects.all()
    serializer_class = PetitionTypeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Students only see active types
        if self.request.user.role == User.Role.STUDENT:
            queryset = queryset.filter(is_active=True)
        return queryset


class PetitionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Petition management.
    
    Students can:
    - Create petitions (draft)
    - View their own petitions
    - Submit petitions
    - Cancel petitions
    
    Admins/Teachers can:
    - View all petitions
    - Approve/reject petitions
    - Add comments
    """
    queryset = Petition.objects.select_related(
        'petitioner', 'petition_type'
    ).prefetch_related('history')
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PetitionCreateSerializer
        return PetitionSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Students only see their own petitions
        if user.role == User.Role.STUDENT:
            queryset = queryset.filter(petitioner=user)
        # Teachers/admins see all
        elif user.role in [User.Role.ADMIN, User.Role.ABBOT, User.Role.TEACHER, User.Role.ADMISSION]:
            # Can filter by status
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        petition = serializer.save(petitioner=self.request.user)
        # Log creation
        PetitionHistory.objects.create(
            petition=petition,
            actor=self.request.user,
            action='SUBMITTED' if petition.status == 'SUBMITTED' else 'VIEWED',
            note='Petition created'
        )
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit a draft petition."""
        petition = self.get_object()
        
        if petition.petitioner != request.user:
            return Response(
                {'error': 'Only petition owner can submit'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if petition.status != 'DRAFT':
            return Response(
                {'error': 'Only draft petitions can be submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        petition.status = 'SUBMITTED'
        petition.submitted_at = timezone.now()
        petition.save()
        
        # Log submission
        PetitionHistory.objects.create(
            petition=petition,
            actor=request.user,
            action='SUBMITTED',
            note='Petition submitted for review'
        )
        
        serializer = self.get_serializer(petition)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[CanApprovePetitions])
    def review(self, request, pk=None):
        """Admin/Teacher review action."""
        petition = self.get_object()
        serializer = PetitionApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action_type = serializer.validated_data['action']
        note = serializer.validated_data.get('note', '')
        final_decision = serializer.validated_data.get('final_decision', '')
        
        if action_type == 'APPROVE':
            petition.status = 'APPROVED'
            petition.processed_at = timezone.now()
            petition.final_decision = final_decision or 'Approved'
            history_action = 'APPROVED'
        else:  # REJECT
            petition.status = 'REJECTED'
            petition.processed_at = timezone.now()
            petition.admin_response = note
            petition.final_decision = final_decision or 'Rejected'
            history_action = 'REJECTED'
        
        petition.save()
        
        # Log approval/rejection
        PetitionHistory.objects.create(
            petition=petition,
            actor=request.user,
            action=history_action,
            note=note or f'Petition {action_type.lower()}ed by {request.user.get_display_name()}'
        )
        
        serializer = PetitionSerializer(petition)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Student cancels their own petition."""
        petition = self.get_object()
        
        if petition.petitioner != request.user:
            return Response(
                {'error': 'Only petition owner can cancel'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if petition.status in ['APPROVED', 'REJECTED']:
            return Response(
                {'error': 'Cannot cancel processed petitions'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        petition.status = 'CANCELLED'
        petition.save()
        
        # Log cancellation
        PetitionHistory.objects.create(
            petition=petition,
            actor=request.user,
            action='CANCELLED',
            note='Petition cancelled by student'
        )
        
        serializer = self.get_serializer(petition)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[CanApprovePetitions])
    def add_comment(self, request, pk=None):
        """Admin/Teacher adds comment to petition."""
        petition = self.get_object()
        note = request.data.get('note', '')
        
        if not note:
            return Response(
                {'error': 'Comment cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update petition to in_review if not already
        if petition.status == 'SUBMITTED':
            petition.status = 'IN_REVIEW'
            petition.save()
        
        # Log comment
        PetitionHistory.objects.create(
            petition=petition,
            actor=request.user,
            action='COMMENTED',
            note=note
        )
        
        serializer = self.get_serializer(petition)
        return Response(serializer.data)
