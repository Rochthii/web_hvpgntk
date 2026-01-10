from rest_framework import serializers
from .models import AdmissionPeriod, AdmissionApplication

class AdmissionPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionPeriod
        fields = '__all__'
