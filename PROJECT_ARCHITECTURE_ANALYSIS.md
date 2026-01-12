# 🏛️ PHÂN TÍCH KIẾN TRÚC DỰ ÁN HVPGNTK

> **Tài liệu phân tích kiến trúc toàn diện**  
> **Ngày tạo**: 12/01/2026  
> **Vai trò**: Principal Software Architect  
> **Mục đích**: ĐỌC – HIỂU – GIẢI PHẪU (KHÔNG ĐỀ XUẤT SỬA)

---

## 📁 1. CẤU TRÚC THƯ MỤC TỔNG THỂ

```
e:\web_HVPGNTK\
├── 📂 backend/                    # Django REST Framework Backend
│   ├── apps/                      # Django Applications
│   │   ├── core/                  # Middleware, Permissions, Throttling
│   │   ├── users/                 # Custom User Model, Authentication
│   │   ├── cms/                   # Content Management System
│   │   ├── academic/              # Academic Year, Course, Enrollment
│   │   ├── admissions/            # Admission Periods & Applications
│   │   ├── approvals/             # Student Requests & Approval Workflow
│   │   ├── petitions/             # Petitions System
│   │   └── calendar_app/          # Calendar/Events
│   ├── config/                    # Django Project Configuration
│   │   ├── settings.py            # Main settings file
│   │   ├── urls.py                # URL routing
│   │   ├── wsgi.py                # WSGI entry point
│   │   └── asgi.py                # ASGI entry point
│   ├── logs/                      # Application logs
│   ├── static/                    # Static files
│   ├── manage.py                  # Django management script
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Environment variables (gitignored)
│   └── .env.example               # Environment template
│
├── 📂 frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── api/                   # API client modules
│   │   ├── app/                   # App-level configurations
│   │   ├── components/            # Reusable UI components
│   │   ├── contexts/              # React Context providers
│   │   ├── features/              # Feature modules
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── layouts/               # Layout components
│   │   ├── lib/                   # Utility libraries
│   │   ├── pages/                 # Page components
│   │   ├── router/                # Route definitions
│   │   ├── styles/                # Global styles
│   │   ├── theme/                 # Theme configuration
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── App.tsx                # Main App component
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global CSS
│   ├── public/                    # Public assets
│   ├── dist/                      # Production build output
│   ├── package.json               # NPM dependencies
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # TailwindCSS configuration
│   ├── tsconfig.json              # TypeScript configuration
│   └── .env.*                     # Environment files
│
├── 📂 FRONDEND_WEB_HVPGNT/        # Static UI Mockups (Design Reference)
│   ├── about_the_academy/
│   ├── academy_homepage/
│   ├── contact_us/
│   ├── news_&_events_grid/
│   ├── online_admissions_form/
│   ├── student_portal_dashboard/
│   └── training_programs/
│
├── 📂 docs/                       # Empty documentation folder
│
├── 📄 Documentation Files
│   ├── DATABASE_SCHEMA.md         # Database schema documentation
│   ├── IMPLEMENTATION_PLAN.md     # Implementation plan
│   ├── IMPLEMENTATION_ROADMAP.md  # Detailed roadmap
│   ├── MASTER_PLAN_2026.md        # Master plan
│   ├── PRODUCTION_READINESS_REPORT.md
│   ├── QUICK_START.md             # Quick start guide
│   └── SYNCHRONIZATION_PLAN.md    # Sync plan
│
└── 📄 Startup Scripts
    ├── run_website.bat            # Combined startup script
    ├── start_server.bat           # Backend starter
    ├── setup_database.bat         # Database setup
    ├── start.bat / start.ps1      # General starters
    └── stop.ps1                   # Stop script
```

---

## 🔧 2. CÔNG NGHỆ ĐANG DÙNG (THỰC TẾ)

### 2.1 Frontend Stack

| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| **React** | 19.2.3 | UI Framework |
| **Vite** | 6.2.0 | Build tool & Dev server |
| **TypeScript** | 5.8.2 | Type safety |
| **TailwindCSS** | 3.4.17 | CSS Framework |
| **React Router DOM** | 7.12.0 | Client-side routing |
| **Axios** | 1.13.2 | HTTP client |
| **TanStack React Query** | 5.90.16 | Server state management |
| **Lucide React** | 0.562.0 | Icon library |
| **TipTap** | 3.15.3 | Rich text editor |
| **React Hot Toast** | 2.6.0 | Notification system |

### 2.2 Backend Stack

| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| **Django** | 5.0.1 | Web framework |
| **Django REST Framework** | 3.14.0 | REST API |
| **SimpleJWT** | 5.3.1 | JWT Authentication |
| **psycopg2-binary** | 2.9.9 | PostgreSQL adapter |
| **drf-spectacular** | 0.27.0 | OpenAPI documentation |
| **django-cors-headers** | 4.3.1 | CORS handling |
| **django-axes** | ≥6.1.1 | Brute-force protection |
| **WhiteNoise** | (in middleware) | Static file serving |
| **dj-database-url** | 2.1.0 | Database URL parsing |
| **Pillow** | 10.2.0 | Image processing |

### 2.3 Supabase Integration

> **Kết nối thực tế qua PostgreSQL Pooler**

| Thành phần | Trạng thái sử dụng |
|------------|-------------------|
| **Auth** | ❌ KHÔNG SỬ DỤNG - Dùng Django SimpleJWT |
| **Database (PostgreSQL)** | ✅ SỬ DỤNG - Kết nối qua `DATABASE_URL` pooler |
| **Storage** | ❓ KHÔNG RÕ - Không thấy cấu hình `django-storages` cho Supabase |
| **RLS (Row Level Security)** | ❌ KHÔNG SỬ DỤNG - Permissions xử lý ở Django |
| **Edge Functions** | ❌ KHÔNG SỬ DỤNG |
| **Realtime** | ❌ KHÔNG SỬ DỤNG |

**Kết luận**: Supabase chỉ được dùng như một **PostgreSQL database as a service**, không sử dụng các tính năng Supabase-specific.

---

## 🔄 3. LUỒNG TỔNG THỂ HỆ THỐNG

### 3.1 Mô tả luồng hiện tại

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│              │     │              │     │              │     │              │
│    USER      │────▶│   REACT UI   │────▶│  DJANGO API  │────▶│  SUPABASE    │
│  (Browser)   │     │  (Frontend)  │     │  (Backend)   │     │  PostgreSQL  │
│              │◀────│              │◀────│              │◀────│              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
     HTTP               Axios/Fetch          REST/JSON           SQL/ORM
```

### 3.2 Chi tiết từng bước

#### Bước 1: User → UI
- User truy cập `http://localhost:3000` (Vite dev server)
- React Router xử lý routing client-side
- Components render dựa trên route

#### Bước 2: UI → API
- Frontend sử dụng Axios client (`src/api/client.ts`)
- Base URL: `http://localhost:8000/api/v1`
- JWT token tự động đính kèm trong header `Authorization: Bearer {token}`
- Token refresh tự động khi nhận 401

#### Bước 3: API → Database
- Django views xử lý request
- Serializers validate & transform data
- Django ORM thực hiện queries
- Kết nối PostgreSQL qua `dj-database-url`

#### Bước 4: Response flow
- Database trả về data → ORM map thành Python objects
- Serializers convert thành JSON
- Response trả về với status code phù hợp
- React Query cache response cho subsequent requests

### 3.3 Authentication Flow

```
┌─────────────┐    POST /api/v1/auth/login/     ┌─────────────┐
│   Login     │ ─────────────────────────────▶  │   Django    │
│   Form      │                                  │   Backend   │
└─────────────┘  ◀───────────────────────────── └─────────────┘
                  { access: "...", refresh: "..." }
                           │
                           ▼
                ┌─────────────────────┐
                │   tokenManager      │
                │   (localStorage)    │
                └─────────────────────┘
                           │
                           ▼
              ┌───────────────────────────┐
              │  Axios Interceptor adds:  │
              │  Authorization: Bearer... │
              └───────────────────────────┘
```

---

## 📊 4. DANH SÁCH FILE LÕI

### 4.1 Backend Core Files

| File | Vai trò | Độ quan trọng |
|------|---------|---------------|
| `config/settings.py` | Cấu hình Django toàn cục | 🔴 Critical |
| `config/urls.py` | API URL routing | 🔴 Critical |
| `apps/users/models.py` | User, MonkProfile, LaypersonProfile | 🔴 Critical |
| `apps/users/views.py` | Login, Register, User CRUD | 🔴 Critical |
| `apps/users/serializers.py` | User data serialization | 🟡 Important |
| `apps/cms/models.py` | SiteSetting, Banner, Menu, Page, Department, News, Staff | 🔴 Critical |
| `apps/cms/views.py` | CMS API endpoints | 🟡 Important |
| `apps/academic/models.py` | AcademicYear, Semester, Course, Class, Enrollment, Grade | 🔴 Critical |
| `apps/admissions/models.py` | AdmissionPeriod, AdmissionApplication | 🟡 Important |
| `apps/approvals/models.py` | RequestType, StudentRequest, ApprovalLog | 🟡 Important |
| `apps/core/permissions.py` | Custom permission classes | 🔴 Critical |
| `apps/core/throttling.py` | Rate limiting configuration | 🟡 Important |
| `requirements.txt` | Python dependencies | 🔴 Critical |

### 4.2 Frontend Core Files

| File | Vai trò | Độ quan trọng |
|------|---------|---------------|
| `src/App.tsx` | Main app with routing | 🔴 Critical |
| `src/main.tsx` | React entry point | 🔴 Critical |
| `src/api/client.ts` | Axios client with interceptors | 🔴 Critical |
| `src/api/auth.ts` | Authentication API calls | 🔴 Critical |
| `src/contexts/AuthContext.tsx` | Auth state management | 🔴 Critical |
| `src/lib/tokenManager.ts` | JWT token management | 🔴 Critical |
| `src/lib/permissions.ts` | Role-based access control | 🟡 Important |
| `src/components/Header.tsx` | Navigation header | 🟡 Important |
| `src/components/MainLayout.tsx` | Main layout wrapper | 🟡 Important |
| `src/pages/StudentPortal.tsx` | Student login/dashboard | 🔴 Critical |
| `vite.config.ts` | Build configuration | 🟡 Important |
| `tailwind.config.js` | TailwindCSS customization | 🟡 Important |
| `package.json` | NPM dependencies | 🔴 Critical |

### 4.3 Configuration Files

| File | Vai trò |
|------|---------|
| `backend/.env` | Backend environment (DB, SECRET_KEY) |
| `frontend/.env` | Frontend environment (API URL) |
| `run_website.bat` | Combine startup script |

---

## ⚠️ 5. NHỮNG ĐIỂM CHƯA RÕ RÀNG

### 5.1 Files với tên mơ hồ / Vai trò không rõ

| File | Vấn đề |
|------|--------|
| `FRONDEND_WEB_HVPGNT/` | Typo "FRONDEND" thay vì "FRONTEND". Thư mục chứa mockup tĩnh, không phải code thực tế |
| `backend/get-pip.py` | File cài đặt pip, không nên commit vào repo |
| `backend/python-installer.exe` | Binary 26MB, không nên commit vào repo |
| `backend/check_cms.py`, `check_content.py`, `check_login.py`, `check_staff.py` | Các script test/debug, không rõ có còn cần thiết không |
| `backend/seed_missing_pages.py` | Script seeding một lần, vai trò lâu dài không rõ |
| `backend/set_password.py` | Script utility, không rõ mục đích |
| `frontend/src/app/` | Chỉ chứa 1 file, structure chưa rõ ràng |
| `frontend/src/features/` | Chỉ chứa 1 file, structure chưa rõ ràng |
| `frontend/src/utils/` | Thư mục rỗng |
| `e-sangha-master-plan.md.resolved` | File với extension `.resolved` không rõ ràng |
| `docs/` | Thư mục rỗng, documentation nằm ở root thay vì đây |

### 5.2 Logic phân tán

| Vấn đề | Chi tiết |
|--------|----------|
| **Permission logic** | Permission được định nghĩa ở cả `apps/core/permissions.py` (backend) và `src/lib/permissions.ts` (frontend). Cần đảm bảo sync |
| **User types** | `User.UserType` có MONK/LAYPERSON, nhưng profile models riêng biệt (MonkProfile, LaypersonProfile). Relationship qua OneToOne |
| **Route duplication** | `App.tsx` line 145-146 có duplicate route cho `/admissions` |
| **Auth endpoints** | `apps/users/` có 2 file URLs: `urls.py` (auth) và `urls_users.py` (user CRUD) |
| **Approval vs Petition** | Có cả `apps/approvals/` và `apps/petitions/` - chức năng có thể overlap |

### 5.3 Nghiệp vụ không nằm đúng chỗ

| Quan sát | Chi tiết |
|----------|----------|
| **BaseModel trong approvals** | `apps/approvals/models.py` định nghĩa `BaseModel` abstract class, nhưng các app khác không sử dụng. Nên nằm ở `apps/core` |
| **Vassa calculation** | `MonkProfile.calculate_vassa()` tính tuổi hạ nhưng comment đề cập đến `VASSA_TABLE` - logic có thể cần external API |
| **CMS models quá lớn** | `apps/cms/models.py` có 548 dòng, chứa nhiều models (SiteSetting, Banner, Menu, Page, Department, News, Staff). Có thể tách nhỏ |
| **Academic views quá lớn** | `apps/academic/views.py` có 19KB - có thể cần tách thành viewsets riêng |

---

## 📐 6. SƠ ĐỒ KIẾN TRÚC HIỆN TẠI

### 6.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT TIER                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     React Application                            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │   │
│  │  │  Pages   │  │Components│  │  Hooks   │  │   API Modules    │ │   │
│  │  │ (25+)    │  │  (17+)   │  │  (2)     │  │ auth, cms, etc   │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │   │
│  │                              │                                    │   │
│  │              ┌───────────────┴───────────────┐                   │   │
│  │              │     Axios Client + JWT        │                   │   │
│  │              │     Token Management          │                   │   │
│  │              └───────────────────────────────┘                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                              HTTP/REST                                   │
│                                    ▼                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              API TIER                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Django REST Framework                         │   │
│  │                                                                   │   │
│  │  ┌────────────────────────────────────────────────────────────┐ │   │
│  │  │                   URL Routing (config/urls.py)              │ │   │
│  │  │  /api/v1/auth/      → users.urls                            │ │   │
│  │  │  /api/v1/users/     → users.urls_users                      │ │   │
│  │  │  /api/v1/cms/       → cms.urls                              │ │   │
│  │  │  /api/v1/academic/  → academic.urls                         │ │   │
│  │  │  /api/v1/admissions/→ admissions.urls                       │ │   │
│  │  │  /api/v1/approvals/ → approvals.urls                        │ │   │
│  │  │  /api/v1/petitions/ → petitions.urls                        │ │   │
│  │  │  /api/v1/calendar/  → calendar_app.urls                     │ │   │
│  │  └────────────────────────────────────────────────────────────┘ │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐│   │
│  │  │                    Security Layer                            ││   │
│  │  │  - JWT Authentication (SimpleJWT)                            ││   │
│  │  │  - Django Axes (Brute-force protection)                      ││   │
│  │  │  - Rate Limiting (Throttling)                                ││   │
│  │  │  - CORS Headers                                              ││   │
│  │  └─────────────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                              Django ORM                                  │
│                                    ▼                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              DATA TIER                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                 Supabase PostgreSQL (Pooler)                     │   │
│  │                                                                   │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │   │
│  │  │    users      │  │     cms       │  │   academic    │        │   │
│  │  │ monk_profiles │  │    pages      │  │   courses     │        │   │
│  │  │layperson_prof │  │    news       │  │   classes     │        │   │
│  │  └───────────────┘  │    staff      │  │  enrollments  │        │   │
│  │                      │   banners     │  │    grades     │        │   │
│  │  ┌───────────────┐  │    menus      │  └───────────────┘        │   │
│  │  │  admissions   │  └───────────────┘                            │   │
│  │  │  applications │                      ┌───────────────┐        │   │
│  │  └───────────────┘  ┌───────────────┐  │   approvals   │        │   │
│  │                      │   petitions   │  │student_request│        │   │
│  │                      └───────────────┘  └───────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Django Apps Relationship

```
                            ┌─────────────┐
                            │    core     │
                            │ (Middleware,│
                            │ Permissions)│
                            └──────┬──────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
    ┌─────────┐              ┌─────────┐              ┌─────────┐
    │  users  │◀─────────────│   cms   │              │academic │
    │ (Auth)  │              │(Content)│              │(Grades) │
    └────┬────┘              └─────────┘              └────┬────┘
         │                                                  │
         │         ┌─────────────────────────┐             │
         │         │                         │             │
         ▼         ▼                         ▼             │
    ┌─────────┐ ┌─────────┐           ┌─────────┐         │
    │admissio-│ │approvals│           │petitions│         │
    │   ns    │ │(Requests│           │         │         │
    └─────────┘ └─────────┘           └─────────┘         │
                                                          │
                            ┌─────────────┐               │
                            │calendar_app │◀──────────────┘
                            └─────────────┘
```

### 6.3 Frontend Pages Map

```
PUBLIC PAGES                          STUDENT PORTAL
┌──────────────┐                      ┌──────────────────┐
│ Home         │                      │ StudentPortal    │
│ About        │                      │ (Login/Dashboard)│
│ Education    │                      │ Schedule         │
│ News         │                      │ Grades           │
│ NewsDetail   │                      │ CourseRegistration
│ Admissions   │                      │ MyRequests       │
│ Contact      │                      │ CreateRequest    │
│ Profile      │                      │ Profile          │
└──────────────┘                      └──────────────────┘

ADMIN PANEL (Protected Routes)
┌──────────────────────────────────────────────────────────┐
│ AdminDashboard    - Roles: ALL STAFF                    │
│ PetitionQueue     - Roles: ADMIN, ABBOT, ADMISSION      │
│ NewsList/Editor   - Roles: ADMIN, CONTENT               │
│ PageList/Editor   - Roles: ADMIN, CONTENT               │
│ StaffList/Editor  - Roles: ADMIN only                   │
│ SiteSettings      - Roles: ADMIN only                   │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 7. TÓM TẮT

### ✅ Điểm mạnh
- Kiến trúc tách biệt rõ ràng Frontend/Backend
- Sử dụng các công nghệ hiện đại, stable
- JWT authentication với token refresh tự động
- Role-based access control cho admin routes
- Brute-force protection với django-axes
- Rate limiting có cấu hình
- API documentation với Swagger

### ⚠️ Điểm cần lưu ý
- Supabase chỉ dùng như PostgreSQL thuần, không tận dụng RLS/Auth/Storage
- Có file không nên commit (`.exe`, `get-pip.py`)
- Một số thư mục rỗng hoặc chưa được sử dụng
- Overlap tiềm năng giữa `approvals` và `petitions`
- Typo trong tên thư mục `FRONDEND_WEB_HVPGNT`

---

> **Lưu ý**: Tài liệu này chỉ phân tích và ghi nhận hiện trạng, KHÔNG đề xuất thay đổi.
