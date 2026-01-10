from rest_framework import serializers
from .models import RequestType, StudentRequest, ApprovalLog

class RequestTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestType
        fields = ['id', 'name', 'code', 'description']

class ApprovalLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source='actor.display_name', read_only=True)
    
    class Meta:
        model = ApprovalLog
        fields = ['id', 'actor_name', 'action', 'note', 'created_at']

class StudentRequestSerializer(serializers.ModelSerializer):
    request_type_name = serializers.CharField(source='request_type.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    logs = ApprovalLogSerializer(many=True, read_only=True)

    class Meta:
        model = StudentRequest
        fields = ['id', 'request_type', 'request_type_name', 'title', 'reason', 'attachment', 'status', 'status_display', 'admin_response', 'created_at', 'logs']
        read_only_fields = ['status', 'admin_response', 'student']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['student'] = user
        return super().create(validated_data)
