# 🔒 PROJECT STRUCTURE LOCK AUDIT

**Role**: Technical Lead  
**Date**: 2026-01-12  
**Objective**: Identify redundancies, naming issues, and architectural violations

---

## 📋 EXECUTIVE SUMMARY

| Category | Count | Action Required |
|----------|-------|----------------|
| Files to DELETE | 10 | Yes |
| Files to RENAME | 3 | Yes |
| Architectural violations | 2 | Yes (minor) |
| Total issues found | 15 | |

---

## 🗑️ 1. FILES TO DELETE

### Backend - Debug/Test Files (7 files)

| File | Reason | Impact |
|------|--------|--------|
| `backend/test_rate_limiting.py` | Test script, should be in tests/ or removed | None |
| `backend/test_rate_limiting.ps1` | Test script (PowerShell), should be in tests/ or removed | None |
| `backend/test_secret_key.py` | One-time test, not needed in production | None |
| `backend/scripts/debug/check_cms.py` | Debug script, 459 bytes | None |
| `backend/scripts/debug/check_content.py` | Debug script, 798 bytes | None |
| `backend/scripts/debug/check_login.py` | Debug script, 1426 bytes | None |
| `backend/scripts/debug/check_staff.py` | Debug script, 711 bytes | None |

**Total to delete**: ~5KB

**Recommendation**: 
- DELETE all debug scripts (already moved to `scripts/debug/`, can archive or remove)
- KEEP `seed_missing_pages.py` IF still needed for seeding
- KEEP `set_password.py` as utility

### Frontend - Orphaned API File (1 file)

| File | Reason | Impact |
|------|--------|--------|
| `frontend/src/api/approvals.ts` | References deleted approvals backend app | ⚠️ **BREAKING**: Used by 3 pages |

**References found in**:
1. `pages/student/CreateRequest.tsx`
2. `pages/student/MyRequests.tsx`  
3. `pages/admin/PetitionQueue.tsx`

**Action Required**: 
1. Create `frontend/src/api/petitions.ts` (NEW)
2. Update 3 pages to use petitions API
3. DELETE `api/approvals.ts`

### Documentation - Typo Directory (1 directory)

| Path | Reason | Impact |
|------|--------|--------|
| `frontend_m

ockups/` | Renamed from typo, but still confusing | None (already fixed) |

**Recommendation**: Consider renaming to `design_mockups/` for clarity

---

## 📝 2. FILES TO RENAME

### Backend - Misleading Names

| Current Name | Should Be | Reason |
|--------------|-----------|--------|
| `apps/calendar_app/` | `apps/calendar/` | Redundant `_app` suffix |
| `backend/scripts/debug/seed_missing_pages.py` | `backend/scripts/seed_missing_pages.py` | Not a debug script, is a utility |
| `backend/scripts/debug/set_password.py` | `backend/scripts/set_password.py` | Not a debug script, is a utility |

### Frontend - No issues found
All frontend files follow consistent naming conventions.

---

## 🏗️ 3. ARCHITECTURAL ANALYSIS

### ✅ Separation of Concerns - GOOD

**Backend Layering:**
```
config/           ✅ Configuration layer
apps/
  ├── core/       ✅ Cross-cutting (permissions, middleware)
  ├── users/      ✅ Domain: Authentication & User Management
  ├── cms/        ✅ Domain: Content Management
  ├── academic/   ✅ Domain: Courses, Grades, Enrollment
  ├── admissions/ ✅ Domain: Admission Applications
  ├── petitions/  ✅ Domain: Student Petitions (newly merged)
  └── calendar_app/ ✅ Domain: Calendar/Events
```

**Frontend Layering:**
```
api/           ✅ API client layer (axios)
components/    ✅ Presentational components
pages/         ✅ Page/route components
contexts/      ✅ State management
lib/           ✅ Utilities
types/         ✅ Type definitions
```

### ⚠️ Minor Issues Found

#### Issue 1: Direct API calls from components (ACCEPTABLE)

**Pattern observed:**
```typescript
// pages/News.tsx
import { newsApi } from '../api/cms';
// ... direct API call in component
```

**Analysis**: 
- ✅ Using centralized API module (`api/cms.ts`)
- ✅ Not duplicating fetch logic
- ✅ React Query handles caching
- ⚠️ Could use custom hooks for complex logic

**Verdict**: **ACCEPTABLE** - Pattern is clean for this project size

#### Issue 2: Business logic in UI components (MINOR)

**Example**: Some form validation logic in components

**Location**: `pages/Admissions.tsx`, `pages/Contact.tsx`

**Impact**: Low - validation is UI-specific

**Recommendation**: **ACCEPTABLE** - Move to custom hooks only if reused

---

## 📊 4. CORRECT DIRECTORY STRUCTURE (PROPOSED)

### Backend - Ideal Structure

```
backend/
├── config/                    # Django project config
├── apps/                      # Django apps (domain-driven)
│   ├── core/                  # Cross-cutting concerns
│   ├── users/                 # User & Auth domain
│   ├── cms/                   # Content Management domain
│   ├── academic/              # Academic domain
│   ├── admissions/            # Admissions domain
│   ├── petitions/             # Petitions domain
│   └── calendar/              # Calendar domain (RENAMED from calendar_app)
├── scripts/                   # Utility scripts (NOT debug)
│   ├── seed_missing_pages.py
│   ├── set_password.py
│   └── archived/              # Old debug scripts (optional)
├── tests/                     # Test suite (MISSING - should add)
│   ├── test_permissions.py
│   ├── test_api.py
│   └── ...
├── static/                    # Collected static files
├── media/                     # User uploads
├── logs/                      # Application logs
├── manage.py
├── requirements.txt
└── .env.example
```

### Frontend - Current is GOOD

```
frontend/src/
├── api/                      # API client modules ✅
├── components/               # Reusable components ✅
├── pages/                    # Route components ✅
├── contexts/                 # React contexts ✅
├─── hooks/                    # Custom hooks ✅
├── lib/                      # Utilities ✅
├── types/                    # TypeScript types ✅
├── layouts/                  # Layout components ✅
├── theme/                    # Theme/styling ✅
├── App.tsx
└── main.tsx
```

**Recommendation**: **NO CHANGES NEEDED** for frontend structure

---

## 🎯 5. PRIORITY ACTION ITEMS

### High Priority (Breaking Changes)

1. **Fix orphaned approvals API** (URGENT)
   - [ ] Create `frontend/src/api/petitions.ts`
   - [ ] Update `CreateRequest.tsx` to use petitions API
   - [ ] Update `MyRequests.tsx` to use petitions API
   - [ ] Update `PetitionQueue.tsx` to use petitions API
   - [ ] Delete `api/approvals.ts`

### Medium Priority (Cleanup)

2. **Remove test files from root**
   - [ ] Delete `backend/test_*.py` and `test_*.ps1` (3 files)
   - [ ] Move to `tests/` directory OR delete if unnecessary

3. **Reorganize scripts**
   - [ ] Move `seed_missing_pages.py` out of `debug/`
   - [ ] Move `set_password.py` out of `debug/`
   - [ ] Archive or delete actual debug scripts (check_*.py)

### Low Priority (Nice to Have)

4. **Rename for clarity**
   - [ ] Rename `apps/calendar_app/` → `apps/calendar/`
   - [ ] Rename `frontend_mockups/` → `design_mockups/`

---

## 🔍 6. ARCHITECTURAL VIOLATIONS - DETAILED

### NONE FOUND ✅

The project follows clean architecture:
- ✅ Backend uses Django apps for domain separation
- ✅ Frontend uses layered structure (api → components → pages)
- ✅ No business logic in UI components (except minor validation)
- ✅ API calls centralized in `api/` modules
- ✅ Permissions handled in backend, not frontend
- ✅ No direct database access from UI
- ✅ Clear separation between public/admin/student routes

---

## 📈 7. METRICS

### Code Organization Score: **8.5/10**

| Aspect | Score | Notes |
|--------|-------|-------|
| Layering | 9/10 | Clean separation of concerns |
| Naming | 8/10 | Minor issues (calendar_app) |
| File Structure | 9/10 | Well organized |
| No Duplication | 10/10 | Merged approvals successfully |
| Test Coverage | 0/10 | No tests directory |

**Overall**: Very good structure, minor cleanup needed

---

## ✅ 8. FINAL RECOMMENDATIONS

### MUST DO (Breaking)
1. ✅ Fix `api/approvals.ts` → Create petitions API and update 3 pages

### SHOULD DO (Cleanup)
2. ✅ Delete test files from backend root
3. ✅ Move utility scripts out of `debug/` folder
4. ✅ Delete old debug scripts (check_*.py)

### COULD DO (Polish)
5. 📝 Rename `calendar_app` → `calendar`
6. 📝 Create `tests/` directory structure
7. 📝 Rename `frontend_mockups` → `design_mockups`

---

## 🚀 EXECUTION PRIORITY

**Phase 1 (URGENT)**: Fix breaking changes
- Create petitions API
- Update 3 frontend pages
- Delete approvals.ts

**Phase 2 (CLEANUP)**: Remove clutter
- Delete test files from root
- Reorganize scripts folder

**Phase 3 (POLISH)**: Improve naming
- Rename calendar_app
- Rename mockups folder

---

**Status**: ✅ Structure is production-ready after Phase 1 fixes  
**Estimated effort**: ~30 minutes for Phase 1, ~15 minutes for Phase 2
