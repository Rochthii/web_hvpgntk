# HVPGNTK Backend

## Học viện Phật giáo Nam tông Khmer - Django Backend

### Setup

1. Tạo virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

2. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

3. Cấu hình database:
- Copy `.env.example` thành `.env`
- Cập nhật thông tin database trong `.env`

4. Tạo database (PostgreSQL):
```sql
CREATE DATABASE hvpgntk_db;
CREATE USER hvpgntk_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hvpgntk_db TO hvpgntk_user;
```

5. Chạy migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Tạo superuser:
```bash
python manage.py createsuperuser
```

7. Chạy server:
```bash
python manage.py runserver
```

### API Endpoints

- Admin: http://localhost:8000/admin/
- API Docs: http://localhost:8000/api/docs/
- Auth: http://localhost:8000/api/v1/auth/
- Users: http://localhost:8000/api/v1/users/

### Cấu trúc thư mục

```
backend/
├── config/              # Django settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── core/           # FileUpload, AuditLog, Notification
│   ├── users/          # User, MonkProfile, LaypersonProfile
│   ├── cms/            # Pages, News, Staff, etc.
│   ├── admissions/     # Tuyển sinh
│   ├── academic/       # Học vụ
│   ├── petitions/      # Đơn từ
│   └── calendar_app/   # Lịch Khmer
├── manage.py
└── requirements.txt
```
