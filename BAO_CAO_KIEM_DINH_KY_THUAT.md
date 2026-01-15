# BÁO CÁO KIỂM ĐỊNH KỸ THUẬT & KẾ HOẠCH ỔN ĐỊNH DỰ ÁN
**Dự án:** Cổng thông tin Học viện Phật giáo Nam tông Khmer (HVPGNTK)
**Ngày lập:** 15/01/2026
**Vai trò:** Technical Lead / Software Architect
**Mục tiêu:** Đánh giá và lập kế hoạch ổn định nền tảng dự án web.

---

## 1. TỔNG QUAN HIỆN TRẠNG DỰ ÁN

### 1.1. Kiến trúc Tổng thể
| Thành phần | Công nghệ | Trạng thái |
|---|---|---|
| **Backend** | Django 6.0 + Django REST Framework | Hoạt động ổn định |
| **Frontend** | React + TypeScript + Vite + TailwindCSS | Hoạt động ổn định |
| **Database** | PostgreSQL (Supabase) | Hoạt động ổn định |
| **Authentication** | JWT (Simple JWT) | Hoạt động ổn định |

### 1.2. Quy mô Codebase
| Loại | Số lượng |
|---|---|
| Backend Apps | 7 (academic, admissions, calendar, cms, core, petitions, users) |
| Frontend Pages | 12 trang chính + 10 trang admin + 5 trang student |
| Frontend Components | 22 components chung + nhiều component con |
| Seed Files | 10 files |
| Tài liệu Markdown (Gốc) | 12 files |

---

## 2. VẤN ĐỀ CHÍNH ĐANG TỒN TẠI

### 2.1. "Rác Kỹ thuật" (Technical Debt) - Mức độ: 🟡 TRUNG BÌNH

#### A. Dữ liệu Hardcode trong Frontend
| File | Nội dung | Vấn đề |
|---|---|---|
| `frontend/src/data/AboutData.ts` | Lịch sử Học viện, Sứ mệnh, Sơ đồ tổ chức | **Không thể sửa từ Admin**. Mỗi khi thay đổi phải sửa code. |
| `frontend/src/data/EducationData.ts` | Chương trình đào tạo 4 năm (64 môn học) | **Trùng lặp với dữ liệu Course trong Backend**. Khó đồng bộ. |
| `frontend/src/pages/News.tsx` | Danh mục tin tức (`CATEGORIES`) | Hardcode danh mục, không lấy từ API. |

#### B. Seed Files Chồng chéo
Hiện có **10 file seed** trong backend với chức năng chồng lấn:
| File | Chức năng | Trạng thái |
|---|---|---|
| `seed_accurate_data.py` | Seed toàn bộ (settings, pages, departments, staff, news, FAQs...) | **Chính** |
| `seed_news.py` | Seed tin tức (đã cập nhật đa ngữ) | **Chính** |
| `seed_history.py` | Seed mốc lịch sử | **Chính** |
| `seed_staff.py` | Seed nhân sự | **Có thể trùng** với `seed_accurate_data` |
| `seed_data.py` (core) | Seed dữ liệu cơ bản | **Cần kiểm tra** |
| `seed_initial_data.py` (users) | Seed groups, users mặc định | **Chính** |
| `seed_academic_data.py` | Seed năm học, học kỳ | **Chính** |
| `seed_admission_period.py` | Seed kỳ tuyển sinh | **Chính** |
| `seed_groups.py` | Seed groups | **Có thể trùng** với `seed_initial_data` |
| `scripts/debug/seed_missing_pages.py` | Script debug tạm thời | **Nên XÓA** |

#### C. Files & Folders Không Cần Thiết
| Đường dẫn | Lý do nên xử lý |
|---|---|
| `student_portal_enhancement_plan.md.resolved` | File tạm của công cụ, không có giá trị. |
| `backup_approvals_*.json`, `backup_petitions_*.json` | File backup cũ, nên lưu trữ riêng. |
| `trangchu_chanhdien.jpg` (gốc dự án) | Ảnh nên nằm trong `frontend/public/images`. |
| `package-lock.json` (gốc dự án, 90 bytes) | File rỗng vô nghĩa, có thể gây hiểu lầm. |
| `migration_input.txt` | File debug tạm thời. |
| `backend/scripts/debug/` | Thư mục debug, không nên tồn tại trong production. |

#### D. Tài liệu Markdown Phân tán
Thư mục gốc có quá nhiều file `.md` (12 files):
- `BAO_CAO_ON_DINH_WEB_CONG_KHAI.md`
- `DATABASE_SCHEMA.md`
- `MASTER_PLAN_2026.md`
- `PROJECT_ARCHITECTURE_ANALYSIS.md`
- `QUICK_START.md`
- `RESEARCH_VERIFIED_FACTS.md`
- `STUDENT_PORTAL_PLAN.md`
- `TRANSLATION_DICTIONARY.md`
- `VBU_ANALYSIS_REFERENCE.md`
- `KHMER_TRANSLATION_GUIDE.md`
- `bulk_import_guide.md`

➡️ **Vấn đề:** Khó tìm kiếm, không rõ đâu là tài liệu chính thức, đâu là tài liệu cũ.

---

### 2.2. Vấn đề Song ngữ (Bilingual/i18n) - Mức độ: 🟠 QUAN TRỌNG

Dự án yêu cầu hỗ trợ **2 ngôn ngữ: Tiếng Việt (VI) & Tiếng Khmer (KM)**. Hiện trạng triển khai:

#### A. Trạng thái Hiện tại
| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| **Frontend i18n (react-i18next)** | ✅ Đã cài đặt | `i18n.ts`, `vi.json`, `km.json` |
| **Header Language Switcher** | ✅ Hoạt động | Nút VI/KH chuyển ngôn ngữ |
| **API Accept-Language Header** | ✅ Hoạt động | `client.ts` tự động gửi header |
| **Backend BilingualSerializerMixin** | ✅ Hoạt động | Trả về `title`, `excerpt`, `content` theo ngôn ngữ |
| **News (Tin tức)** | ✅ Đa ngữ đầy đủ | `seed_news.py` đã có VN + KM |
| **History Milestones** | ✅ Đa ngữ đầy đủ | `seed_history.py` đã có VN + KM |

#### B. Vấn đề Còn Tồn Tại
| Vấn đề | Chi tiết | Mức độ |
|---|---|---|
| **1. Dữ liệu thiếu bản dịch Khmer** | Nhiều model chưa có data Khmer (Pages, FAQs, Partners, Staff bio) | 🔴 Cao |
| **2. Frontend UI labels chưa dịch đủ** | `vi.json` và `km.json` chỉ có ~50 keys, thiếu nhiều text trong pages | 🟡 TB |
| **3. Hardcoded Vietnamese text** | Một số trang vẫn có text tiếng Việt hardcode (không dùng `t()`) | 🟡 TB |
| **4. AboutData.ts & EducationData.ts** | File này **hoàn toàn không có Khmer**, hardcode tiếng Việt | 🔴 Cao |
| **5. Không có fallback rõ ràng** | Một số nơi không fallback về VI khi KM trống | 🟡 TB |
| **6. Admin CMS chưa có hướng dẫn nhập liệu KM** | Người dùng Admin không biết nhập Khmer ở đâu | 🟡 TB |

#### C. Danh sách Pages/Components Cần Kiểm tra Song ngữ
| Trang/Component | Trạng thái | Cần làm |
|---|---|---|
| `Header.tsx` | ✅ Đã dùng `t()` | OK |
| `Footer.tsx` | ❓ Chưa kiểm tra | Cần review |
| `Home.tsx` | ❓ Chưa kiểm tra | Cần review |
| `About.tsx` | ⚠️ Dùng API nhưng AboutData.ts hardcode | Xóa file data, dùng API thuần |
| `News.tsx` | ✅ Đã sửa dùng `title` thay `title_vi` | OK |
| `Admissions.tsx` | ❓ Chưa kiểm tra | Cần review |
| `Contact.tsx` | ❓ Chưa kiểm tra | Cần review |
| `Education.tsx` | ⚠️ Dùng EducationData.ts hardcode | Xóa file data, dùng API Courses |
| `StudentPortal.tsx` | ❓ Chưa kiểm tra | Cần review |

#### D. Danh sách Models Backend Cần Bổ sung Dữ liệu Khmer
| Model | Trạng thái VN | Trạng thái KM |
|---|---|---|
| `News` | ✅ Đầy đủ 10 bài | ✅ Đầy đủ 10 bài |
| `HistoryMilestone` | ✅ Đầy đủ 5 mốc | ✅ Đầy đủ 5 mốc |
| `Page` (About, Mission) | ✅ Có | ❌ Chưa có KM |
| `FAQ` | ✅ Có | ❌ Chưa có KM |
| `StaffMember` (bio) | ✅ Có | ❌ Chưa có KM |
| `Partner` | ✅ Có | ❌ Chưa có KM |
| `Department` | ✅ Có | ❌ Chưa có KM |
| `SiteSetting` | ✅ Có | ⚠️ Một phần |
| `Banner` | ✅ Có | ❌ Chưa có KM |

#### E. Đề xuất Hành động Song ngữ (Ưu tiên)
1. **[Ưu tiên 1]** Bổ sung dữ liệu Khmer cho `Page`, `FAQ`, `Department` trong seed files
2. **[Ưu tiên 2]** Review và thêm `t()` cho các trang chưa dùng i18n
3. **[Ưu tiên 3]** Mở rộng `vi.json` và `km.json` với tất cả UI labels
4. **[Ưu tiên 4]** Tạo hướng dẫn nhập liệu Khmer trong Admin (có thể dùng `KHMER_TRANSLATION_GUIDE.md`)
5. **[Ưu tiên 5]** Xóa `AboutData.ts` và `EducationData.ts`, thay bằng API calls với dữ liệu đa ngữ

---

## 3. KẾ HOẠCH DỌN DẸP & ĐỒNG BỘ

### GIAI ĐOẠN 1: DỌN RÁC (1-2 ngày)

#### 3.1.1. Danh sách NÊN XÓA
| File/Folder | Lý do |
|---|---|
| `student_portal_enhancement_plan.md.resolved` | File tạm của hệ thống. |
| `package-lock.json` (gốc) | File rỗng vô nghĩa. |
| `migration_input.txt` | File debug. |
| `backend/scripts/debug/` | Thư mục debug trong production. |
| `seed_groups.py` | Trùng chức năng với `seed_initial_data.py`. |

#### 3.1.2. Danh sách NÊN LƯU TRỮ (Archive sang thư mục `docs/archive/`)
| File | Lý do |
|---|---|
| `backup_approvals_*.json` | Backup cũ, giữ lại phòng hờ. |
| `backup_petitions_*.json` | Backup cũ. |
| `VBU_ANALYSIS_REFERENCE.md` | Tài liệu tham khảo, không cần thiết hàng ngày. |
| `RESEARCH_VERIFIED_FACTS.md` | Tài liệu nghiên cứu đã hoàn thành. |
| `DỰ ÁN E-SANGHA.docx` | Tài liệu gốc, lưu trữ. |

#### 3.1.3. Danh sách GIỮ LẠI & TỔ CHỨC
| File | Vị trí mới | Ghi chú |
|---|---|---|
| `QUICK_START.md` | Giữ nguyên gốc | Quan trọng cho developer mới. |
| `DATABASE_SCHEMA.md` | `docs/technical/` | Tài liệu kỹ thuật. |
| `PROJECT_ARCHITECTURE_ANALYSIS.md` | `docs/technical/` | Tài liệu kỹ thuật. |
| `MASTER_PLAN_2026.md` | `docs/planning/` | Tài liệu kế hoạch. |
| `STUDENT_PORTAL_PLAN.md` | `docs/planning/` | Tài liệu kế hoạch. |
| `TRANSLATION_DICTIONARY.md` | `docs/localization/` | Tài liệu đa ngữ. |
| `KHMER_TRANSLATION_GUIDE.md` | `docs/localization/` | Tài liệu đa ngữ. |
| `trangchu_chanhdien.jpg` | `frontend/public/images/hero/` | Ảnh banner. |

---

### GIAI ĐOẠN 2: ĐỒNG BỘ CẤU TRÚC (2-3 ngày)

#### 3.2.1. Cấu trúc Thư mục CHUẨN NÊN DÙNG
```
web_HVPGNTK/
├── README.md                     # Hướng dẫn chính
├── QUICK_START.md                # Hướng dẫn cài đặt nhanh
├── .gitignore
├── run_website.bat               # Script chạy development
│
├── docs/                         # TÀI LIỆU (Tổ chức lại)
│   ├── technical/                # Tài liệu kỹ thuật (API, Schema)
│   ├── planning/                 # Kế hoạch, Roadmap
│   ├── localization/             # Từ điển, Hướng dẫn dịch
│   └── archive/                  # Tài liệu cũ, backup
│
├── backend/                      # BACKEND (Django)
│   ├── apps/                     # Các ứng dụng Django
│   ├── config/                   # Settings Django
│   ├── scripts/                  # Scripts hỗ trợ (KHÔNG có debug)
│   └── ...
│
└── frontend/                     # FRONTEND (React)
    ├── public/
    │   └── images/               # Ảnh tĩnh (banner, icons)
    └── src/
        ├── api/                  # API clients
        ├── components/           # Components tái sử dụng
        │   ├── common/           # Buttons, Cards, Inputs (CHUNG)
        │   ├── layout/           # Header, Footer, Sidebar
        │   └── [feature]/        # Components theo tính năng
        ├── pages/                # Các trang
        ├── hooks/                # Custom hooks
        ├── lib/                  # Utilities, helpers
        ├── locales/              # i18n translations
        ├── types/                # TypeScript interfaces
        └── theme/                # Design tokens, colors
```

#### 3.2.2. Quy tắc Đặt tên Thống nhất
| Loại | Quy tắc | Ví dụ |
|---|---|---|
| **Thư mục** | `kebab-case` hoặc `lowercase` | `history-timeline/`, `common/` |
| **Component React** | `PascalCase` | `NewsCard.tsx`, `HistoryTimeline.tsx` |
| **Hook** | `camelCase` với prefix `use` | `useFetch.ts`, `useTranslation.ts` |
| **API file** | `camelCase` | `cms.ts`, `auth.ts` |
| **Django App** | `lowercase` | `academic`, `admissions` |
| **Django Model** | `PascalCase` (singular) | `News`, `StaffMember` |
| **Seed Command** | `seed_[resource].py` | `seed_news.py`, `seed_staff.py` |

---

### GIAI ĐOẠN 3: CHUẨN HÓA NỘI DUNG QUẢN TRỊ (3-5 ngày)

#### 3.3.1. Danh sách Nội dung NÊN ĐỘNG HÓA (Quản lý từ Admin)
| Nội dung | Hiện tại | Đề xuất |
|---|---|---|
| **Lịch sử Học viện (Timeline)** | Hardcode trong `AboutData.ts` | ✅ Đã có model `HistoryMilestone` → Dùng API |
| **Sứ mệnh, Tầm nhìn** | Hardcode trong `AboutData.ts` | Tạo model `CoreValue` hoặc dùng `Page` với slug `mission` |
| **Sơ đồ Tổ chức** | Hardcode trong `AboutData.ts` | Dùng model `StaffMember` với trường `parent_id` |
| **Chương trình Đào tạo** | Hardcode trong `EducationData.ts` | ✅ Đã có model `Course` → Dùng API |
| **Danh mục Tin tức** | Hardcode trong `News.tsx` | Tạo API endpoint `/cms/news/categories/` |
| **Thông tin Liên hệ** | ✅ Đã có trong `SiteSetting` | Giữ nguyên |
| **Banner Trang chủ** | ✅ Đã có model `Banner` | Giữ nguyên |

#### 3.3.2. Danh sách Nội dung CÓ THỂ GIỮ TĨNH
| Nội dung | Lý do |
|---|---|
| Labels i18n (`vi.json`, `km.json`) | Ít thay đổi, cần build lại khi sửa. |
| Icons, Illustrations | Ít thay đổi. |
| Layout Header/Footer | Cấu trúc cố định. |

---

### GIAI ĐOẠN 4: TÁI SỬ DỤNG & DÙNG CHUNG (Liên tục)

#### 3.4.1. Components NÊN TÁCH RA DÙNG CHUNG
| Component | Mô tả | Files sẽ dùng |
|---|---|---|
| `<Card />` | Thẻ hiển thị tin tức, sự kiện, nhân sự | News, About, Home |
| `<SectionHeader />` | Tiêu đề section với underline vàng | Tất cả các trang |
| `<LoadingSpinner />` | Spinner loading đồng nhất | Tất cả |
| `<ErrorMessage />` | Hiển thị lỗi đồng nhất | Tất cả |
| `<Pagination />` | Phân trang đồng nhất | News, Admin pages |
| `<LanguageSwitcher />` | Chuyển đổi ngôn ngữ | Header |
| `<FormWizard />` | Form nhiều bước (Tuyển sinh) | Admissions |

#### 3.4.2. Logic/Hook NÊN DÙNG CHUNG
| Hook | Chức năng | Đã có? |
|---|---|---|
| `useFetch` | Fetch data với loading/error | ✅ Có |
| `useTranslation` | Đa ngữ i18n | ✅ Có |
| `usePagination` | Quản lý phân trang | ❌ Chưa (đang inline) |
| `useDebounce` | Debounce search | ❌ Chưa (đang inline trong News.tsx) |
| `useLocalStorage` | Lưu trữ local | ❌ Chưa |

#### 3.4.3. API Layer NÊN CHUẨN HÓA
Hiện tại `frontend/src/api/` có 6 files:
- `auth.ts`
- `client.ts`
- `cms.ts`
- ...

➡️ **Đề xuất:** Tạo `api/index.ts` để export tập trung, dễ import.

---

## 4. DANH SÁCH HÀNH ĐỘNG CỤ THỂ (Theo Thứ tự Ưu tiên)

### Ưu tiên 1: DỌN RÁC (Làm ngay)
- [ ] Xóa `student_portal_enhancement_plan.md.resolved`
- [ ] Xóa `package-lock.json` (gốc)
- [ ] Xóa `migration_input.txt`
- [ ] Xóa `backend/scripts/debug/`
- [ ] Xóa `seed_groups.py` (sau khi xác nhận trùng)
- [ ] Di chuyển `backup_*.json` vào `docs/archive/`
- [ ] Di chuyển `trangchu_chanhdien.jpg` vào `frontend/public/images/hero/`

### Ưu tiên 2: TỔ CHỨC TÀI LIỆU
- [ ] Tạo cấu trúc `docs/technical/`, `docs/planning/`, `docs/localization/`, `docs/archive/`
- [ ] Di chuyển các file `.md` vào đúng thư mục

### Ưu tiên 3: ĐỘNG HÓA NỘI DUNG
- [ ] Xóa `frontend/src/data/AboutData.ts` → Dùng API `HistoryMilestone` + tạo API cho Mission
- [ ] Xóa `frontend/src/data/EducationData.ts` → Dùng API `Course`
- [ ] Tạo API `/cms/news/categories/` để lấy danh mục tin tức động

### Ưu tiên 4: TÁCH COMPONENT CHUNG
- [ ] Tạo `components/common/Card.tsx`
- [ ] Tạo `components/common/SectionHeader.tsx`
- [ ] Tạo `hooks/useDebounce.ts`
- [ ] Tạo `hooks/usePagination.ts`

### Ưu tiên 5: HỢP NHẤT SEED FILES
- [ ] Review và merge `seed_staff.py` vào `seed_accurate_data.py` nếu trùng
- [ ] Review `seed_data.py` (core)

---

## 5. LỢI ÍCH ĐẠT ĐƯỢC SAU PHASE NÀY

| Lợi ích | Mô tả |
|---|---|
| **Giảm 80% thời gian sửa nội dung** | Admin có thể tự cập nhật Lịch sử, Sứ mệnh, Chương trình mà không cần developer. |
| **Giảm 50% code trùng lặp** | Components và Hooks dùng chung. |
| **Dễ onboard developer mới** | Cấu trúc rõ ràng, quy tắc đặt tên thống nhất. |
| **Giảm lỗi khi deploy** | Không còn file debug, file tạm trong production. |
| **Dễ mở rộng** | Kiến trúc module hóa, tách bạch Frontend/Backend. |

---

## 6. ĐỀ XUẤT HƯỚNG ĐI CHO PHASE TIẾP THEO (Tóm tắt)

Sau khi hoàn thành Phase Ổn định Nền tảng này:
1. **Phase UI/UX Overhaul:** Áp dụng Design System thống nhất (đã có kế hoạch trong `UI_UX_MASTER_PLAN.md`).
2. **Phase Student Portal:** Hoàn thiện chức năng cổng sinh viên (xem điểm, thời khóa biểu, đơn từ).
3. **Phase Mobile App:** Đồng bộ dữ liệu với ứng dụng Flutter đã có.

---

**Người lập báo cáo:** Antigravity (Technical Lead AI)
**Trạng thái:** Chờ phê duyệt để triển khai
