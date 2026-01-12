"""
Petitions Serializers
"""
from rest_framework import serializers
from .models import PetitionType, Petition, PetitionHistory
from apps.users.serializers import UserSerializer


class PetitionTypeSerializer(serializers.ModelSerializer):
    """Serializer for PetitionType model."""
    
    class Meta:
        model = PetitionType
        fields = [
            'id', 'name', 'code', 'description',
            'requires_approval_from', 'auto_approve',
            'max_processing_days', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PetitionHistorySerializer(serializers.ModelSerializer):
    """Serializer for PetitionHistory model."""
    
    actor_detail = UserSerializer(source='actor', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = PetitionHistory
        fields = [
            'id', 'petition', 'actor', 'actor_detail',
            'action', 'action_display', 'note', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


class PetitionSerializer(serializers.ModelSerializer):
    """Serializer for Petition model."""
    
    petitioner_detail = UserSerializer(source='petitioner', read_only=True)
    petition_type_detail = PetitionTypeSerializer(source='petition_type', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    history = PetitionHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Petition
        fields = [
            'id', 'petitioner', 'petitioner_detail',
            'petition_type', 'petition_type_detail',
            'title', 'reason',
            'attachment', 'attachment_url',
            'status', 'status_display',
            'submitted_at', 'processed_at', 'processing_deadline',
            'admin_response', 'final_decision',
            'history',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'petitioner', 'submitted_at', 'processed_at',
            'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        # Auto-assign petitioner from request user
        validated_data['petitioner'] = self.context['request'].user
        return super().create(validated_data)


class PetitionCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating petitions (student-facing)."""
    
    class Meta:
        model = Petition
        fields = [
            'petition_type', 'title', 'reason',
            'attachment', 'attachment_url'
        ]
    
    def create(self, validated_data):
        validated_data['petitioner'] = self.context['request'].user
        validated_data['status'] = 'DRAFT'
        return super().create(validated_data)


class PetitionApprovalSerializer(serializers.Serializer):
    """Serializer for approving/rejecting petitions."""
    
    action = serializers.ChoiceField(choices=['APPROVE', 'REJECT'])
    note = serializers.CharField(required=False, allow_blank=True)
    final_decision = serializers.CharField(required=False, allow_blank=True)
