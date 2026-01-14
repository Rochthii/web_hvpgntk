
from rest_framework import serializers
from .models import SiteSetting, Page, Department, StaffMember, News, FAQ, Partner, ContactMessage, HistoryMilestone

class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class StaffMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffMember
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'sender_name', 'sender_email', 'sender_phone', 'subject', 'message', 'created_at']

class HistoryMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryMilestone
        fields = ['id', 'year', 'title_vi', 'title_km', 'description_vi', 'description_km', 'image', 'display_order']
        read_only_fields = ['id', 'created_at']

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'

class NewsLiteSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views"""
    class Meta:
        model = News
        fields = ['id', 'title_vi', 'slug', 'excerpt_vi', 'featured_image_url', 'published_at', 'category', 'view_count']

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = '__all__'
