# 📋 KẾ HOẠCH TỔNG THỂ HỆ THỐNG E-SANGHA
## Phiên bản 2.0 - Tuân thủ Luật BVDLCN 2025 & Nghị định 356/2025/NĐ-CP

> **Ngày lập:** 10/01/2026  
> **Trạng thái:** Draft - Cần phê duyệt  
> **Mức độ:** Senior Architecture Design

---

## 📊 PHẦN 1: PHÂN TÍCH HIỆN TRẠNG

### 1.1 Kiến trúc hiện tại

| Layer | Công nghệ | Trạng thái | Đánh giá |
|-------|-----------|------------|----------|
| **Frontend** | React 19 + Vite + TypeScript | ✅ Hoạt động | 70% hoàn thiện |
| **Backend** | Django 6.0 + DRF | ✅ Hoạt động | 60% hoàn thiện |
| **Database** | PostgreSQL (Supabase) | ✅ Kết nối | 80% schema |
| **Auth** | Django Auth (session) | ⚠️ Cơ bản | 20% - Chưa JWT |
| **Security** | ❌ Chưa triển khai | ❌ Thiếu | 0% |

### 1.2 Điểm mạnh hiện tại
- ✅ 28 bảng database với quan hệ chuẩn
- ✅ User model hỗ trợ đa ngôn ngữ (Khmer/Việt/English)
- ✅ RBAC cơ bản (7 roles: admin, abbot, teacher, student, admission, content, secretary)
- ✅ Profile riêng biệt cho Monk/Layperson
- ✅ API RESTful với DRF ViewSets

### 1.3 Điểm yếu cần khắc phục

| Hạng mục | Vấn đề | Mức độ rủi ro |
|----------|--------|---------------|
| **Bảo mật** | Không có MFA, không mã hóa dữ liệu nhạy cảm | 🔴 Cao |
| **Auth** | Dùng session, không JWT, không refresh token | 🔴 Cao |
| **GDPR/PDPA** | Không có consent tracking, không audit log | 🔴 Cao |
| **API** | Không rate limiting, không API key | 🟠 Trung bình |
| **UI/UX** | Chưa có loading states đồng nhất | 🟡 Thấp |

---

## 🔐 PHẦN 2: YÊU CẦU TUÂN THỦ PHÁP LUẬT

### 2.1 Luật Bảo vệ Dữ liệu Cá nhân 2025 (Luật 91/2025/QH15)

> **Có hiệu lực:** 01/01/2026

| Điều khoản | Yêu cầu | Áp dụng cho E-Sangha |
|------------|---------|----------------------|
| **Điều 7** | Quyền được biết về xử lý DLCN | ✅ Cần hiển thị Privacy Policy |
| **Điều 9** | Quyền đồng ý/rút lại đồng ý | ✅ Consent checkbox + Withdraw UI |
| **Điều 11** | Quyền xem, chỉnh sửa, xóa DLCN | ✅ User Profile + Delete Account |
| **Điều 13** | Dữ liệu nhạy cảm cần MFA | ✅ CCCD, Chứng điệp, Ảnh chân dung |

### 2.2 Nghị định 356/2025/NĐ-CP

| Quy định | Yêu cầu kỹ thuật |
|----------|------------------|
| **Thông báo vi phạm** | Báo cáo trong 72 giờ nếu lộ dữ liệu nhạy cảm |
| **Xác thực đa yếu tố** | MFA bắt buộc khi truy cập dữ liệu quy mô lớn |
| **Mã hóa** | AES-256 cho dữ liệu lưu trữ, TLS 1.3 truyền tải |
| **Audit Log** | Ghi nhận: Ai, Làm gì, Khi nào, Từ đâu |
| **Quyền xóa** | Xóa dữ liệu sau khi chấm dứt quan hệ (trừ ngoại lệ) |

### 2.3 Dữ liệu nhạy cảm trong E-Sangha

```
┌─────────────────────────────────────────────────────────────┐
│                   DỮ LIỆU NHẠY CẢM (Sensitive Data)         │
├─────────────────────────────────────────────────────────────┤
│ • CMND/CCCD (id_card_url)                                   │
│ • Chứng điệp thọ giới (ordination_certificate_url)          │
│ • Ảnh chân dung (photo_url)                                 │
│ • Ngày sinh (date_of_birth)                                 │
│ • Địa chỉ chi tiết (place_of_birth, address)                │
│ • Thông tin liên hệ khẩn cấp (emergency_contact)            │
│ • Tôn giáo (ethnicity: Khmer - ngụ ý Phật giáo Nam tông)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ PHẦN 3: KIẾN TRÚC MỤC TIÊU (Target Architecture)

### 3.1 Sơ đồ tổng quan

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                    │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │     CLOUDFLARE / WAF          │
                    │  • DDoS Protection            │
                    │  • Rate Limiting              │
                    │  • Bot Detection              │
                    └───────────────┬───────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                                               │
    ┌───────▼───────┐                             ┌─────────▼─────────┐
    │   WEB APP     │                             │   ADMIN PANEL     │
    │  (React)      │                             │   (React)         │
    │  Port 5173    │                             │   Port 3001       │
    └───────┬───────┘                             └─────────┬─────────┘
            │                                               │
            └───────────────────────┼───────────────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │      NGINX / API GATEWAY      │
                    │  • JWT Validation             │
                    │  • Rate Limiting per user     │
                    │  • Request Logging            │
                    └───────────────┬───────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
┌───────▼───────┐          ┌────────▼────────┐         ┌────────▼────────┐
│   AUTH API    │          │   MAIN API      │         │   FILE SERVICE  │
│  (Django)     │          │   (Django)      │         │   (Supabase)    │
│  /auth/*      │          │   /api/v1/*     │         │   Storage       │
└───────┬───────┘          └────────┬────────┘         └─────────────────┘
        │                           │
        └───────────────────────────┼───────────────────────────┐
                                    │                           │
                    ┌───────────────▼───────────────┐  ┌────────▼────────┐
                    │      PostgreSQL (Supabase)    │  │   Redis Cache   │
                    │  • Row Level Security         │  │  • Sessions     │
                    │  • Encrypted Fields           │  │  • Rate Limits  │
                    │  • Audit Logs                 │  │  • OTP Storage  │
                    └───────────────────────────────┘  └─────────────────┘
```

### 3.2 Security Layers

| Layer | Công nghệ | Mục đích |
|-------|-----------|----------|
| **L1: Edge** | Cloudflare WAF | DDoS, Bot, Geo-blocking |
| **L2: Gateway** | Kong / Nginx | Rate limit, JWT verify |
| **L3: App** | Django Middleware | CORS, CSRF, XSS |
| **L4: Data** | AES-256 + Salt | Encrypt sensitive fields |
| **L5: DB** | Supabase RLS | Row-level access control |

---

## 📅 PHẦN 4: LỘ TRÌNH TRIỂN KHAI CHI TIẾT (12 tuần)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ DISCOVERY   │───▶│   DESIGN    │───▶│  BACKEND    │───▶│  FRONTEND   │───▶│   TESTING   │───▶│  DEPLOYMENT │
│ & PLANNING  │    │   UI/UX     │    │ + SECURITY  │    │ DEVELOPMENT │    │    & QA     │    │  & LAUNCH   │
│   1 tuần    │    │   2 tuần    │    │   3 tuần    │    │   3 tuần    │    │   2 tuần    │    │   1 tuần    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

### PHASE 0: DISCOVERY & REQUIREMENTS (1 tuần)
> **Mục tiêu:** Phân tích yêu cầu, xác định phạm vi dự án

#### 0.1 Stakeholder Analysis (2 ngày)
- [ ] Phỏng vấn đại diện Học viện (Ban Giám đốc)
- [ ] Xác định User Personas (Tăng sinh, Giảng viên, Admin, Khách)
- [ ] Thu thập Pain Points từ hệ thống hiện tại
- [ ] Định nghĩa Success Metrics (KPIs)

#### 0.2 Requirements Documentation (2 ngày)
- [ ] Functional Requirements (FR)
- [ ] Non-Functional Requirements (NFR)
- [ ] User Stories với Acceptance Criteria
- [ ] Danh sách Features (Must-have / Nice-to-have)

#### 0.3 Competitor & Reference Analysis (1 ngày)
- [ ] Phân tích 3-5 website giáo dục tương tự
- [ ] Benchmark UI/UX best practices
- [ ] Tổng hợp inspiration board

#### 0.4 Project Scope Finalization
| Hạng mục | Trong phạm vi | Ngoài phạm vi |
|----------|---------------|---------------|
| **Trang công khai** | Home, About, Education, News, Contact | Forum, Chat |
| **Portal Sinh viên** | Xem điểm, Thời khóa biểu, Đơn từ | Thanh toán online |
| **Quản trị** | Django Admin | Custom Admin Panel |
| **Đăng nhập** | JWT, MFA | OAuth (Google, Facebook) |

---

### PHASE 1: UI/UX DESIGN (2 tuần)
> **Mục tiêu:** Thiết kế giao diện hoàn chỉnh trước khi code

#### 1.1 Information Architecture (2 ngày)
```
                        ┌─────────────┐
                        │    HOME     │
                        └──────┬──────┘
         ┌─────────┬─────────┬─┴────────┬──────────┬──────────┐
         ▼         ▼         ▼          ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │ ABOUT  │ │EDUCATE │ │  NEWS  │ │ADMISS. │ │CONTACT │ │ PORTAL │
    └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
         │         │         │          │                       │
         ▼         ▼         ▼          ▼                       ▼
    - Lịch sử  - Courses  - List    - Form              - Dashboard
    - Sứ mệnh  - Detail   - Detail  - Status            - Grades
    - Tổ chức                                           - Schedule
```

#### 1.2 Wireframes (3 ngày)
| Page | Priority | Wireframe Status |
|------|----------|------------------|
| Home | 🔴 High | ⏳ Pending |
| About | 🟠 Medium | ⏳ Pending |
| Education | 🔴 High | ⏳ Pending |
| News | 🟡 Low | ⏳ Pending |
| Contact | 🟡 Low | ⏳ Pending |
| Student Portal | 🔴 High | ⏳ Pending |
| Login/Register | 🔴 High | ⏳ Pending |

#### 1.3 Visual Design & Mockups (4 ngày)

> **Phong cách:** Buddhist Khmer Theme - Trang trọng, Linh thiêng, Hiện đại  
> **Nguồn:** UI Mockups đã có (`FRONDEND_WEB_HVPGNT/`)  
> **Files:** `frontend/src/styles/variables.css` (⭐ TẬP TRUNG tất cả biến)

##### Color Palette - Màu Phật Giáo Khmer

| Token | Value | Sử dụng |
|-------|-------|----------|
| **Primary (Cam/Orange)** | | |
| `--color-primary` | `#FFA726` | Nút CTA "THAM QUAN", Links, Accents |
| `--color-primary-light` | `#FFCA28` | Hover states |
| `--color-primary-dark` | `#FB8C00` | Active states |
| **Secondary (Maroon/Nâu Đỏ)** | | |
| `--color-secondary` | `#6B2C2C` | Header/Footer background |
| `--color-secondary-dark` | `#4E342E` | Dark sections |
| **Gold (Vàng Trang Trí)** | | |
| `--color-gold` | `#D4AF37` | Viền vàng, Ornamental borders |
| `--color-gold-light` | `#FFE499` | Light accents |
| **Cream/Beige (Nền)** | | |
| `--color-cream` | `#FFF3E0` | Main background |
| `--color-cream-light` | `#FFF8ED` | Card backgrounds |
| **Text** | | |
| `--color-text-primary` | `#2C1810` | Chữ chính (dark brown) |
| `--color-text-secondary` | `#5D4037` | Chữ phụ |
| `--color-text-muted` | `#8D6E63` | Chữ mờ |

##### Typography Scale

| Element | Font Family | Size | Weight | CSS Variable |
|---------|-------------|------|--------|---------------|
| **Headings** | Noto Serif Khmer, Merriweather | | | `--font-heading` |
| H1 (Hero) | ↑ | 60px / 3.75rem | 700 | `--font-size-6xl` |
| H2 (Page Title) | ↑ | 36px / 2.25rem | 700 | `--font-size-4xl` |
| H3 (Section) | ↑ | 30px / 1.875rem | 700 | `--font-size-3xl` |
| H4 (Card Title) | ↑ | 24px / 1.5rem | 600 | `--font-size-2xl` |
| **Body** | Noto Sans Khmer, Inter | | | `--font-body` |
| Body Text | ↑ | 16px / 1rem | 400 | `--font-size-base` |
| Small Text | ↑ | 14px / 0.875rem | 400 | `--font-size-sm` |
| Caption | ↑ | 12px / 0.75rem | 400 | `--font-size-xs` |

**Import Fonts:**
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@300;400;500;600;700&family=Noto+Serif+Khmer:wght@300;400;600;700&display=swap');
```

##### Component Specifications (từ UI Mockups)

| Component | Size | CSS Variable | Ghi chú |
|-----------|------|--------------|----------|
| **Header** | 80px | `--header-height` | Sticky, maroon gradient |
| **Hero Title** | 60px | `--font-size-6xl` | Gold color, drop shadow |
| **Stat Card (1992, 150+)** | 180px min-height | `--stat-card-min-height` | Cream gradient, gold border |
| **Stat Number** | 48px | `--stat-number-size` | Orange, bold |
| **Staff Avatar** | 100px circle | `--staff-avatar-size` | Gold border, centered |
| **News Card** | 360px width | `--news-card-width` | White bg, gold border |
| **News Image** | 240px height | `--news-card-image-height` | Cover fit |
| **Button (Primary)** | 44px height | `--btn-height-base` | Orange, uppercase, rounded |
| **Form Input** | 48px height | `--input-height` | Cream bg, gold border |

##### Spacing System (8px Grid)

| Token | Value | Sử dụng |
|-------|-------|----------|
| `--space-2` | 8px | Tight spacing |
| `--space-4` | 16px | Default gap |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Large gaps |
| `--space-12` | 48px | Section padding |
| `--section-padding-y` | 80px (5rem) | Vertical section spacing |

##### Shadows & Effects

| Shadow | Value | Usage |
|--------|-------|-------|
| `--shadow-md` | `0 10px 15px rgba(107,44,44,0.1)` | Cards |
| `--shadow-gold-md` | `0 0 20px rgba(212,175,55,0.4)` | Golden glow |
| `--border-radius-xl` | 24px | Cards, rounded corners |

##### Responsive Breakpoints
| Breakpoint | Width | Device | CSS Variable |
|------------|-------|--------|---------------|
| `xs` | 480px | Mobile Portrait | `--breakpoint-xs` |
| `sm` | 640px | Mobile Landscape | `--breakpoint-sm` |
| `md` | 768px | Tablet | `--breakpoint-md` |
| `lg` | 1024px | Laptop | `--breakpoint-lg` |
| `xl` | 1280px | Desktop | `--breakpoint-xl` |
| `2xl` | 1400px | Large Desktop | `--container-2xl` |

#### 1.4 Interactive Prototype (1 ngày)
- [ ] Figma prototype với navigation flow
- [ ] Stakeholder review & feedback
- [ ] Design approval sign-off

---

### PHASE 2: BACKEND DEVELOPMENT + SECURITY (3 tuần)
> **Mục tiêu:** API hoàn chỉnh, bảo mật, sẵn sàng cho Frontend

#### 2.1 Environment Setup (2 ngày)
- [ ] Cấu hình Dev/Staging/Prod environments
- [ ] Secret Manager (Supabase Vault)
- [ ] `.env.example` với tất cả biến
- [ ] HTTPS + TLS 1.3

#### 2.2 Authentication & Authorization (5 ngày)

| Task | Backend | Status |
|------|---------|--------|
| JWT với `djangorestframework-simplejwt` | `/auth/login/` | ⏳ |
| Refresh Token rotation | `/auth/refresh/` | ⏳ |
| Logout (blacklist token) | `/auth/logout/` | ⏳ |
| MFA (TOTP) | `/auth/mfa/setup/` | ⏳ |
| Password Reset | `/auth/password-reset/` | ⏳ |

##### RBAC Permission Matrix
| Resource | Admin | Teacher | Student | Guest |
|----------|-------|---------|---------|-------|
| Users | CRUD | R | - | - |
| Grades | CRUD | CRU | R(own) | - |
| Courses | CRUD | R | R | R |
| News | CRUD | R | R | R |
| Petitions | CRUD | RU | CRU(own) | - |

#### 2.3 Data Protection (5 ngày)
- [ ] AES-256 encryption cho sensitive fields
- [ ] Audit Log model + middleware
- [ ] Consent Management model
- [ ] Data export API (Right to Access)
- [ ] Account deletion API (Right to Erasure)

#### 2.4 API Development (5 ngày)
- [ ] CMS API (News, Pages, Staff)
- [ ] Academic API (Courses, Grades, Schedule)
- [ ] User API (Profile, Settings)
- [ ] Pagination, Filtering, Search
- [ ] OpenAPI documentation (Swagger)

#### 2.5 API Security Hardening (3 ngày)
- [ ] Rate Limiting (Django Ratelimit)
- [ ] Input Validation (Serializers)
- [ ] CORS strict configuration
- [ ] SQL Injection prevention
- [ ] XSS prevention

---

### PHASE 3: FRONTEND DEVELOPMENT (3 tuần)
> **Mục tiêu:** Implement designs, kết nối API

#### 3.1 Project Setup (2 ngày)
- [x] **CSS Variables System** (`variables.css`) - ⭐ CHÍNH
  - 100+ biến cho colors, sizes, spacing
  - Single source of truth - sửa 1 chỗ, toàn web đổi
- [x] **Tailwind CSS** configuration với custom theme
  - Tích hợp theme từ `variables.css`
  - Buddhist Khmer color palette
- [x] **Design System Documentation**
  - `DESIGN_SYSTEM.md` - Hướng dẫn sử dụng
  - `MAINTENANCE_GUIDE.md` - Bảo trì & cập nhật
- [ ] **Component library setup**
  - Base components matching UI mockups
  - Reusable, maintainable
- [ ] **Routing configuration**
  - React Router
  - Lazy loading

#### 3.2 Core Components (5 ngày)
| Component | Variants | Priority |
|-----------|----------|----------|
| Button | Primary, Secondary, Ghost, Danger | 🔴 High |
| Input | Text, Password, Select, Textarea | 🔴 High |
| Card | News, Course, Staff | 🔴 High |
| Modal | Confirm, Form, Alert | 🟠 Medium |
| Table | Sortable, Paginated | 🟠 Medium |
| Toast | Success, Error, Warning | 🟡 Low |

#### 3.3 Page Implementation (8 ngày)
| Page | Wireframe → Code | API Integration | Total |
|------|------------------|-----------------|-------|
| Home | 1d | 0.5d | 1.5d |
| About | 0.5d | 0.5d | 1d |
| Education | 1d | 0.5d | 1.5d |
| News | 0.5d | 0.5d | 1d |
| Contact | 0.5d | 0.5d | 1d |
| Login/Register | 1d | 0.5d | 1.5d |
| Student Portal | 1.5d | 1d | 2.5d |

#### 3.4 SEO Implementation
- [ ] Semantic HTML5 (`<header>`, `<main>`, `<article>`)
- [ ] Meta title + description per page
- [ ] XML Sitemap
- [ ] Schema.org (EducationalOrganization)
- [ ] robots.txt

#### 3.5 Accessibility (WCAG 2.1 AA)
- [ ] Alt text for images (Vietnamese)
- [ ] Keyboard navigation
- [ ] Contrast ratio ≥ 4.5:1
- [ ] `<html lang="vi">`
- [ ] Focus visible states

#### 3.6 Performance Optimization
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

- [ ] Image optimization (WebP, lazy loading)
- [ ] Code splitting (React.lazy)
- [ ] Font subsetting (Vietnamese only)

---

### PHASE 4: TESTING & QA (2 tuần)
> **Mục tiêu:** Đảm bảo chất lượng trước khi launch

#### 4.1 Testing Strategy
| Type | Tool | Coverage |
|------|------|----------|
| Unit Tests | pytest | 80% |
| Integration Tests | pytest + DRF | 70% |
| E2E Tests | Playwright | Critical paths |
| Security Tests | OWASP ZAP | All endpoints |
| Performance Tests | Lighthouse | All pages |

#### 4.2 Test Cases Checklist
- [ ] Login/Logout flow
- [ ] Registration + Email verification
- [ ] Student Portal access
- [ ] Grade viewing (own data only)
- [ ] News CRUD (content role)
- [ ] Contact form submission
- [ ] Responsive on Mobile/Tablet/Desktop

#### 4.3 Bug Fixing & Polish (5 ngày)
- [ ] Fix critical bugs
- [ ] UI polish (spacing, alignment)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Performance optimization

#### 4.4 User Acceptance Testing (3 ngày)
- [ ] Invite 5-10 test users
- [ ] Collect feedback
- [ ] Prioritize & fix issues

---

### PHASE 5: DEPLOYMENT & LAUNCH (1 tuần)
> **Mục tiêu:** Go live với monitoring

#### 5.1 Deployment Pipeline
```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Code   │───▶│  Test   │───▶│ Staging │───▶│  Prod   │
│  Push   │    │  (CI)   │    │ Deploy  │    │ Deploy  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
     ▼              ▼              ▼              ▼
  GitHub       GitHub         Vercel/         Vercel/
  Actions      Actions        Railway         Railway
```

#### 5.2 Pre-Launch Checklist
- [ ] Domain configuration
- [ ] SSL certificate
- [ ] Environment variables (production)
- [ ] Database backup schedule
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Google Analytics / Plausible)

#### 5.3 Launch Day
- [ ] Final staging review
- [ ] Production deployment
- [ ] Smoke testing
- [ ] Announcement to stakeholders

#### 5.4 Post-Launch (Ongoing)
- [ ] Monitor error logs
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Bug fixes & improvements

---

## 📈 PHẦN 5: TIMELINE TỔNG HỢP

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    GANTT CHART (12 tuần) - WEB ONLY                     │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE 0: Discovery & Requirements  ████░░░░░░░░░░░░░░░░░░░░ (1w)       │
│ PHASE 1: UI/UX Design              ░░░░████████░░░░░░░░░░░░ (2w)       │
│ PHASE 2: Backend + Security        ░░░░░░░░░░░░████████████ (3w)       │
│ PHASE 3: Frontend Development      ░░░░░░░░░░░░░░░░░░░░████████████(3w)│
│ PHASE 4: Testing & QA              ░░░░░░░░░░░░░░░░░░░░░░░░░░░░████(2w)│
│ PHASE 5: Deployment & Launch       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██(1w)│
└─────────────────────────────────────────────────────────────────────────┘
                  Week: 1  2  3  4  5  6  7  8  9 10 11 12
```

---

## ⚠️ PHẦN 6: RỦI RO & GIẢI PHÁP

| Rủi ro | Xác suất | Tác động | Giải pháp |
|--------|----------|----------|-----------|
| Lộ dữ liệu nhạy cảm | Trung bình | **Rất cao** (Vi phạm pháp luật) | Mã hóa + MFA + Audit |
| API bị tấn công | Cao | Cao | Rate limit + WAF + JWT |
| Database corruption | Thấp | **Rất cao** | Backup tự động + PITR |
| Third-party service down | Trung bình | Trung bình | Fallback mechanisms |
| Developer resource | Cao | Cao | Ưu tiên features, MVP first |

---

## ✅ PHẦN 7: CHECKLIST PHÊ DUYỆT

- [ ] **Stakeholder Review:** Hội đồng Điều hành Học viện
- [ ] **Security Review:** Chuyên gia An ninh mạng
- [ ] **Legal Review:** Tuân thủ Luật BVDLCN 2025
- [ ] **Technical Review:** Senior Developer
- [ ] **Budget Approval:** Ban Tài chính

---

> **Ghi chú:** Tài liệu này được tạo tự động và cần được review bởi các bên liên quan trước khi triển khai.

**Người lập:** AI Assistant  
**Ngày cập nhật:** 10/01/2026
