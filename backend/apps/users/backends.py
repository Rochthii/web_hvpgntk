from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class MultiFieldModelBackend(ModelBackend):
    """
    Authentication backend that allows users to login with:
    - Username (Student Code / Staff Code)
    - Email
    - Phone Number
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get('email') or kwargs.get('phone') or kwargs.get('login_id')
        
        if not username:
            return None

        try:
            # Check if input looks like an email
            if '@' in username:
                user = User.objects.get(email=username)
            else:
                # Try to find user by username OR phone
                # Using Q objects prevents SQL injection and allows OR logic
                user = User.objects.get(
                    Q(username__iexact=username) | 
                    Q(phone=username)
                )
        except User.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a non-existing user (#20760)
            User().set_password(password)
            return None
        except User.MultipleObjectsReturned:
            # Should not happen if unique constraints are set, but handle safely
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
