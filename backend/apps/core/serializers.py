from rest_framework import serializers
from .models import Notification
from apps.cms.models import ContactMessage

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'link', 'type', 'is_read', 'created_at']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'sender_name', 'sender_email', 'sender_phone', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']
