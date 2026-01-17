
from rest_framework import serializers
from .models import SiteSetting, Banner, Page, Department, StaffMember, News, FAQ, Partner, ContactMessage, HistoryMilestone
from apps.core.sanitize import sanitize_html


class BilingualSerializerMixin:
    """
    Mixin to dynamically return correct language field based on request
    """
    def get_lang(self):
        """Get language from request context"""
        request = self.context.get('request')
        if request:
            # Get from Accept-Language header (sent by i18next)
            lang = request.META.get('HTTP_ACCEPT_LANGUAGE', 'vi')
            if 'km' in lang.lower():
                return 'km'
        return 'vi'
    
    def get_localized_field(self, obj, field_name):
        """Get field in correct language"""
        lang = self.get_lang()
        localized_field = f"{field_name}_{lang}"
        value = getattr(obj, localized_field, None)
        
        # Fallback to Vietnamese if Khmer is empty
        if not value and lang == 'km':
            value = getattr(obj, f"{field_name}_vi", "")
        
        return value or ""


class SiteSettingSerializer(BilingualSerializerMixin, serializers.ModelSerializer):
    site_name = serializers.SerializerMethodField()
    site_slogan = serializers.SerializerMethodField()
    footer_text = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteSetting
        fields = '__all__'
    
    def get_site_name(self, obj):
        return self.get_localized_field(obj, 'site_name')
    
    def get_site_slogan(self, obj):
        return self.get_localized_field(obj, 'site_slogan')
    
    def get_footer_text(self, obj):
        return self.get_localized_field(obj, 'footer_text')


class BannerSerializer(BilingualSerializerMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    
    class Meta:
        model = Banner
        fields = '__all__'
    
    def get_title(self, obj):
        return self.get_localized_field(obj, 'title')
    
    def get_subtitle(self, obj):
        return self.get_localized_field(obj, 'subtitle')


class PageSerializer(BilingualSerializerMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    
    class Meta:
        model = Page
        fields = '__all__'
    
    def get_title(self, obj):
        return self.get_localized_field(obj, 'title')
    
    def get_content(self, obj):
        return self.get_localized_field(obj, 'content')
    
    def get_excerpt(self, obj):
        return self.get_localized_field(obj, 'excerpt')
    
    def validate_content_vi(self, value):
        """Sanitize Vietnamese content to prevent XSS"""
        return sanitize_html(value)
    
    def validate_content_km(self, value):
        """Sanitize Khmer content to prevent XSS"""
        return sanitize_html(value)


class DepartmentSerializer(BilingualSerializerMixin, serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = '__all__'
    
    def get_name(self, obj):
        return self.get_localized_field(obj, 'name')
    
    def get_description(self, obj):
        return self.get_localized_field(obj, 'description')


class StaffMemberSerializer(BilingualSerializerMixin, serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    
    class Meta:
        model = StaffMember
        fields = '__all__'
    
    def get_display_name(self, obj):
        return self.get_localized_field(obj, 'display_name')
    
    def get_title(self, obj):
        return self.get_localized_field(obj, 'title')
    
    def get_bio(self, obj):
        return self.get_localized_field(obj, 'bio')


class NewsSerializer(BilingualSerializerMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    
    class Meta:
        model = News
        fields = '__all__'
    
    def get_title(self, obj):
        return self.get_localized_field(obj, 'title')
    
    def get_excerpt(self, obj):
        return self.get_localized_field(obj, 'excerpt')
    
    def get_content(self, obj):
        return self.get_localized_field(obj, 'content')
    
    def get_category(self, obj):
        return self.get_localized_field(obj, 'category')
    
    def validate_content_vi(self, value):
        """Sanitize Vietnamese content to prevent XSS"""
        return sanitize_html(value)
    
    def validate_content_km(self, value):
        """Sanitize Khmer content to prevent XSS"""
        return sanitize_html(value)
    
    def validate_excerpt_vi(self, value):
        """Sanitize Vietnamese excerpt"""
        return sanitize_html(value)
    
    def validate_excerpt_km(self, value):
        """Sanitize Khmer excerpt"""
        return sanitize_html(value)


class NewsLiteSerializer(BilingualSerializerMixin, serializers.ModelSerializer):
    """Lighter serializer for list views"""
    title = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    
    class Meta:
        model = News
        fields = ['id', 'slug', 'featured_image_url', 'published_at', 'category', 'view_count', 'title', 'excerpt']
    
    def get_title(self, obj):
        return self.get_localized_field(obj, 'title')
    
    def get_excerpt(self, obj):
        return self.get_localized_field(obj, 'excerpt')


class HistoryMilestoneSerializer(BilingualSerializerMixin, serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    
    class Meta:
        model = HistoryMilestone
        fields = ['id', 'year', 'image', 'display_order', 'title', 'description']
        read_only_fields = ['id', 'created_at']
    
    def get_title(self, obj):
        return self.get_localized_field(obj, 'title')
    
    def get_description(self, obj):
        return self.get_localized_field(obj, 'description')


class FAQSerializer(BilingualSerializerMixin, serializers.ModelSerializer):
    question = serializers.SerializerMethodField()
    answer = serializers.SerializerMethodField()
    
    class Meta:
        model = FAQ
        fields = '__all__'
    
    def get_question(self, obj):
        return self.get_localized_field(obj, 'question')
    
    def get_answer(self, obj):
        return self.get_localized_field(obj, 'answer')


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'sender_name', 'sender_email', 'sender_phone', 'subject', 'message', 'created_at']


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = '__all__'
