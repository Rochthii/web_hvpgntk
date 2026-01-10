"""
Test script for rate limiting.
Attempts to login 6 times within 1 minute to verify LoginThrottle works.
"""
import requests
import time

API_URL = "http://localhost:8000/api/v1/auth/login/"

def test_rate_limiting():
    print("🔒 Testing Rate Limiting on Login Endpoint")
    print(f"URL: {API_URL}")
    print(f"Rate limit: 5 attempts/minute\n")
    
    payload = {
        "email": "test@test.com",
        "password": "wrongpassword"
    }
    
    for i in range(1, 7):
        print(f"Attempt {i}:", end=" ")
        try:
            response = requests.post(API_URL, json=payload, timeout=5)
            
            if response.status_code == 429:
                print(f"❌ THROTTLED (429 Too Many Requests)")
                print(f"   Response: {response.json()}")
                if i == 6:
                    print("\n✅ SUCCESS: Rate limiting works correctly!")
                    print("   6th attempt was blocked as expected.")
                    return True
            else:
                print(f"✓ Allowed (status {response.status_code})")
                
        except requests.exceptions.ConnectionError:
            print("❌ ERROR: Server not running!")
            print("   Please start server: python manage.py runserver")
            return False
        except Exception as e:
            print(f"❌ ERROR: {e}")
            return False
            
        time.sleep(0.1)  # Small delay between requests
    
    print("\n❌ FAILED: All 6 attempts were allowed!")
    print("   Rate limiting is not working properly.")
    return False

if __name__ == "__main__":
    test_rate_limiting()
