# Django Settings for HVPGNTK
# Học viện Phật giáo Nam tông Khmer
"""
Django settings for hvpgntk project.
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Helper function to enforce required environment variables
def get_required_env(var_name: str) -> str:
    """
    Get required environment variable or raise ImproperlyConfigured.
    This prevents the server from running with insecure defaults.
    """
    value = os.environ.get(var_name)
    if not value:
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured(
            f"Missing required environment variable: {var_name}\n"
            f"Please set {var_name} in your .env file or environment."
        )
    return value


# SECURITY WARNING: keep the secret key used in production secret!
# This will fail if DJANGO_SECRET_KEY is not set - this is intentional!
SECRET_KEY = get_required_env('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_spectacular',
    'django_filters',
    'axes',  # Brute-force protection
    
    # Local apps
    'apps.core',
    'apps.users',
    'apps.cms',
    'apps.admissions',
    'apps.academic',
    'apps.petitions',
    'apps.calendar_app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'axes.middleware.AxesMiddleware',  # Must be after AuthenticationMiddleware
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}


# Custom User Model
AUTH_USER_MODEL = 'users.User'


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# Internationalization
LANGUAGE_CODE = 'vi'
TIME_ZONE = 'Asia/Ho_Chi_Minh'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

# Media files
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'


# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    
    # Rate Limiting (Throttling)
    'DEFAULT_THROTTLE_CLASSES': [
        'apps.core.throttling.BurstUserThrottle',
        'apps.core.throttling.SustainedUserThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'login': '5/minute',           # Login attempts (brute-force protection)
        'strict_anon': '50/hour',      # Anonymous users
        'burst_user': '100/minute',    # Authenticated users (burst)
        'sustained_user': '1000/hour', # Authenticated users (sustained)
    },
}


# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=12),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}


# CORS Settings - Read from environment
CORS_ALLOWED_ORIGINS = os.getenv(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:3000,http://127.0.0.1:3000'
).split(',')

# Add production domain if not in DEBUG mode
if not DEBUG:
    CORS_ALLOWED_ORIGINS.append("https://hocvienphatgiaonamtong.vn")

CORS_ALLOW_CREDENTIALS = True


# API Documentation
SPECTACULAR_SETTINGS = {
    'TITLE': 'HVPGNTK API',
    'DESCRIPTION': 'API cho Học viện Phật giáo Nam tông Khmer',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}


# File Upload Settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10 MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10 MB


# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'formatter': 'verbose',
        },
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
}


# Django Axes - Brute-force Protection
# https://django-axes.readthedocs.io/

AXES_FAILURE_LIMIT = 5  # Lock account after 5 failed attempts
AXES_COOLOFF_TIME = 1   # Lock duration: 1 hour (in hours)
AXES_LOCKOUT_TEMPLATE = None  # Use default lockout response
AXES_LOCKOUT_URL = None
AXES_RESET_ON_SUCCESS = True  # Reset counter on successful login
AXES_ENABLE_ADMIN = True  # Enable admin interface
AXES_VERBOSE = True  # Show detailed error messages

# Lock by username only (not IP) for better UX
# Users can retry from different locations
AXES_LOCK_OUT_BY_COMBINATION_USER_AND_IP = False
AXES_ONLY_USER_FAILURES = True
