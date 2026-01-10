
import os
import django
import sys

# Setup Django Environment
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.users.models import User
from apps.users.serializers import LoginSerializer

def check_login():
    email = "student@hvpg.edu.vn"
    password = "123456" # Default from seed_data

    print(f"Checking login for: {email} / {password}")

    try:
        user = User.objects.get(email=email)
        print(f"User found: {user.email} (Active: {user.is_active})")
        
        if user.check_password(password):
             print("SUCCESS: user.check_password() returned True.")
        else:
             print("FAILURE: user.check_password() returned False.")

        # Test Serializer Logic
        print("-" * 20)
        print("Testing Serializer Validation...")
        serializer = LoginSerializer(data={'email': email, 'password': password})
        if serializer.is_valid():
            print("SUCCESS: Serializer valid.")
            print("Validated Data:", serializer.validated_data.keys())
        else:
            print("FAILURE: Serializer invalid.")
            print(serializer.errors)

    except User.DoesNotExist:
        print(f"FAILURE: User {email} does not exist.")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check_login()
