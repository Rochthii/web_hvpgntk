# Auth URL Structure Documentation

**Date**: 2026-01-12  
**Purpose**: Giải thích tại sao users app có 2 file URLs riêng biệt

---

## Overview

App `users` sử dụng 2 URL pattern files:
- [`apps/users/urls.py`](file:///e:/web_HVPGNTK/backend/apps/users/urls.py) → mounted at `/api/v1/auth/`
- [`apps/users/urls_users.py`](file:///e:/web_HVPGNTK/backend/apps/users/urls_users.py) → mounted at `/api/v1/users/`

## URL Structure

```
/api/v1/
├── auth/              ← urls.py (Authentication endpoints)
│   ├── POST /login/
│   ├── POST /register/
│   ├── POST /refresh/
│   └── POST /logout/
│
└── users/             ← urls_users.py (User CRUD endpoints)
    ├── GET    /users/           # List users
    ├── POST   /users/           # Create user
    ├── GET    /users/{id}/      # Get user detail
    ├── PUT    /users/{id}/      # Update user
    ├── PATCH  /users/{id}/      # Partial update
    └── DELETE /users/{id}/      # Delete user
```

## Rationale

### 1. Separation of Concerns

| Concern | Auth (`/auth/`) | User Management (`/users/`) |
|---------|-----------------|----------------------------|
| **Purpose** | Session management | User CRUD operations |
| **Actions** | Login, Logout, Refresh tokens | Create, Read, Update, Delete users |
| **Permissions** | Public (login/register), Authenticated (logout) | Admin only |
| **Response** | Tokens (JWT) | User objects |

### 2. Security Boundaries

**Auth endpoints** (`/auth/`):
- Some are **public** (login, register)
- Some require **authentication** (logout, refresh)
- Không nên mix với protected admin endpoints

**User CRUD endpoints** (`/users/`):
- ALL require **authentication**
- Most require **admin role**
- Clear boundary cho admin features

### 3. RESTful Convention

```
# ❌ Anti-pattern: Mixed concerns
/api/v1/users/login/          # Không RESTful
/api/v1/users/register/       # Không RESTful
/api/v1/users/{id}/           # RESTful

# ✅ Current pattern: Clear separation
/api/v1/auth/login/           # Clear purpose
/api/v1/auth/register/        # Clear purpose
/api/v1/users/{id}/           # RESTful
```

### 4. Scalability

Tách riêng giúp:
- Dễ thêm OAuth providers (`/auth/google/`, `/auth/facebook/`)
- Dễ versioning riêng (`/auth/v2/` vs `/users/v2/`)
- Dễ rate limiting khác nhau (auth endpoints cần stricter throttling)

## Implementation Details

### Main URL Router

[`config/urls.py`](file:///e:/web_HVPGNTK/backend/config/urls.py):
```python
urlpatterns = [
    path('api/v1/', include([
        path('auth/', include('apps.users.urls')),          # Authentication
        path('users/', include('apps.users.urls_users')),   # User CRUD
        # ... other apps
    ])),
]
```

### Auth URLs

[`apps/users/urls.py`](file:///e:/web_HVPGNTK/backend/apps/users/urls.py):
```python
urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
```

### User CRUD URLs

[`apps/users/urls_users.py`](file:///e:/web_HVPGNTK/backend/apps/users/urls_users.py):
```python
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = router.urls
```

## Comparison with Alternatives

### Alternative 1: Single `urls.py` với prefix

```python
# ❌ Không rõ ràng
urlpatterns = [
    path('auth/login/', ...),
    path('auth/register/', ...),
    path('', UserViewSet.as_view(...)),  # Confusing!
]
```

### Alternative 2: Nested routes

```python
# ❌ Không RESTful
urlpatterns = [
    path('users/auth/login/', ...),   # users/auth? weird
    path('users/', UserViewSet...),
]
```

### Current approach: Separate files ✅

```python
# ✅ Clear, scalable, RESTful
/api/v1/auth/     → users/urls.py
/api/v1/users/    → users/urls_users.py
```

## Related Apps

Các apps khác cũng có thể áp dụng pattern tương tự nếu cần:

```
apps/admissions/
├── urls.py              # Public admission info
└── urls_admin.py        # Admin admission management

apps/academic/
├── urls.py              # Student course viewing
└── urls_teacher.py      # Teacher course management
```

## Recommendation

**✅ Giữ nguyên cấu trúc hiện tại.**

Pattern này:
- Rõ ràng về purpose
- Tuân thủ RESTful conventions
- Dễ maintain và scale
- Industry best practice

---

Last updated: 2026-01-12
