# 🎨 HVPGNTK DESIGN SYSTEM GUIDE

> Hệ thống thiết kế hoàn chỉnh dựa trên UI mockups - Buddhist Khmer Academy Theme

---

## 📁 CẤU TRÚC THEME

```
frontend/src/theme/
├── index.ts          # Main export
├── colors.ts         # Color palette
├── typography.ts     # Fonts & sizes
├── spacing.ts        # Spacing scale
├── shadows.ts        # Shadow system
└── borders.ts        # Border styles
```

---

## 🎨 COLORS (Màu sắc)

### Primary - Orange/Amber
```tsx
import { colors } from '@/theme';

<button className="bg-primary-500 text-white">
  THAM QUAN
</button>
```

**Màu chính:**
- `primary-500`: #FFA726 (Main orange CTA)
- `primary-600`: #FB8C00 (Hover state)

### Secondary - Maroon/Brown
```tsx
<header className="bg-secondary-900 text-white">
  Header
</header>
```

**Màu phụ:**
- `secondary-900`: #6B2C2C (Header/Footer)
- `secondary-700`: #4E342E (Dark sections)

### Gold - Ornamental
```tsx
<div className="border-2 border-gold-500 shadow-gold-md">
  Golden card
</div>
```

**Màu vàng trang trí:**
- `gold-500`: #D4AF37 (Classic gold)
- Shadows: `shadow-gold-sm`, `shadow-gold-md`, `shadow-gold-lg`

###  Cream - Background
```tsx
<div className="bg-cream-200">
  Main content area
</div>
```

**Nền:**
- `cream-200`: #FFF3E0 (Main background)
- `cream-50`: #FFFBF5 (Cards)

---

## 🔤 TYPOGRAPHY

### Font Families
```tsx
// Headings (Khmer + Serif)
<h1 className="font-heading text-5xl">
  HỌC VIỆN PHẬT GIÁO NAM TÔNG CẦN THƠ
</h1>

// Body text (Khmer + Sans)
<p className="font-body text-base">
  Nội dung chính
</p>
```

### Font Sizes
| Class | Size | Usage |
|-------|------|-------|
| `text-5xl` | 48px | Hero titles |
| `text-4xl` | 36px | Page titles |
| `text-3xl` | 30px | Section headings |
| `text-2xl` | 24px | Card titles |
| `text-xl` | 20px | Subtitles |
| `text-base` | 16px | Body text |
| `text-sm` | 14px | Small text |

---

## 🧩 COMPONENTS

### 1. Buttons

```tsx
// Primary CTA
<button className="btn-primary">
  THAM QUAN
</button>

// Secondary
<button className="btn-secondary">
  Xem Thêm
</button>

// Golden (special)
<button className="btn-gold">
  ĐĂNG KÝ NGAY
</button>

// Outline
<button className="btn-outline">
  Tìm hiểu
</button>
```

### 2. Cards

```tsx
// News Card
<div className="card-news">
  <img src="..." />
  <h3>Tin tức</h3>
  <p>Nội dung...</p>
</div>

// Staff Card
<div className="card-staff">
  <img className="rounded-full" />
  <h4>HT. Thích Thọng Cả</h4>
  <p>Ví trưởng</p>
</div>

// Course Card
<div className="card-course">
  <h3>Pali 1 (8 tín chỉ)</h3>
  <p>Năm 1</p>
</div>
```

### 3. Hero Section

```tsx
<section className="hero-section">
  <div className="hero-content">
    <h1 className="hero-title">
      HỌC VIỆN PHẬT GIÁO<br/>
      NAM TÔNG CẦN THƠ
    </h1>
    <button className="btn-primary mt-8">
      THAM QUAN
    </button>
  </div>
</section>
```

### 4. Stats Section (1992, 150+, 30+)

```tsx
<div className="stats-grid">
  <div className="stat-card">
    <div className="stat-number">1992</div>
    <div className="stat-label">Năm thành lập</div>
  </div>
  <div className="stat-card">
    <div className="stat-number">150+</div>
    <div className="stat-label">Tăng tín đồ</div>
  </div>
  <div className="stat-card">
    <div className="stat-number">30+</div>
    <div className="stat-label">Khóa học</div>
  </div>
</div>
```

### 5. Tabs (About page)

```tsx
<div className="tabs">
  <button className="tab-active">Tổng quan</button>
  <button className="tab">Lịch sử</button>
  <button className="tab">Sứ mệnh</button>
  <button className="tab">Tổ chức</button>
</div>
```

### 6. Form Inputs

```tsx
<div>
  <label className="form-label">
    Họ và tên Khmer (ឈ្មោះភាសាខ្មែរ)
  </label>
  <input
    type="text"
    className="form-input"
    placeholder="តុប ពុករ័ត្ន"
  />
</div>
```

### 7. Timeline (About page)

```tsx
<div className="timeline">
  <div className="timeline-item">
    <div className="timeline-marker"></div>
    <div>
      <strong>1992</strong>
      <p>Thành lập văn phòng</p>
    </div>
  </div>
</div>
```

---

## 🎭 ORNAMENTAL BORDERS

### Golden Decorative Frames

```tsx
// Full ornate border (like in UI)
<div className="ornate-border">
  Content
</div>

// Top border only
<section className="ornate-border-top">
  Header section
</section>

// Corner decorations
<div className="ornate-corner">
  Fancy content
</div>
```

**Note:** Cần có SVG assets:
- `/public/images/border-gold-ornate.svg`
- `/public/images/border-top-gold.svg`
- `/public/images/corner-gold-tl.svg`
- `/public/images/corner-gold-tr.svg`

---

## 📐 LAYOUTS

### Container Max-Width
```tsx
<div className="container mx-auto max-w-8xl px-6">
  Content limited to 1400px
</div>
```

### Grid Layouts
```tsx
// 3 columns (Stats, News cards)
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {items.map(...)}
</div>

// 2 columns staff cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {staff.map(...)}
</div>
```

---

## 🌈 UTILITY CLASSES

### Text Gradients
```tsx
<h1 className="text-gradient-gold">
  Golden text
</h1>
```

### Scrollbar
```tsx
<div className="overflow-y-auto scrollbar-thin">
  Long content
</div>
```

### Animations
```tsx
<div className="animate-fade-in-up">
  Fades in from bottom
</div>
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Example
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>
```

---

## 🎯 BEST PRACTICES

### 1. Color Usage
- **Header/Footer:** `bg-secondary-900`
- **Main Background:** `bg-cream-200`
- **Cards:** `bg-white` or `bg-cream-50`
- **CTAs:** `bg-primary-500`
- **Borders:** `border-gold-400`

### 2. Typography
- **Headers:** Always use `font-heading`
- **Body:** Use `font-body` or `font-sans`
- **Vietnamese + Khmer:** Fonts support both

### 3. Spacing
- Stick to 8px grid: `p-4`, `p-6`, `p-8`
- Gap between elements: `gap-6`, `gap-8`

### 4. Shadows
- Cards: `shadow-md` or `shadow-warm`
- Golden glow: `shadow-gold-md`

---

## 🖼️ ASSETS NEEDED

Create these SVG/image files:

1. **Decorative Borders**
   - `/public/images/border-gold-ornate.svg`
   - `/public/images/border-top-gold.svg`
   - `/public/images/border-bottom-gold.svg`

2. **Corner Ornaments**
   - `/public/images/corner-gold-tl.svg` (top-left)
   - `/public/images/corner-gold-tr.svg` (top-right)

3. **Hero Background**
   - `/public/images/temple-hero.jpg`

4. **Patterns**
   - `/public/images/pattern-ornate.svg`

---

## ✅ CHECKLIST TRIỂN KHAI

- [x] Tạo theme system (`/theme/*.ts`)
- [x] Cập nhật `tailwind.config.js`
- [x] Tạo CSS utilities (`index.css`)
- [ ] Tạo SVG assets (borders, corners)
- [ ] Apply theme vào components
- [ ] Test responsive trên mobile/tablet
- [ ] Verify Khmer fonts load correctly

---

**Tài liệu này giúp maintain dễ dàng - tất cả màu sắc, spacing, typography đều nằm trong theme files!** 🎨
