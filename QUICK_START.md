# 🚀 Quick Start Guide

## 📋 Prerequisites

- **Python** 3.12+
- **Node.js** 18+
- **PostgreSQL** (Supabase configured)

---

## 🏁 First Time Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd web_HVPGNTK
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Copy environment template
copy .env.example .env
# Edit .env with your Supabase credentials

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy environment template  
copy .env.example .env
# Usually no changes needed for local development
```

---

## 🎯 Daily Development

### Option 1: Auto Start (Recommended)
```powershell
.\start.ps1
```
This will:
- Stop any existing services
- Clean Vite cache
- Start Backend (port 8000)
- Start Frontend (port 3000)  
- Open browser automatically

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 Access Points

After starting services:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/v1
- **Admin Panel**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/api/docs

---

## 🛑 Stop Services

```powershell
.\stop.ps1
```

Or manually:
```powershell
taskkill /F /IM python.exe /T
taskkill /F /IM node.exe /T
```

---

## 🐛 Troubleshooting

### Port Already in Use?
```powershell
.\stop.ps1  # Kill all services
.\start.ps1 # Restart fresh
```

### Frontend Not Loading?
```bash
cd frontend
npm run dev:clean  # Clear cache and restart
```

### Backend Database Error?
```bash
cd backend
python manage.py migrate
```

### CORS Error?
Check `backend/.env` - ensure:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## 📁 Project Structure

```
web_HVPGNTK/
├── backend/          # Django + DRF API
│   ├── apps/         # Django apps (users, cms, etc)
│   ├── config/       # Settings
│   └── .env          # Environment variables
├── frontend/         # React + Vite
│   ├── src/          # Source code
│   └── .env          # Environment variables
├── start.ps1         # Unified startup script
├── stop.ps1          # Stop all services
└── README.md
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
DJANGO_SECRET_KEY=<secret-key>
DEBUG=True
DATABASE_URL=<supabase-url>
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_PORT=3000
```

---

## 📚 Additional Documentation

- [Database Schema](./DATABASE_SCHEMA.md)
- [Master Plan](./MASTER_PLAN_2026.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)

---

## 💡 Tips

1. **Always use port 3000 for frontend** - configured in vite.config.ts
2. **Always use port 8000 for backend** - Django default
3. **Use `.\start.ps1`** for consistent startup
4. **Check `.env.example`** files for required variables

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] No CORS errors in browser console
- [ ] Can see data from Supabase
- [ ] Admin panel accessible

---

**Need help? Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
