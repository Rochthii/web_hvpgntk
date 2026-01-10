# 🔧 HƯỚNG DẪN BẢO TRÌ & CẬP NHẬT - HVPGNTK WEB

> **Mục đích:** Hệ thống quản lý màu sắc, kích thước TẬP TRUNG - dễ thay đổi sau này

---

## 🎯 NGUYÊN TẮC THIẾT KẾ

### ✅ LÀM ĐÚNG:
- **SỬ DỤNG CSS VARIABLES** (`var(--tên-biến)`) thay vì hard-code màu/size
- **MỘT NƠI THAY ĐỔI** → Toàn bộ website cập nhật
- **FOLLOW MOCKUPS** y chang về màu sắc, kích thước, spacing

### ❌ TRÁNH:
- ❌ Hard-code màu: `color: #FFA726` 
- ❌ Hard-code size: `font-size: 16px`
- ❌ Inline styles nếu có thể dùng class
- ❌ Tạo component không theo UI mockups

---

## 📁 CẤU TRÚC HỆ THỐNG

```
frontend/src/
├── styles/
│   └── variables.css  ⭐ FILE QUAN TRỌNG NHẤT - Tất cả biến ở đây
├── index.css          ⭐ Component styles chính
├── theme/            📦 TypeScript theme (optional)
│   ├── colors.ts
│   ├── typography.ts
│   └── ...
└── components/       🧩 React components
```

### ⭐ FILE CHÍNH: `variables.css`

**Đây là file DUY NHẤT anh cần sửa khi muốn thay đổi:**
- Màu sắc header/footer
- Kích thước chữ
- Khoảng cách (spacing)
- Viền, bóng, etc.

---

## 🎨 THAY ĐỔI MÀU SẮC

### VÍ DỤ 1: Đổi màu nút "THAM QUAN"

**File:** `frontend/src/styles/variables.css`

```css
:root {
  /* TRƯỚC */
  --color-primary: #FFA726;  /* Cam */
  
  /* SAU - Đổi sang xanh lá */
  --color-primary: #4CAF50;
}
```

**Kết quả:** TẤT CẢ nút primary, links, accents → đổi sang màu mới!

### VÍ DỤ 2: Đổi màu header/footer

```css
:root {
  /* TRƯỚC */
  --color-secondary: #6B2C2C;  /* Maroon đậm */
  
  /* SAU - Đổi sang nâu nhạt hơn */
  --color-secondary: #8D6E63;
}
```

### VÍ DỤ 3: Đổi màu nền trang

```css
:root {
  /* TRƯỚC */
  --color-bg-cream: #FFF3E0;
  
  /* SAU - Đổi sang trắng tinh */
  --color-bg-cream: #FFFFFF;
}
```

---

## 📏 THAY ĐỔI KÍCH THƯỚC

### VÍ DỤ 1: Tăng size chữ toàn bộ website

```css
:root {
  /* TRƯỚC */
  --font-size-base: 1rem;  /* 16px */
  
  /* SAU - Tăng lên 18px */
  --font-size-base: 1.125rem;
}
```

### VÍ DỤ 2: Tăng chiều cao nút

```css
:root {
  /* TRƯỚC */
  --btn-height-base: 44px;
  
  /* SAU - To hơn */
  --btn-height-base: 52px;
}
```

### VÍ DỤ 3: Tăng khoảng cách giữa sections

```css
:root {
  /* TRƯỚC */
  --section-padding-y: 5rem;  /* 80px */
  
  /* SAU - Rộng rãi hơn */
  --section-padding-y: 7rem;  /* 112px */
}
```

---

## 🔤 THAY ĐỔI FONT CHỮ

### VÍ DỤ: Đổi font tiêu đề

```css
:root {
  /* TRƯỚC */
  --font-heading: "Noto Serif Khmer", "Merriweather", serif;
  
  /* SAU - Dùng font khác */
  --font-heading: "Playfair Display", "Georgia", serif;
}
```

**Lưu ý:** Cần import font mới trong `index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
```

---

## 🌊 THAY ĐỔI BÓ ĐỔ (SHADOWS)

### VÍ DỤ: Shadow mờ hơn

```css
:root {
  /* TRƯỚC */
  --shadow-md: 0 10px 15px -3px rgba(107, 44, 44, 0.1);
  
  /* SAU - Mờ hơn (giảm opacity) */
  --shadow-md: 0 10px 15px -3px rgba(107, 44, 44, 0.05);
}
```

---

## 📱 RESPONSIVE - THAY ĐỔI TRÊN MOBILE

**File:** `frontend/src/index.css` (phần cuối)

```css
@media (max-width: 768px) {
  :root {
    /* Override cho mobile */
    --font-size-6xl: 2rem;      /* Hero nhỏ hơn */
    --section-padding-y: 3rem;  /* Padding ít hơn */
  }
}
```

---

## 🎭 THAY ĐỔI COMPONENTS

### Component: Button

**Nếu muốn thay đổi STYLE nút:**

**File:** `frontend/src/index.css`

```css
.btn-primary {
  /* Đổi: Bo góc hơn */
  border-radius: var(--border-radius-2xl);  /* Từ lg → 2xl */
  
  /* Đổi: Font to hơn */
  font-size: var(--font-size-lg);           /* Từ base → lg */
  
  /* Đổi: Thêm hiệu ứng */
  box-shadow: var(--shadow-lg);
}
```

### Component: Card

```css
.card-news {
  /* Đổi: Viền vàng dày hơn */
  border-width: var(--border-width-thick);  /* Từ base → thick */
  
  /* Đổi: Bo góc nhiều hơn */
  border-radius: var(--border-radius-2xl);  /* Từ xl → 2xl */
}
```

---

## 🔧 COMMON TASKS (Tác vụ thường gặp)

### 1. Thay đổi màu chủ đạo (primary color)

```css
/* variables.css */
:root {
  --color-primary: #YOUR_NEW_COLOR;
  --color-primary-dark: #DARKER_VERSION;
  --color-primary-light: #LIGHTER_VERSION;
}
```

### 2. Thay đổi màu header/footer

```css
:root {
  --color-secondary: #YOUR_NEW_COLOR;
}
```

### 3. Thay đổi font size toàn bộ

```css
html {
  font-size: 18px;  /* Từ 16px → 18px */
}
```

### 4. Thêm padding cho mobile

```css
@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-4);  /* 16px thay vì 24px */
  }
}
```

### 5. Ẩn/hiện elements trên mobile

```css
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
}
```

---

## 📋 CHECKLIST KHI THAY ĐỔI

### Trước khi deploy:

- [ ] Kiểm tra `variables.css` có biến nào hard-code không?
- [ ] Test trên Chrome, Firefox, Safari
- [ ] Test mobile (< 768px)
- [ ] Test tablet (768px - 1024px)
- [ ] Test desktop (> 1024px)
- [ ] Kiểm tra contrast màu chữ/nền (accessibility)
- [ ] Verify fonts load đúng (Khmer + Việt)

---

## 🐛 TROUBLESHOOTING

### Vấn đề 1: Màu không đổi sau khi sửa `variables.css`

**Giải pháp:**
1. Clear browser cache (Ctrl + Shift + R)
2. Check file có save không?
3. Restart dev server

### Vấn đề 2: Font Khmer không hiển thị

**Giải pháp:**
1. Check internet connection (fonts từ Google Fonts)
2. Verify import trong `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer...');
```

### Vấn đề 3: Responsive bị lỗi trên mobile

**Giải pháp:**
1. Check media queries trong `index.css`
2. Verify viewport meta tag trong `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 🎨 QUY TẮC VĂN HÓA PHẬT GIÁO KHMER

### Màu sắc:
- ✅ **Vàng/Gold:** Trang trọng, linh thiêng
- ✅ **Cam/Orange:** Năng lượng, tích cực (Áo cà sa)
- ✅ **Nâu/Maroon:** Ổn định, đại diện chùa Khmer
- ❌ **Tránh:** Đỏ quá chói, xanh lá quá sáng

### Họa tiết:
- ✅ Hoa sen (Lotus)
- ✅ Bánh xe pháp (Dharmachakra)
- ✅ Naga (Rắn thần 7 đầu)
- ✅ Họa tiết Khmer cổ điển
- ❌ **Tránh:** Hình ảnh động vật hung dữ

### Spacing:
- ✅ Rộng rãi, thoáng đãng
- ✅ Cân đối, đối xứng
- ❌ **Tránh:** Bí bách, chật chội

---

## 📚 TÀI LIỆU THAM KHẢO

### Files quan trọng:
1. `frontend/src/styles/variables.css` - ⭐ **CHÍNH**
2. `frontend/src/index.css` - Component styles
3. `frontend/DESIGN_SYSTEM.md` - Hướng dẫn chi tiết
4. `FRONDEND_WEB_HVPGNT/` - UI mockups gốc

### Khi cần hỗ trợ:
1. Xem lại UI mockups trong `FRONDEND_WEB_HVPGNT/`
2. Đọc `DESIGN_SYSTEM.md` để biết cách dùng classes
3. Check `variables.css` xem biến nào available

---

## ✅ KẾT LUẬN

**HỆ THỐNG NÀY ĐƯỢC THIẾT KẾ ĐỂ:**
- ✅ Dễ bảo trì - chỉ sửa 1 file (`variables.css`)
- ✅ Nhất quán - tất cả components dùng chung biến
- ✅ Scalable - dễ mở rộng sau này
- ✅ Phù hợp văn hóa Phật giáo Khmer

**QUY TẮC VÀNG:**
> Mọi thay đổi màu sắc, kích thước → BẮT ĐẦU TỪ `variables.css`

---

**Cập nhật:** 10/01/2026  
**Người tạo:** AI Assistant
