# HƯỚNG DẪN DỊCH NỘI DUNG SANG TIẾNG KHMER
## Học viện Phật giáo Nam tông Khmer

**Mục đích:** Cung cấp bản dịch chuẩn xác, phù hợp bản sắc Phật giáo Theravada và văn hóa Khmer

---

## 📋 MỤC LỤC

1. [Nguyên tắc dịch](#nguyên-tắc-dịch)
2. [Từ vựng Phật giáo chuẩn](#từ-vựng-phật-giáo-chuẩn)
3. [Dịch bài viết tin tức](#dịch-tin-tức)
4. [Dịch trang nội dung](#dịch-trang-nội-dung)
5. [Dịch thông tin nhân sự](#dịch-nhân-sự)
6. [Cách nhập trong Django Admin](#cách-nhập-admin)

---

## 1. NGUYÊN TẮC DỊCH

### 1.1. Ưu tiên từ ngữ Pali gốc

Các thuật ngữ Phật giáo **GIỮ NGUYÊN từ Pali** khi dịch sang Khmer:

| Tiếng Việt | ❌ KHÔNG dịch thành | ✅ DÙNG từ Pali-Khmer |
|------------|---------------------|----------------------|
| Kinh Tạng | សៀវភៅសូត្រ | **សុត្តន្តបិដក** (Suttanta Piṭaka) |
| Luật Tạng | ច្បាប់ព្រះពុទ្ធសាសនា | **វិន័យបិដក** (Vinaya Piṭaka) |
| Luận Tạng | សៀវភៅបំណ្តុះបំណាល | **អភិធម្មបិដក** (Abhidhamma Piṭaka) |
| An cư Kiết hạ | សំរាក​និង​ប្រតិបត្តិ | **ចូលវស្សា** (Vassa) |
| Tỳ kheo | ព្រះសង្ឃ (chung chung) | **ភិក្ខុ** (Bhikkhu) |

### 1.2. Giữ tên riềng Việt Nam

**KHÔNG dịch** tên địa danh, chức danh hành chính VN:

- "Thành phố Cần Thơ" → **ទីក្រុង Can Tho** (phiên âm)
- "Quận Ô Môn" → **ស្រុក O Mon**
- "Ban Giám hiệu" → **គណៈនាយកដ្ឋាន** (dịch nghĩa đúng)

### 1.3. Ngữ cảnh Phật giáo

Dùng ngôn ngữ trang trọng, thể hiện tôn kính:

- ❌ "Các thầy tăng" → គ្រូព្រះសង្ឃ (quá đơn giản)
- ✅ "Đại đức Tăng" → **ព្រះតេជោ្ជគុណ** (tôn xưng cao)
- ✅ "Chư Tăng" → **ភិក្ខុសង្ឃ** hoặc **ពោធិសត្វ**

---

## 2. TỪ VỰNG PHẬT GIÁO CHUẨN

### 2.1. Tam Bảo (តេត្រីរ័ត្ន - Tiratana)

| Tiếng Việt | Tiếng Khmer (Pali) |
|------------|---------------------|
| Phật | ព្រះពុទ្ធ (Buddha) |
| Pháp | ព្រះធម៌ (Dhamma) |
| Tăng | ព្រះសង្ឃ (Saṅgha) |

### 2.2. Tam Tạng (តេបិដក - Tipiṭaka)

| Tiếng Việt | Tiếng Khmer |
|------------|-------------|
| Luật Tạng | វិន័យបិដក (Vinaya Piṭaka) |
| Kinh Tạng | សុត្តន្តបិដក (Suttanta Piṭaka) |
| Luận Tạng | អភិធម្មបិដក (Abhidhamma Piṭaka) |

### 2.3. Nghi lễ & Tu hành

| Tiếng Việt | Tiếng Khmer |
|------------|-------------|
| An cư Kiết hạ | ចូលវស្សា (Vassa) |
| Lễ Phật Đản | ពិធីបុណ្យវិសាខបូជា (Vesak Puja) |
| Lễ Kathina | ពិធីបុណ្យកឋិន (Kathina) |
| Thiền Vipassana | សមាធិវិបស្សនា (Vipassanā Bhāvanā) |
| Tụng kinh | ថ្វាយសូត្រ |
| Hành thiền | អនុវត្តសមាធិ |
| Ngày Uposatha | ថ្ងៃឧបោសថ (Uposatha Day) |

### 2.4. Chức danh Tăng đoàn

| Tiếng Việt | Tiếng Khmer |
|------------|-------------|
| Hòa thượng | ព្រះឧបាជ្ឈាយ៍ (Upajjhāya) |
| Thượng tọa | ព្រះស្ថេរ (Thera) |
| Đại đức | ព្រះតេជោ្ជគុណ |
| Sa-di | សាមណេរ (Sāmaṇera) |
| Tăng sinh | សិស្សភិក្ខុ (Student Monk) |

### 2.5. Học thuật

| Tiếng Việt | Tiếng Khmer |
|------------|-------------|
| Cử nhân Phật học | បរិញ្ញាបត្រពុទ្ធសាសនា |
| Pali-Khmer | បាលី-ខ្មែរ |
| Học kỳ | ឆមាស |
| Tín chỉ | ក្រេឌីត |
| Khóa học | វគ្គសិក្សា |
| Chương trình đào tạo | កម្មវិធីអប់រំ |

---

## 3. DỊCH TIN TỨC

### 📰 Bài 1: Lễ Khánh Thành Chánh Điện

**Title Vietnamese:**
"Lễ Khánh Thành Chánh Điện và Kiết Giới Sima tại Học viện Phật giáo Nam tông Khmer"

**Title Khmer:**
```
ពិធីសម្ពោធព្រះវិហារធំ និងការកំណត់ព្រំដែនសីមា នៅពុទ្ធិកវិទ្យាល័យពុទ្ធសាសនានិកាយខ្មែរ
```

**Excerpt Vietnamese:**
"Ngày 15/2/2025, Học viện Phật giáo Nam tông Khmer tổ chức trọng thể Lễ Khánh thành Chánh điện..."

**Excerpt Khmer:**
```
នៅថ្ងៃទី១៥ ខែកុម្ភៈ ឆ្នាំ២០២៥ ពុទ្ធិកវិទ្យាល័យពុទ្ធសាសនានិកាយខ្មែរ បានរៀបចំពិធីសម្ពោធព្រះវិហារធំដ៏ធំធេង...
```

**Content Khmer (đoạn đầu):**
```html
<h2>ព្រឹត្តិការណ៍ដ៏អស្ចារ្យនៃពុទ្ធសាសនានិកាយខ្មែរ</h2>

<p>នៅព្រឹកថ្ងៃទី១៥ ខែកុម្ភៈ ឆ្នាំ២០២៥ នៅពុទ្ធិកវិទ្យាល័យពុទ្ធសាសនានិកាយខ្មែរ (ភូមិ Châu Văn Liêm ស្រុក Ô Môn ទីក្រុង Can Tho) បានប្រព្រឹត្តទៅនូវពិធីសម្ពោធព្រះវិហារធំ និងការកំណត់ព្រំដែនសីមា ដែលជាព្រឹត្តិការណ៍ប្រវត្តិសាស្រ្តដែលបង្ហាញពីការបញ្ចប់នៃការសាងសង់រយៈពេល២០ឆ្នាំ។</p>

<p>សំណង់ព្រះវិហារធំនេះបានចាប់ផ្តើមសាងសង់តាំងពីខែឧសភា ឆ្នាំ២០២០ ជាមួយនឹងស្ថាបត្យកម្មប្រពៃណីពុទ្ធសាសនានិកាយខ្មែរ ដែលបង្ហាញពីភាពសុខដុមរវាងសាសនា និងសោភ័ណភាពជាតិសាសន៍។ នេះគឺជាកន្លែងដ៏ទៀងទាត់សម្រាប់ព្រះសង្ឃប្រារព្ធពិធីសាសនា ថ្វាយព្រះសូត្រ និងឱ្យប្រជាជនពុទ្ធសាសនិកបូជា។</p>

<h3>សារៈសំខាន់នៃពិធីកំណត់ព្រំដែនសីមា</h3>

<p>ពិធីកំណត់ព្រំដែនសីមា (Sīmā-sammuti) គឺជាការប្រារព្ធដ៏សំខាន់បំផុតក្នុងពុទ្ធសាសនាថេរវាទ ដែលកំណត់ព្រំដែនបវិត្រនៃព្រះវិហារធំ ជាកន្លែងដែលព្រះសង្ឃអនុវត្តសកម្មភាពសង្ឃដូចជា ការទទួលឧបសម្បទា ការចូលវស្សា។ បន្ទាប់ពីការកំណត់ព្រំដែន ព្រះវិហារធំក្លាយជាកន្លែងស្នាក់នៃសង្ឃដោយស្របតាមវិន័យបិដក។</p>
```

---

### 📰 Bài 2: Khóa Thiền Vipassana

**Title Khmer:**
```
សង្ខេបវគ្គសមាធិវិបស្សនា៖ សិស្សជាង២០០នាក់បានបញ្ចប់កម្មវិធី
```

**Excerpt Khmer:**
```
នៅថ្ងៃទី៣ ខែសីហា ឆ្នាំ២០២៤ ពុទ្ធិកវិទ្យាល័យបានរៀបចំពិធីសង្ខេបវគ្គសមាធិវិបស្សនា ដែលមានការចូលរួមពីសិស្សជាង២០០នាក់ និងបុណ្យសាសនិក...
```

---

## 4. DỊCH TRANG NỘI DUNG

### 📄 Trang "Giới thiệu" (About)

**Section: Lịch sử**

**Vietnamese:**
"Được thành lập theo Quyết định số 171/QĐ/TGCP ngày 14/9/2006..."

**Khmer:**
```
ត្រូវបានបង្កើតឡើងតាមសេចក្តីសម្រេចលេខ ១៧១/QĐ/TGCP ចុះថ្ងៃទី១៤ ខែកញ្ញា ឆ្នាំ២០០៦ របស់ក្រុមប្រឹក្សាសាសនារដ្ឋាភិបាល។ នេះគឺជាពុទ្ធិកវិទ្យាល័យទីបួននៃប្រទេស និងជាដំបូងបង្អស់សម្រាប់និកាយថេរវាទខ្មែរ។
```

**Section: Sứ mệnh**

**Vietnamese:**
"Đào tạo Cử nhân Phật học Pali - Khmer và Tôn giáo học..."

**Khmer:**
```
អប់រំបណ្តុះបណ្តាលបរិញ្ញាបត្រពុទ្ធសាសនាបាលី-ខ្មែរ និងសាសនាសាស្រ្ត ជួយសង្គមឱ្យមានចំណេះដឹងស៊ីជម្រៅទាំងខាងពុទ្ធសាសនា និងខាងសេដ្ឋកិច្ចសង្គម។
```

---

## 5. DỊCH THÔNG TIN NHÂN SỰ

### 👤 Ví dụ: Hòa thượng Đào Như

**Display Name (Vietnamese):**
"Hòa thượng Đào Như"

**Display Name (Khmer):**
```
ព្រះឧបាជ្ឈាយ៍ Đào Như
```

**Title (Vietnamese):**
"Tiến sĩ Phật học, Viện trưởng Học viện"

**Title (Khmer):**
```
បណ្ឌិតពុទ្ធសាសនា អគ្គនាយកពុទ្ធិកវិទ្យាល័យ
```

**Bio (Vietnamese):**
"Hòa thượng Đào Như có hơn 30 năm tu học và giảng dạy..."

**Bio (Khmer):**
```
ព្រះឧបាជ្ឈាយ៍ Đào Như មានបទពិសោធន៍ជាង៣០ឆ្នាំក្នុងការសិក្សា និងបង្រៀនពុទ្ធសាសនា...
```

---

## 6. CÁCH NHẬP TRONG DJANGO ADMIN

### Bước 1: Truy cập Admin
```
http://localhost:8000/admin/
```

### Bước 2: Chọn mục cần dịch
- **News (Tin tức):** `/admin/cms/news/`
- **Pages (Trang):** `/admin/cms/page/`
- **Staff (Nhân sự):** `/admin/cms/staffmember/`

### Bước 3: Edit bài viết
1. Click vào bài cần dịch
2. Scroll xuống đến section **"🇰🇭 មាតិកាភាសាខ្មែរ"**
3. Click vào **"Show"** để mở rộng
4. Nhập nội dung Khmer vào các trường:
   - `title_km` - Tiêu đề Khmer
   - `excerpt_km` - Tóm tắt Khmer
   - `content_km` - Nội dung đầy đủ Khmer

### Bước 4: Lưu
- Click **"Save"** ở dưới cùng
- Hoặc **"Save and continue editing"** nếu muốn kiểm tra thêm

### ⚠️ Lưu ý quan trọng

1. **Font Khmer:** Đảm bảo máy tính có cài font **Khmer OS** hoặc **Noto Sans Khmer**
2. **Keyboard:** Bật bộ gõ tiếng Khmer (Windows: Settings > Time & Language > Language)
3. **Fallback:** Nếu để trống Khmer, hệ thống tự hiển thị Tiếng Việt
4. **HTML:** Có thể copy HTML từ trường `_vi` sang `_km` rồi dịch text bên trong tags

---

## 7. CHECKLIST DỊCH HOÀN CHỈNH

### ✅ Nội dung cần dịch ưu tiên

- [ ] **Trang Giới thiệu** (about) - Lịch sử, Sứ mệnh
- [  ] **10 bài Tin tức** quan trọng nhất
- [ ] **Thông tin Ban Giám hiệu** (5-7 vị)
- [ ] **FAQ** phổ biến (10 câu hỏi)
- [ ] **HistoryMilestone** (5 mốc quan trọng: 2006, 2017, 2019, 2023, 2025)

### ✅ Thống nhất thuật ngữ

Luôn xem lại `TRANSLATION_DICTIONARY.md` để đảm bảo dùng từ ngữ chuẩn.

---

## PHỤ LỤC: TỪ ĐIỂN NHANH

| Việt | Khmer | Ghi chú |
|------|-------|---------|
| Học viện | ពុទ្ធិកវិទ្យាល័យ | Institute |
| Tăng sinh | សិស្សភិក្ខុ | Student monk |
| Khóa học | វគ្គសិក្សា | Course |
| Chương trình | កម្មវិធី | Program |
| Tốt nghiệp | បញ្ចប់ការសិក្សា | Graduate |
| Đăng ký | ចុះឈ្មោះ | Register |
| Tuyển sinh | ការទទួលសិស្ស | Admission |
| Học bổng | អាហារូបករណ៍ | Scholarship |
| Thư viện | បណ្ណាល័យ | Library |
| Ký túc xá | អគា Resid | Dormitory |
| Lễ hội | ពិធីបុណ្យ | Festival |

---

**Người soạn:** Development Team  
**Ngày cập nhật:** 15/01/2026  
**Liên hệ:** Nếu cần tư vấn dịch thuật, liên hệ Ban Giám hiệu hoặc các vị Sư thông thạo cả Việt-Khmer-Pali.
