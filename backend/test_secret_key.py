"""
Test script to verify SECRET_KEY enforcement.
This should fail if DJANGO_SECRET_KEY is not set in environment.
"""
import os
import sys
from pathlib import Path

# Remove DJANGO_SECRET_KEY from environment to test enforcement
os.environ.pop('DJANGO_SECRET_KEY', None)

# Add backend to path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

# Set settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    import django
    django.setup()
    print("❌ ERROR: Server started without SECRET_KEY! This should not happen!")
    sys.exit(1)
except Exception as e:
    if "Missing required environment variable: DJANGO_SECRET_KEY" in str(e):
        print("✅ SUCCESS: Server correctly refused to start without SECRET_KEY")
        print(f"Error message: {e}")
        sys.exit(0)
    else:
        print(f"❌ UNEXPECTED ERROR: {e}")
        sys.exit(1)
