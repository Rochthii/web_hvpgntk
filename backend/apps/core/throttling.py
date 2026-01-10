"""
Custom throttling classes for rate limiting.
Protects against brute-force and DDoS attacks.
"""
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class LoginThrottle(AnonRateThrottle):
    """
    Throttle for login attempts.
    Limits to 5 attempts per minute to prevent brute-force attacks.
    """
    scope = 'login'


class StrictAnonThrottle(AnonRateThrottle):
    """
    Strict throttle for anonymous users.
    Limits to 50 requests per hour for unauthenticated users.
    """
    scope = 'strict_anon'


class BurstUserThrottle(UserRateThrottle):
    """
    Burst throttle for authenticated users.
    Limits to 100 requests per minute for short bursts.
    """
    scope = 'burst_user'


class SustainedUserThrottle(UserRateThrottle):
    """
    Sustained throttle for authenticated users.
    Limits to 1000 requests per hour for sustained usage.
    """
    scope = 'sustained_user'
