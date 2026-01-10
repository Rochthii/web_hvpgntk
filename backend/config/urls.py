"""
URL configuration for hvpgntk project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

def welcome(request):
    return JsonResponse({
        "status": "online",
        "message": "HVPGNTK API Server is running.",
        "frontend": "http://localhost:5173",
        "docs": "/api/docs/"
    })

urlpatterns = [
    # Root
    path('', welcome),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include([
        path('auth/', include('apps.users.urls')),
        path('users/', include('apps.users.urls_users')),
        path('admissions/', include('apps.admissions.urls')),
        path('academic/', include('apps.academic.urls')),
        path('cms/', include('apps.cms.urls')),
        path('core/', include('apps.core.urls')),
        path('approvals/', include('apps.approvals.urls')),
        path('petitions/', include('apps.petitions.urls')),
        path('calendar/', include('apps.calendar_app.urls')),
    ])),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
