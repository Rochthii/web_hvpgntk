# LỘ TRÌNH TRIỂN KHAI CHI TIẾT
## E-SANGHA Web Portal - Từ Demo → Production

**Thời gian dự kiến:** 10 tuần  
**Nguyên tắc:** Mỗi task phải có output cụ thể, có thể test được

---

## 📋 PHASE 1: SECURITY HARDENING (Tuần 1-2)

### ✅ Task 1.1: Fix SECRET_KEY Configuration (2h)

**Mục tiêu:** Bắt buộc SECRET_KEY từ environment, không có fallback

**Files cần sửa:**
- `backend/config/settings.py` (dòng 20)

**Hành động cụ thể:**
```python
# BEFORE (line 20):
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-change-this-in-production')

# AFTER:
def get_required_env(var_name: str) -> str:
    value = os.environ.get(var_name)
    if not value:
        raise ImproperlyConfigured(f"Missing required env var: {var_name}")
    return value

SECRET_KEY = get_required_env('DJANGO_SECRET_KEY')
```

**Files cần tạo:**
- `backend/.env.production.example`

**Test:** 
```bash
# Không set DJANGO_SECRET_KEY → phải fail
python manage.py runserver
# Expected: ImproperlyConfigured exception
```

**Definition of Done:**
- [ ] Server không chạy nếu thiếu SECRET_KEY
- [ ] `.env.production.example` có template
- [ ] README cập nhật hướng dẫn

---

### ✅ Task 1.2: Implement Rate Limiting (4h)

**Files cần tạo:**
- `backend/apps/core/throttling.py`

**Code cụ thể:**
```python
# backend/apps/core/throttling.py
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

class LoginThrottle(AnonRateThrottle):
    scope = 'login'
    rate = '5/minute'

class StrictAnonThrottle(AnonRateThrottle):
    scope = 'strict_anon'
    rate = '50/hour'
```

**Files cần sửa:**
- `backend/config/settings.py` - Thêm vào REST_FRAMEWORK config
- `backend/apps/users/views.py` - Thêm throttle_classes vào LoginView

**Code:**
```python
# users/views.py - LoginView
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginThrottle]  # ← THÊM DÒNG NÀY
```

**Test:**
```bash
# Thử login 6 lần trong 1 phút
for i in {1..6}; do
  curl -X POST http://localhost:8000/api/v1/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Lần thứ 6 phải trả về 429 Too Many Requests
```

**Definition of Done:**
- [ ] Login bị throttle sau 5 lần/phút
- [ ] Anonymous users bị throttle 50 requests/hour
- [ ] Có test coverage

---

### ✅ Task 1.3: Token Refresh Interceptor (6h)

**Files cần tạo:**
- `frontend/src/lib/tokenManager.ts`
- `frontend/src/lib/refreshTokenInterceptor.ts`

**Code tokenManager.ts:**
```typescript
// frontend/src/lib/tokenManager.ts
const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const tokenManager = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
  
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
};
```

**Files cần sửa:**
- `frontend/src/api/client.ts` - Thêm interceptors

**Code client.ts (replace toàn bộ):**
```typescript
import axios from 'axios';
import { tokenManager } from '../lib/tokenManager';
import { authApi } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
client.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 & refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        tokenManager.clearTokens();
        window.location.href = '/student-portal';
        return Promise.reject(error);
      }

      try {
        const response = await authApi.refreshToken(refreshToken);
        const newAccessToken = response.data.access;
        tokenManager.setTokens(newAccessToken, refreshToken);
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenManager.clearTokens();
        window.location.href = '/student-portal';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
```

**Test:**
```typescript
// Test scenario:
// 1. Login → lấy token có expiry = 5 giây
// 2. Đợi 6 giây
// 3. Call API bất kỳ → phải tự động refresh
// 4. Request thành công với token mới
```

**Definition of Done:**
- [ ] Token tự động refresh khi hết hạn
- [ ] Không bị logout giữa chừng
- [ ] Multiple concurrent requests được queue đúng
- [ ] Có unit test cho tokenManager

---

### ✅ Task 1.4: Brute-force Protection (3h)

**Package cần cài:**
```bash
pip install django-axes
```

**Files cần sửa:**
- `backend/requirements.txt` - Thêm `django-axes>=6.1.1`
- `backend/config/settings.py`

**Code:**
```python
# settings.py - INSTALLED_APPS
INSTALLED_APPS = [
    # ... existing ...
    'axes',  # ← THÊM
]

# settings.py - MIDDLEWARE (thêm SAU AuthenticationMiddleware)
MIDDLEWARE = [
    # ...
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'axes.middleware.AxesMiddleware',  # ← THÊM SAU Auth
    # ...
]

# settings.py - Add at bottom
AXES_FAILURE_LIMIT = 5  # Lock sau 5 lần failed
AXES_COOLOFF_TIME = 1   # Lock 1 giờ
AXES_LOCKOUT_TEMPLATE = None
AXES_LOCKOUT_URL = None
AXES_RESET_ON_SUCCESS = True
```

**Test:**
```bash
# Login sai 6 lần
# Lần thứ 6 phải bị block (403)
```

**Definition of Done:**
- [ ] Account bị lock sau 5 lần login sai
- [ ] Lock tự mở sau 1 giờ
- [ ] Admin có thể unlock manual qua Django admin

---

### ✅ Task 1.5: Audit Logging (5h)

**Files cần tạo:**
- `backend/apps/core/models.py` - AuditLog model
- `backend/apps/core/middleware/audit.py`
- `backend/apps/core/migrations/0001_initial.py`

**Code models.py:**
```python
# core/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('APPROVE', 'Approve'),
        ('REJECT', 'Reject'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    resource_type = models.CharField(max_length=100)
    resource_id = models.CharField(max_length=100, null=True)
    old_values = models.JSONField(null=True, blank=True)
    new_values = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True)
    user_agent = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['resource_type', 'resource_id']),
        ]
```

**Code middleware:**
```python
# core/middleware/audit.py
from apps.core.models import AuditLog

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def log_audit(user, action, resource_type, resource_id=None, old_values=None, new_values=None, request=None):
    AuditLog.objects.create(
        user=user,
        action=action,
        resource_type=resource_type,
        resource_id=str(resource_id) if resource_id else None,
        old_values=old_values,
        new_values=new_values,
        ip_address=get_client_ip(request) if request else None,
        user_agent=request.META.get('HTTP_USER_AGENT') if request else None,
    )
```

**Files cần sửa:**
- `backend/apps/users/views.py` - Thêm audit log vào LoginView, LogoutView

**Test:**
- Login → Check AuditLog có entry với action='LOGIN'
- Tạo admission application → Check AuditLog có entry với old_values/new_values

**Definition of Done:**
- [ ] Login/Logout được log
- [ ] CRUD operations quan trọng được log
- [ ] Admin có thể xem audit trail qua Django admin

---

## 📋 PHASE 2: CODE QUALITY (Tuần 3-5)

### ✅ Task 2.1: Remove Hardcoded Data from StudentPortal (4h)

**Files cần sửa:**
- `frontend/src/pages/StudentPortal.tsx`

**Locations cụ thể:**

**Line 175-179: Hardcoded cohort + program**
```typescript
// BEFORE:
<span className="font-medium">K15 (2024-2028)</span>
<span className="font-medium">Cử nhân Phật học</span>

// AFTER:
<span className="font-medium">
  {user?.monk_profile?.cohort || user?.layperson_profile?.cohort || 'N/A'}
</span>
<span className="font-medium">
  {currentProgram?.name_vi || 'Cử nhân Phật học'}
</span>
```

**Line 192: Hardcoded credits**
```typescript
// BEFORE:
<h3 className="text-2xl font-bold text-secondary mt-1">12/140</h3>

// AFTER:
<h3 className="text-2xl font-bold text-secondary mt-1">
  {earnedCredits || 0}/{totalCredits || 140}
</h3>
```

**Backend API cần thêm:**
```python
# academic/views.py - Thêm endpoint
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_stats(request):
    user = request.user
    enrollments = Enrollment.objects.filter(
        user=user,
        status__in=['APPROVED', 'COMPLETED']
    ).select_related('class_info__course')
    
    earned_credits = sum(
        e.class_info.course.credits 
        for e in enrollments 
        if e.status == 'COMPLETED'
    )
    
    profile = user.monk_profile if user.user_type == 'monk' else user.layperson_profile
    
    return Response({
        'earned_credits': earned_credits,
        'total_credits': 140,  # Hoặc lấy từ program config
        'cohort': profile.cohort,
        'current_year': profile.current_year,
        'gpa': calculate_gpa(user),  # Implement helper function
    })
```

**Definition of Done:**
- [ ] Không còn hardcode trong StudentPortal
- [ ] Dữ liệu load từ API
- [ ] Có loading state khi fetch

---

### ✅ Task 2.2: Extract Inline Styles → Tailwind (8h)

**Files cần refactor:**
- `frontend/src/pages/Home.tsx` (500+ lines inline styles)

**Strategy:**
1. Tạo component riêng cho từng section
2. Dùng Tailwind classes thay inline styles

**Files cần tạo:**
```
frontend/src/components/home/
├── HeroSection.tsx
├── StatsCards.tsx
├── NewsGrid.tsx
└── HomeLayout.tsx
```

**Example refactor:**

**BEFORE (Home.tsx line 137-223):**
```tsx
<section style={{
  position: 'relative',
  height: '460px',
  display: 'flex',
  // ... 20+ lines style object
}}>
```

**AFTER:**
```tsx
// components/home/HeroSection.tsx
export const HeroSection: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  return (
    <section className="relative h-[460px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-100 brightness-[1.02] contrast-105"
           style={{ backgroundImage: 'url(/images/temple-hero.jpg)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-secondary/40" />
      
      <div className="relative z-10 text-center max-w-[880px] px-8 animate-fade-in-up">
        <h1 className="text-5xl font-extrabold text-gold-500 drop-shadow-glow mb-5 tracking-wider leading-tight">
          {settings.site_name_vi.toUpperCase()}
        </h1>
        {/* ... */}
      </div>
    </section>
  );
};
```

**Tailwind config cần thêm:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  }
}
```

**Definition of Done:**
- [ ] Home.tsx < 200 lines
- [ ] Tất cả inline styles → Tailwind
- [ ] Components tách riêng, reusable
- [ ] UI giống y hệt trước refactor

---

### ✅ Task 2.3: Implement React Query (6h)

**Package cần cài:**
```bash
cd frontend
npm install @tanstack/react-query @tanstack/react-query-devtools
```

**Files cần tạo:**
- `frontend/src/lib/queryClient.ts`
- `frontend/src/app/providers.tsx`
- `frontend/src/features/news/hooks/useNews.ts`

**Code queryClient.ts:**
```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Code providers.tsx:**
```typescript
// app/providers.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../lib/queryClient';
import { AuthProvider } from '../contexts/AuthContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

**Example hook:**
```typescript
// features/news/hooks/useNews.ts
import { useQuery } from '@tanstack/react-query';
import { cmsApi } from '../../../api/cms';

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => cmsApi.getNews().then(res => res.data),
  });
};

export const useNewsDetail = (slug: string) => {
  return useQuery({
    queryKey: ['news', slug],
    queryFn: () => cmsApi.getNewsDetail(slug).then(res => res.data),
    enabled: !!slug,
  });
};
```

**Refactor News.tsx:**
```typescript
// BEFORE:
const fetchNews = React.useCallback(() => cmsApi.getNews(), []);
const { data: news, loading } = useFetch(fetchNews);

// AFTER:
const { data: news, isLoading } = useNews();
```

**Definition of Done:**
- [ ] React Query setup với devtools
- [ ] News, Settings, Academic data dùng React Query
- [ ] Xóa custom useFetch hook
- [ ] Cache hoạt động (reload page không refetch)

---

### ✅ Task 2.4: Error Boundary & Toast (5h)

**Files cần tạo:**
- `frontend/src/components/ErrorBoundary.tsx`
- `frontend/src/components/Toast.tsx`
- `frontend/src/lib/toast.ts`

**Code ErrorBoundary.tsx:**
```typescript
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // TODO: Send to Sentry
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-cream p-4">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h1>
            <p className="text-gray-600 mb-6">
              Chúng tôi đã ghi nhận lỗi này. Vui lòng thử tải lại trang.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Code Toast (sử dụng react-hot-toast):**
```bash
npm install react-hot-toast
```

```typescript
// lib/toast.ts
import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => toast.success(message, {
    duration: 3000,
    position: 'top-right',
  }),
  
  error: (message: string) => toast.error(message, {
    duration: 4000,
    position: 'top-right',
  }),
  
  loading: (message: string) => toast.loading(message),
  
  dismiss: (toastId: string) => toast.dismiss(toastId),
};
```

**Usage:**
```typescript
// StudentPortal.tsx
import { showToast } from '../lib/toast';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(email, password);
    showToast.success('Đăng nhập thành công!');
  } catch (err) {
    showToast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
  }
};
```

**Definition of Done:**
- [ ] ErrorBoundary wrap toàn bộ app
- [ ] Toast hiển thị cho mọi success/error
- [ ] API errors được catch và hiển thị user-friendly

---

### ✅ Task 2.5: Complete TypeScript Types (4h)

**Files cần tạo:**
- `frontend/src/types/api.ts` - Common API response types
- `frontend/src/types/cms.ts` - CMS types
- Cập nhật existing types

**Code api.ts:**
```typescript
// types/api.ts
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface APIError {
  detail?: string;
  [key: string]: any;
}

export interface APIResponse<T> {
  data: T;
  message?: string;
}
```

**Code cms.ts:**
```typescript
// types/cms.ts
export interface SiteSettings {
  id: string;
  site_name_vi: string;
  site_name_km: string;
  site_slogan_vi: string;
  site_slogan_km: string;
  logo_url: string;
  favicon_url: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  google_maps_embed: string;
  facebook_url: string;
  youtube_url: string;
  footer_text_vi: string;
  footer_text_km: string;
  founded_year: string;
  student_count: string;
  course_count: string;
  updated_at: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title_vi: string;
  title_km: string | null;
  excerpt_vi: string;
  excerpt_km: string | null;
  content_vi: string;
  content_km: string | null;
  featured_image_url: string | null;
  thumbnail_url: string | null;
  category: 'academy_news' | 'buddhist_news' | 'khmer_festival' | 'announcement' | 'event';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  is_pinned: boolean;
  published_at: string;
  view_count: number;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  page_type: string;
  title_vi: string;
  title_km: string | null;
  content_vi: string;
  content_km: string | null;
  excerpt_vi: string | null;
  excerpt_km: string | null;
  featured_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  template: string;
  status: 'draft' | 'published';
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}
```

**Update api/cms.ts with types:**
```typescript
// api/cms.ts
import client from './client';
import { SiteSettings, NewsItem, Page } from '../types/cms';

export const cmsApi = {
  getSettings: () => client.get<SiteSettings>('/cms/settings/'),
  
  getNews: () => client.get<NewsItem[]>('/cms/news/'),
  
  getNewsDetail: (slug: string) => client.get<NewsItem>(`/cms/news/${slug}/`),
  
  getPage: (slug: string) => client.get<Page>(`/cms/pages/${slug}/`),
};
```

**Definition of Done:**
- [ ] Không còn `any` types trong API calls
- [ ] Auto-complete hoạt động đầy đủ
- [ ] Type errors được catch ở compile time

---

## 📋 PHASE 3: FEATURE COMPLETION (Tuần 6-9)

*(Này sẽ viết chi tiết sau khi Phase 1+2 xong)*

**Preview:**
- Complete Student Dashboard
- Course Registration Flow
- E-Approval System
- Admin CMS
- Granular RBAC

---

## 📋 PHASE 4: PRODUCTION DEPLOYMENT (Tuần 10)

*(Chi tiết deployment config)*

---

## 📊 PROGRESS TRACKING

Sau mỗi task hoàn thành:
1. ✅ Check off trong task.md
2. 📝 Commit với message: `feat: [Task X.Y] Brief description`
3. 🧪 Test coverage phải pass
4. 📖 Update README nếu có breaking changes

---

*Lộ trình này được tạo dựa trên Production Readiness Report*  
*Mỗi task có thể thực thi độc lập, không chung chung*
