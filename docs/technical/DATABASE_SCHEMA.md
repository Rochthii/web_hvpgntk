# NGHIỆP VỤ & DATABASE SCHEMA
## Nền Móng Hệ Thống Web Portal - Học viện Phật giáo Nam tông Khmer

---

> **Nguyên tắc CORE:** 100% Cloud-Native, KHÔNG có bất kỳ cơ chế offline/sync nào.

---

## MỤC LỤC

1. [Cấu Trúc Website Chuẩn Đại Học](#1-cấu-trúc-website-chuẩn-đại-học)
2. [Nghiệp Vụ Cốt Lõi](#2-nghiệp-vụ-cốt-lõi)
3. [Database Schema Chi Tiết](#3-database-schema-chi-tiết)
4. [Seed Data Khởi Tạo](#4-seed-data-khởi-tạo)
5. [Lộ Trình Triển Khai](#5-lộ-trình-triển-khai)

---

## 1. Cấu Trúc Website Chuẩn Đại Học

### 1.1. So sánh với các Đại học

| Module | RMIT/FPT | Học viện PG Nam tông | Ghi chú |
|--------|----------|----------------------|---------|
| Trang chủ | ✅ | ✅ | Banner, tin nổi bật, thống kê |
| Giới thiệu | ✅ | ✅ | Lịch sử, sứ mệnh, tổ chức |
| Đào tạo | ✅ | ✅ | Chương trình, ngành học |
| Tuyển sinh | ✅ | ✅ | Đăng ký online, tra cứu |
| Sinh viên | ✅ | ✅ | Portal đăng nhập |
| Tin tức | ✅ | ✅ | Tin, thông báo |
| Liên hệ | ✅ | ✅ | Form, bản đồ |
| Nghiên cứu | ✅ | ❌ | Không cần |
| Thư viện | ✅ | ❌ | Đã loại bỏ |

### 1.2. Sitemap Đầy Đủ

```
hocvienphatgiaonamtong.vn/
│
├── 🏠 Trang chủ (/)
│   ├── Hero Banner (slideshow)
│   ├── Giới thiệu ngắn
│   ├── Thống kê (số Tăng sinh, khóa, năm thành lập)
│   ├── Chương trình đào tạo
│   ├── Tin tức nổi bật
│   ├── Sự kiện sắp tới
│   └── Đối tác / Liên kết
│
├── 📖 Giới thiệu (/gioi-thieu)
│   ├── Tổng quan
│   ├── Lịch sử hình thành
│   ├── Sứ mệnh & Tầm nhìn
│   ├── Cơ cấu tổ chức
│   ├── Ban Giám hiệu
│   ├── Đội ngũ Giáo thọ
│   └── Cơ sở vật chất
│
├── 🎓 Đào tạo (/dao-tao)
│   ├── Chương trình Cử nhân Phật học
│   ├── Khung chương trình (129 tín chỉ)
│   ├── Danh sách môn học
│   ├── Lịch học
│   └── Quy chế đào tạo
│
├── 📝 Tuyển sinh (/tuyen-sinh)
│   ├── Thông tin tuyển sinh
│   ├── Đối tượng & Điều kiện
│   ├── Hồ sơ cần chuẩn bị
│   ├── Đăng ký trực tuyến (Form)
│   ├── Tra cứu kết quả
│   └── FAQs Tuyển sinh
│
├── 📰 Tin tức (/tin-tuc)
│   ├── Tin Học viện
│   ├── Hoạt động Phật sự
│   ├── Lễ hội Khmer
│   └── Thông báo
│
├── 📅 Sự kiện & Lịch (/su-kien)
│   ├── Lịch Phật sự
│   ├── Lịch học
│   └── Sự kiện sắp tới
│
├── 📞 Liên hệ (/lien-he)
│   ├── Thông tin liên hệ
│   ├── Bản đồ
│   └── Form gửi tin nhắn
│
└── 🔐 Cổng Sinh viên (/sinh-vien) [Đăng nhập]
    ├── Dashboard cá nhân
    ├── Hồ sơ cá nhân
    ├── Đăng ký môn học
    ├── Xem điểm
    ├── Lịch học cá nhân
    ├── Đơn từ online
    └── Thông báo
```

---

## 2. Nghiệp Vụ Cốt Lõi

### 2.1. Phân Loại Người Dùng

| Role | Mô tả | Quyền hạn |
|------|-------|-----------|
| **admin** | Quản trị viên | Full access |
| **abbot** | Hòa thượng Viện trưởng | Phê duyệt cao nhất |
| **teacher** | Giáo thọ | Quản lý lớp, nhập điểm |
| **student** | Tăng sinh / Cư sĩ | Xem điểm, gửi đơn |
| **admission** | Ban tuyển sinh | Quản lý hồ sơ tuyển sinh |
| **content** | Biên tập viên | Quản lý tin tức, trang |

### 2.2. Mô Hình Song Trùng (Monk vs Layperson)

- **Tăng sinh (Monk):** Pháp danh, ngày thọ giới, thầy tế độ, tuổi hạ
- **Cư sĩ (Layperson):** Họ tên, nghề nghiệp, đơn vị công tác

### 2.3. Nghiệp Vụ Tuổi Hạ (Vassa)

- Tự động tính dựa trên ngày thọ Tỳ kheo và lịch Chhankitek
- Cập nhật mỗi năm sau Chong Vassa (Xuất hạ)

### 2.4. Nghiệp Vụ Tuyển Sinh

```
Đăng ký online → Chờ xét → Đậu/Trượt → Nhập học → Tạo tài khoản
```

### 2.5. Nghiệp Vụ Đơn Từ (E-Approval)

```
Nháp → Gửi → Xét duyệt → Duyệt/Từ chối → Ký số → Hoàn tất
```

---

## 3. Database Schema Chi Tiết

### 3.1. Nhóm: USERS & PROFILES

#### `users` - Tài khoản người dùng

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash TEXT NOT NULL,
    
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('monk', 'layperson')),
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN (
        'admin', 'abbot', 'teacher', 'student', 'admission', 'content', 'secretary'
    )),
    
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    preferred_language VARCHAR(10) DEFAULT 'km',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `monk_profiles` - Hồ sơ Tăng sinh

```sql
CREATE TABLE monk_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Pháp danh
    dharma_name_khmer VARCHAR(100) NOT NULL,
    dharma_name_pali VARCHAR(100),
    dharma_name_vietnamese VARCHAR(100),
    
    -- Thông tin cá nhân
    secular_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    place_of_birth JSONB,
    nationality VARCHAR(50) DEFAULT 'Việt Nam',
    ethnicity VARCHAR(50) DEFAULT 'Khmer',
    
    -- Thông tin thọ giới
    ordination_temple VARCHAR(200) NOT NULL,
    ordination_temple_address TEXT,
    samanera_date DATE,
    bhikkhu_date DATE,
    upajjhaya VARCHAR(100),
    kammavacacariya VARCHAR(100),
    anusavanaccariya VARCHAR(100),
    
    -- Tuổi hạ
    vassa_count INTEGER DEFAULT 0,
    vassa_updated_at TIMESTAMP,
    
    -- Tài liệu
    photo_url TEXT,
    ordination_certificate_url TEXT,
    id_card_url TEXT,
    secular_education JSONB,
    
    -- Trạng thái
    student_code VARCHAR(20) UNIQUE,
    cohort VARCHAR(20),
    current_year INTEGER DEFAULT 1 CHECK (current_year BETWEEN 1 AND 4),
    status VARCHAR(30) DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);
```

#### `layperson_profiles` - Hồ sơ Cư sĩ

```sql
CREATE TABLE layperson_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    full_name VARCHAR(200) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(50) DEFAULT 'Việt Nam',
    
    address TEXT,
    emergency_contact JSONB,
    occupation VARCHAR(100),
    workplace VARCHAR(200),
    
    buddhist_name VARCHAR(100),
    refuge_date DATE,
    refuge_temple VARCHAR(200),
    
    photo_url TEXT,
    id_card_url TEXT,
    
    student_code VARCHAR(20) UNIQUE,
    cohort VARCHAR(20),
    current_year INTEGER DEFAULT 1,
    status VARCHAR(30) DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);
```

---

### 3.2. Nhóm: CMS - TRANG WEB CÔNG KHAI

#### `site_settings` - Cấu hình website

```sql
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    site_name_vi VARCHAR(200) NOT NULL,
    site_name_km VARCHAR(200),
    site_slogan_vi VARCHAR(300),
    site_slogan_km VARCHAR(300),
    
    logo_url TEXT,
    favicon_url TEXT,
    
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address TEXT,
    google_maps_embed TEXT,
    
    facebook_url TEXT,
    youtube_url TEXT,
    
    footer_text_vi TEXT,
    footer_text_km TEXT,
    
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `banners` - Banner slideshow trang chủ

```sql
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title_vi VARCHAR(200),
    title_km VARCHAR(200),
    subtitle_vi VARCHAR(300),
    subtitle_km VARCHAR(300),
    
    image_url TEXT NOT NULL,
    image_url_mobile TEXT,
    
    link_url TEXT,
    link_target VARCHAR(20) DEFAULT '_self',
    
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    start_date DATE,
    end_date DATE,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `menus` - Menu điều hướng

```sql
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    location VARCHAR(50) NOT NULL CHECK (location IN (
        'main_nav',      -- Menu chính
        'footer_1',      -- Footer cột 1
        'footer_2',      -- Footer cột 2
        'mobile_nav'     -- Menu mobile
    )),
    
    title_vi VARCHAR(100) NOT NULL,
    title_km VARCHAR(100),
    
    url VARCHAR(255),
    target VARCHAR(20) DEFAULT '_self',
    icon VARCHAR(50),
    
    parent_id UUID REFERENCES menus(id),
    display_order INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `pages` - Trang tĩnh

```sql
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    slug VARCHAR(100) UNIQUE NOT NULL,
    page_type VARCHAR(50) NOT NULL,
    
    title_vi VARCHAR(300) NOT NULL,
    title_km VARCHAR(300),
    
    content_vi TEXT NOT NULL,
    content_km TEXT,
    
    excerpt_vi TEXT,
    excerpt_km TEXT,
    
    featured_image_url TEXT,
    gallery_images JSONB,
    
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    
    template VARCHAR(50) DEFAULT 'default',
    
    parent_id UUID REFERENCES pages(id),
    menu_order INTEGER DEFAULT 0,
    show_in_menu BOOLEAN DEFAULT true,
    
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    
    view_count INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `departments` - Khoa / Bộ môn

```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    code VARCHAR(20) UNIQUE NOT NULL,
    name_vi VARCHAR(200) NOT NULL,
    name_km VARCHAR(200),
    
    description_vi TEXT,
    description_km TEXT,
    
    head_id UUID REFERENCES users(id),
    
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `staff_members` - Nhân sự (Ban Giám hiệu, Giáo thọ)

```sql
CREATE TABLE staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID REFERENCES users(id),
    department_id UUID REFERENCES departments(id),
    
    display_name_vi VARCHAR(200) NOT NULL,
    display_name_km VARCHAR(200),
    
    title_vi VARCHAR(100),
    title_km VARCHAR(100),
    
    position VARCHAR(100),
    
    bio_vi TEXT,
    bio_km TEXT,
    
    photo_url TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    
    staff_type VARCHAR(50) CHECK (staff_type IN (
        'leadership', 'faculty', 'admin_staff', 'advisory'
    )),
    
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `news` - Tin tức

```sql
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    slug VARCHAR(200) UNIQUE NOT NULL,
    
    title_vi VARCHAR(300) NOT NULL,
    title_km VARCHAR(300),
    
    excerpt_vi TEXT,
    excerpt_km TEXT,
    
    content_vi TEXT NOT NULL,
    content_km TEXT,
    
    featured_image_url TEXT,
    gallery_images JSONB,
    
    category VARCHAR(50) CHECK (category IN (
        'academy_news', 'buddhist_news', 'khmer_festival', 'announcement', 'event'
    )),
    
    tags JSONB,
    
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    
    published_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    
    author_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `faqs` - Câu hỏi thường gặp

```sql
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    question_vi VARCHAR(500) NOT NULL,
    question_km VARCHAR(500),
    
    answer_vi TEXT NOT NULL,
    answer_km TEXT,
    
    category VARCHAR(50) CHECK (category IN (
        'general', 'admission', 'academic', 'student_life'
    )),
    
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `partners` - Đối tác / Liên kết

```sql
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(200) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    
    partner_type VARCHAR(50) CHECK (partner_type IN (
        'academic', 'religious', 'government', 'sponsor'
    )),
    
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `contact_messages` - Tin nhắn liên hệ

```sql
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    sender_name VARCHAR(200) NOT NULL,
    sender_email VARCHAR(255),
    sender_phone VARCHAR(20),
    
    subject VARCHAR(300),
    message TEXT NOT NULL,
    
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN (
        'new', 'read', 'replied', 'archived'
    )),
    
    replied_by UUID REFERENCES users(id),
    replied_at TIMESTAMP,
    reply_content TEXT,
    
    ip_address INET,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3.3. Nhóm: TUYỂN SINH

#### `admission_periods` - Đợt tuyển sinh

```sql
CREATE TABLE admission_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    code VARCHAR(30) UNIQUE NOT NULL,
    name_vi VARCHAR(200) NOT NULL,
    name_km VARCHAR(200),
    academic_year VARCHAR(20) NOT NULL,
    
    registration_start DATE NOT NULL,
    registration_end DATE NOT NULL,
    exam_date DATE,
    announcement_date DATE,
    enrollment_deadline DATE,
    
    quota_monk INTEGER DEFAULT 50,
    quota_layperson INTEGER DEFAULT 20,
    
    requirements_vi TEXT,
    requirements_km TEXT,
    required_documents JSONB,
    
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
        'draft', 'open', 'closed', 'completed'
    )),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `admission_applications` - Đơn đăng ký tuyển sinh

```sql
CREATE TABLE admission_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    period_id UUID NOT NULL REFERENCES admission_periods(id),
    application_number VARCHAR(50) UNIQUE,
    
    applicant_type VARCHAR(20) NOT NULL CHECK (applicant_type IN ('monk', 'layperson')),
    
    -- Thông tin cá nhân
    dharma_name_khmer VARCHAR(100),
    dharma_name_pali VARCHAR(100),
    secular_name VARCHAR(100) NOT NULL,
    
    date_of_birth DATE NOT NULL,
    place_of_birth JSONB,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    
    -- Thông tin Tăng
    ordination_temple VARCHAR(200),
    samanera_date DATE,
    bhikkhu_date DATE,
    upajjhaya VARCHAR(100),
    
    -- Học vấn
    education_level VARCHAR(50),
    secular_education JSONB,
    
    -- Tài liệu
    photo_url TEXT,
    ordination_certificate_url TEXT,
    id_card_url TEXT,
    other_documents JSONB,
    
    -- Trạng thái
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending', 'reviewing', 'approved', 'rejected', 'enrolled'
    )),
    
    exam_score DECIMAL(5,2),
    interview_score DECIMAL(5,2),
    total_score DECIMAL(5,2),
    
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    rejection_reason TEXT,
    
    enrolled_user_id UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3.4. Nhóm: HỌC VỤ

#### `academic_years` - Năm học

```sql
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name_vi VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `semesters` - Học kỳ

```sql
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    
    code VARCHAR(20) NOT NULL,
    name_vi VARCHAR(100) NOT NULL,
    semester_number INTEGER NOT NULL CHECK (semester_number IN (1, 2)),
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE,
    registration_end DATE,
    
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(academic_year_id, semester_number)
);
```

#### `courses` - Môn học

```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    code VARCHAR(20) UNIQUE NOT NULL,
    name_vi VARCHAR(200) NOT NULL,
    name_km VARCHAR(200),
    name_pali VARCHAR(200),
    
    credits INTEGER NOT NULL CHECK (credits > 0),
    theory_hours INTEGER DEFAULT 0,
    practice_hours INTEGER DEFAULT 0,
    
    department_id UUID REFERENCES departments(id),
    
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'required', 'elective', 'general', 'specialized'
    )),
    
    knowledge_block VARCHAR(50) CHECK (knowledge_block IN (
        'pali_language', 'tipitaka', 'history_culture', 'practice', 'general_education'
    )),
    
    prerequisites JSONB,
    description_vi TEXT,
    description_km TEXT,
    applicable_year INTEGER CHECK (applicable_year BETWEEN 1 AND 4),
    
    syllabus_url TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `classes` - Lớp học phần

```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    course_id UUID NOT NULL REFERENCES courses(id),
    semester_id UUID NOT NULL REFERENCES semesters(id),
    teacher_id UUID NOT NULL REFERENCES users(id),
    
    class_code VARCHAR(30) NOT NULL,
    class_name VARCHAR(200),
    
    schedule JSONB,
    room VARCHAR(50),
    max_students INTEGER DEFAULT 50,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(course_id, semester_id, class_code)
);
```

#### `enrollments` - Đăng ký môn

```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL REFERENCES users(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN (
        'enrolled', 'withdrawn', 'completed', 'failed'
    )),
    
    enrolled_at TIMESTAMP DEFAULT NOW(),
    withdrawn_at TIMESTAMP,
    
    UNIQUE(user_id, class_id)
);
```

#### `grades` - Điểm số

```sql
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    
    attendance_score DECIMAL(4,2),
    assignment_score DECIMAL(4,2),
    midterm_score DECIMAL(4,2),
    final_score DECIMAL(4,2),
    
    total_score DECIMAL(4,2),
    grade_letter VARCHAR(2),
    grade_point DECIMAL(3,2),
    
    notes TEXT,
    
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(enrollment_id)
);
```

#### `exam_schedules` - Lịch thi

```sql
CREATE TABLE exam_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    class_id UUID NOT NULL REFERENCES classes(id),
    
    exam_type VARCHAR(20) CHECK (exam_type IN ('midterm', 'final', 'makeup')),
    
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3.5. Nhóm: ĐƠN TỪ & PHÊ DUYỆT

#### `petition_types` - Loại đơn

```sql
CREATE TABLE petition_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    code VARCHAR(50) UNIQUE NOT NULL,
    name_vi VARCHAR(100) NOT NULL,
    name_km VARCHAR(100),
    
    description TEXT,
    approval_chain JSONB NOT NULL,
    sla_hours INTEGER DEFAULT 72,
    template_content TEXT,
    required_attachments JSONB,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `petitions` - Đơn từ

```sql
CREATE TABLE petitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    petition_number VARCHAR(50) UNIQUE,
    type_id UUID NOT NULL REFERENCES petition_types(id),
    requester_id UUID NOT NULL REFERENCES users(id),
    
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    attachments JSONB,
    
    status VARCHAR(30) DEFAULT 'draft' CHECK (status IN (
        'draft', 'submitted', 'in_review', 'needs_revision',
        'approved', 'rejected', 'completed'
    )),
    
    current_step INTEGER DEFAULT 0,
    current_approver_id UUID REFERENCES users(id),
    approved_by JSONB,
    rejection_reason TEXT,
    
    final_document_url TEXT,
    qr_code_data JSONB,
    
    sla_deadline TIMESTAMP,
    submitted_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `petition_history` - Lịch sử xử lý

```sql
CREATE TABLE petition_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
    
    action VARCHAR(50) NOT NULL,
    actor_id UUID NOT NULL REFERENCES users(id),
    actor_role VARCHAR(50),
    
    from_status VARCHAR(30),
    to_status VARCHAR(30),
    comment TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3.6. Nhóm: LỊCH & SỰ KIỆN

#### `khmer_calendar` - Lịch Chhankitek

```sql
CREATE TABLE khmer_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    gregorian_date DATE UNIQUE NOT NULL,
    
    khmer_year INTEGER NOT NULL,
    khmer_month INTEGER NOT NULL,
    khmer_month_name VARCHAR(50),
    khmer_day INTEGER NOT NULL,
    
    moon_phase VARCHAR(20),
    is_uposatha BOOLEAN DEFAULT false,
    is_chol_vassa BOOLEAN DEFAULT false,
    is_chong_vassa BOOLEAN DEFAULT false,
    
    special_event VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `events` - Sự kiện

```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title_vi VARCHAR(200) NOT NULL,
    title_km VARCHAR(200),
    description_vi TEXT,
    description_km TEXT,
    
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    is_all_day BOOLEAN DEFAULT true,
    
    location VARCHAR(200),
    
    event_type VARCHAR(50) CHECK (event_type IN (
        'academic', 'religious', 'holiday', 'meeting', 'other'
    )),
    
    featured_image_url TEXT,
    
    visibility VARCHAR(20) DEFAULT 'all',
    is_featured BOOLEAN DEFAULT false,
    
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3.7. Nhóm: HỆ THỐNG

#### `file_uploads` - Quản lý file

```sql
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    
    file_type VARCHAR(50),
    mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    
    uploaded_by UUID REFERENCES users(id),
    entity_type VARCHAR(50),
    entity_id UUID,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `audit_logs` - Nhật ký hệ thống

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    
    old_values JSONB,
    new_values JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `notifications` - Thông báo

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL REFERENCES users(id),
    
    title VARCHAR(200) NOT NULL,
    message TEXT,
    link VARCHAR(255),
    
    type VARCHAR(50) CHECK (type IN (
        'info', 'success', 'warning', 'error', 'system'
    )),
    
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. Seed Data Khởi Tạo

### 4.1. Site Settings

```sql
INSERT INTO site_settings (
    site_name_vi, site_name_km, site_slogan_vi,
    contact_email, contact_phone, contact_address
) VALUES (
    'Học viện Phật giáo Nam tông Khmer',
    'វិទ្យាស្ថានពុទ្ធសាសនា ថេរវាទ ខ្មែរ',
    'Đào tạo Tăng tài - Phục vụ Chánh pháp',
    'contact@hocvienphatgiaonamtong.vn',
    '+84 292 123 4567',
    'Phường An Khánh, Quận Ninh Kiều, TP. Cần Thơ'
);
```

### 4.2. Trang tĩnh

```sql
INSERT INTO pages (slug, page_type, title_vi, content_vi, status, menu_order) VALUES
('gioi-thieu', 'about', 'Giới thiệu', '...', 'published', 1),
('lich-su', 'history', 'Lịch sử hình thành', '...', 'published', 2),
('su-menh', 'mission', 'Sứ mệnh & Tầm nhìn', '...', 'published', 3),
('co-cau-to-chuc', 'organization', 'Cơ cấu tổ chức', '...', 'published', 4),
('co-so-vat-chat', 'facilities', 'Cơ sở vật chất', '...', 'published', 5),
('chuong-trinh-dao-tao', 'curriculum', 'Chương trình đào tạo', '...', 'published', 6),
('tuyen-sinh', 'admission', 'Thông tin tuyển sinh', '...', 'published', 7),
('lien-he', 'contact', 'Liên hệ', '...', 'published', 8);
```

### 4.3. Khoa

```sql
INSERT INTO departments (code, name_vi, display_order) VALUES
('PALI', 'Khoa Pāli & Ngôn ngữ', 1),
('TIPIKATA', 'Khoa Kinh điển Theravāda', 2),
('HISTORY', 'Khoa Lịch sử & Văn hóa', 3),
('PRACTICE', 'Khoa Tu tập Thực hành', 4);
```

### 4.4. Loại đơn

```sql
INSERT INTO petition_types (code, name_vi, approval_chain, sla_hours) VALUES
('leave_request', 'Đơn xin phép vắng mặt', '["teacher"]', 24),
('vassa_confirmation', 'Đơn xác nhận tuổi hạ', '["abbot"]', 72),
('long_leave', 'Đơn xin nghỉ học dài hạn', '["teacher", "abbot"]', 168),
('class_transfer', 'Đơn xin chuyển lớp', '["teacher", "abbot"]', 120),
('recommendation', 'Đơn xin giấy giới thiệu', '["teacher", "abbot"]', 168),
('transcript_request', 'Đơn xin bảng điểm', '["admin"]', 48),
('graduation_request', 'Đơn xin tốt nghiệp', '["teacher", "abbot"]', 168);
```

### 4.5. Admin user

```sql
INSERT INTO users (email, phone, password_hash, user_type, role, is_active, is_verified)
VALUES ('admin@hocvienphatgiaonamtong.vn', '0292123456', '$2b$12$...', 'layperson', 'admin', true, true);
```

---

## 5. Lộ Trình Triển Khai

### Tổng quan: 12 tuần - 28 bảng

| Tuần | Phase | Công việc | Số bảng |
|------|-------|-----------|---------|
| 1-2 | **Foundation** | users, profiles, file_uploads, audit_logs | 5 |
| 3-4 | **CMS Core** | site_settings, banners, menus, pages | 4 |
| 5-6 | **CMS Extended** | departments, staff, news, faqs, partners, contact_messages | 6 |
| 7-8 | **Tuyển sinh** | admission_periods, admission_applications | 2 |
| 9-10 | **Học vụ** | academic_years, semesters, courses, classes, enrollments, grades, exam_schedules | 7 |
| 11-12 | **Đơn từ & Lịch** | petition_types, petitions, petition_history, khmer_calendar, events, notifications | 6 |

### Chi tiết từng Phase

**Phase 1-2: Foundation (Tuần 1-2)**
- Setup PostgreSQL
- Bảng users, monk_profiles, layperson_profiles
- Bảng file_uploads, audit_logs
- Test CRUD, authentication

**Phase 3-4: CMS Core (Tuần 3-4)**
- Bảng site_settings, banners
- Bảng menus, pages
- Seed trang tĩnh mặc định

**Phase 5-6: CMS Extended (Tuần 5-6)**
- Bảng departments, staff_members
- Bảng news, faqs
- Bảng partners, contact_messages

**Phase 7-8: Tuyển sinh (Tuần 7-8)**
- Bảng admission_periods
- Bảng admission_applications
- Test workflow tuyển sinh

**Phase 9-10: Học vụ (Tuần 9-10)**
- Bảng academic_years, semesters, courses
- Bảng classes, enrollments, grades
- Bảng exam_schedules
- Seed môn học

**Phase 11-12: Đơn từ & Lịch (Tuần 11-12)**
- Bảng petition_types, petitions, petition_history
- Bảng khmer_calendar, events
- Bảng notifications
- Seed lịch Khmer

---

**Tài liệu: Nghiệp vụ & Database Schema v3.0**  
**Chuẩn: Website Đại học**  
**Tổng: 28 bảng | 12 tuần triển khai**  
**Domain: hocvienphatgiaonamtong.vn**
