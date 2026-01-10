from rest_framework import serializers
from .models import AdmissionPeriod, AdmissionApplication

class AdmissionPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionPeriod
        fields = '__all__'

class AdmissionApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionApplication
        fields = '__all__'
        read_only_fields = ['status', 'reviewed_by', 'reviewed_at', 'rejection_reason', 'created_at']
