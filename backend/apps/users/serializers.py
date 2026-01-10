"""
Serializers for User models.
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, MonkProfile, LaypersonProfile


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'user_type', 'role',
            'is_active', 'is_verified', 'preferred_language',
            'display_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_display_name(self, obj):
        return obj.get_display_name()


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'phone', 'password', 'password_confirm',
            'user_type', 'role', 'preferred_language'
        ]
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'Mật khẩu xác nhận không khớp'
            })
        
        if not attrs.get('email') and not attrs.get('phone'):
            raise serializers.ValidationError(
                'Phải có email hoặc số điện thoại'
            )
        
        attrs.pop('password_confirm')
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False)
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        phone = attrs.get('phone')
        password = attrs.get('password')
        
        if not email and not phone:
            raise serializers.ValidationError(
                'Phải có email hoặc số điện thoại'
            )
        
        # Find user by email or phone
        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError('Thông tin đăng nhập không đúng')
        else:
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                raise serializers.ValidationError('Thông tin đăng nhập không đúng')
        
        if not user.check_password(password):
            raise serializers.ValidationError('Thông tin đăng nhập không đúng')
        
        if not user.is_active:
            raise serializers.ValidationError('Tài khoản đã bị khóa')
        
        attrs['user'] = user
        return attrs


class MonkProfileSerializer(serializers.ModelSerializer):
    """Serializer for MonkProfile."""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = MonkProfile
        fields = '__all__'
        read_only_fields = ['id', 'vassa_count', 'vassa_updated_at', 'created_at', 'updated_at']


class MonkProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating MonkProfile."""
    
    class Meta:
        model = MonkProfile
        exclude = ['user', 'vassa_count', 'vassa_updated_at']


class LaypersonProfileSerializer(serializers.ModelSerializer):
    """Serializer for LaypersonProfile."""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = LaypersonProfile
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class LaypersonProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating LaypersonProfile."""
    
    class Meta:
        model = LaypersonProfile
        exclude = ['user']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Mật khẩu xác nhận không khớp'
            })
        return attrs
