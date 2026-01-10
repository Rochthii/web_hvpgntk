"""
Views for User authentication and profiles.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone

from .models import User, MonkProfile, LaypersonProfile
from .serializers import (
    UserSerializer, UserCreateSerializer, LoginSerializer,
    MonkProfileSerializer, MonkProfileCreateSerializer,
    LaypersonProfileSerializer, LaypersonProfileCreateSerializer,
    ChangePasswordSerializer
)


class LoginView(APIView):
    """API endpoint for user login."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Update last login
        user.last_login_at = timezone.now()
        user.save(update_fields=['last_login_at'])
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        })


class LogoutView(APIView):
    """API endpoint for user logout."""
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'detail': 'Đăng xuất thành công'})
        except Exception:
            return Response(
                {'detail': 'Token không hợp lệ'},
                status=status.HTTP_400_BAD_REQUEST
            )


class MeView(APIView):
    """API endpoint for current user info."""
    
    def get(self, request):
        return Response(UserSerializer(request.user).data)
    
    def patch(self, request):
        serializer = UserSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(APIView):
    """API endpoint for password change."""
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'old_password': 'Mật khẩu cũ không đúng'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({'detail': 'Đổi mật khẩu thành công'})


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User CRUD operations."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        """Get user profile based on user_type."""
        user = self.get_object()
        
        if user.user_type == User.UserType.MONK:
            try:
                profile = user.monk_profile
                serializer = MonkProfileSerializer(profile)
            except MonkProfile.DoesNotExist:
                return Response(
                    {'detail': 'Profile không tồn tại'},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            try:
                profile = user.layperson_profile
                serializer = LaypersonProfileSerializer(profile)
            except LaypersonProfile.DoesNotExist:
                return Response(
                    {'detail': 'Profile không tồn tại'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(serializer.data)


class MonkProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for MonkProfile CRUD operations."""
    
    queryset = MonkProfile.objects.select_related('user').all()
    serializer_class = MonkProfileSerializer
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MonkProfileCreateSerializer
        return MonkProfileSerializer
    
    def get_queryset(self):
        qs = super().get_queryset()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        
        # Filter by cohort
        cohort = self.request.query_params.get('cohort')
        if cohort:
            qs = qs.filter(cohort=cohort)
        
        # Search by name
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(dharma_name_khmer__icontains=search)
        
        return qs


class LaypersonProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for LaypersonProfile CRUD operations."""
    
    queryset = LaypersonProfile.objects.select_related('user').all()
    serializer_class = LaypersonProfileSerializer
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return LaypersonProfileCreateSerializer
        return LaypersonProfileSerializer
    
    def get_queryset(self):
        qs = super().get_queryset()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        
        # Search by name
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(full_name__icontains=search)
        
        return qs
