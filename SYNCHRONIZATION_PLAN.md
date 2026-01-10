# Project Standardization & Core Synchronization Plan

## 1. Current Core Issues Analysis
The project currently suffers from "Fragile Integration":
- **Routing Mismatch:** Frontend UI uses Vietnamese paths while Router/Backend uses English or erratic naming, causing 404s/Blank Screens.
- **Unsafe Data Contracts:** Frontend crashes when Backend returns empty/null data (e.g., `SiteSettings` 500 error on fresh DB).
- **Loose Type Safety:** TypeScript interfaces in `frontend/src/api` do not strictly match Django `serializers.py` outputs.
- **Fragile Bootstrap:** The system requires manual data entry to work; without it, it breaks.

## 2. Standardization Goals

### Phase 1: The "Golden Contract" (API & Types)
- **Goal:** Strict alignment between Backend Serializers and Frontend Interfaces.
- **Action:**
    - Audit `apps.cms.serializers` vs `src/api/cms.ts`.
    - Audit `apps.academic.serializers` vs `src/api/academic.ts`.
    - Enforce "Nullable" handling on Frontend for all non-guaranteed fields.

### Phase 2: Routing Hygiene
- **Goal:** One truth for URL paths.
- **Action:**
    - Define `ROUTES` constant in Frontend.
    - Update `Header`, `Footer`, and `App.tsx` to use this constant.
    - Ensure Backend URLs (`urls.py`) follow RESTful standards `/api/v1/<resource>/`.

### Phase 3: Robust Bootstrapping (The "Works Out of the Box" Rule)
- **Goal:** `npm run dev` + `python manage.py runserver` should result in a fully viewable site, even with empty user data.
- **Action:**
    - Implement `safe_get` patterns in Backend (demonstrated in `get_settings` fix).
    - Create a `management command` to seed essential data (Menu structure, Basic Settings, Initial Pages).

### Phase 4: Global Error Handling & UX
- **Goal:** No more "White Screen of Death".
- **Action:**
    - Improve `useFetch` hook to handle 500/404 explicitly.
    - Create "Empty State" components for lists (Courses, News) when data is missing.

## 3. Executive Checklist

- [ ] **Audit:** Compare all Frontend Interfaces vs Backend Serializers.
- [ ] **Backend:** Create `apps/core/management/commands/seed_core_data.py`.
- [ ] **Frontend:** Refactor `src/router/routes.ts` central config.
- [ ] **Frontend:** Update `useFetch` and API clients to be robust against nulls.
- [ ] **Verification:** Clean install test (Nuke DB -> Migrate -> Seed -> Run -> Verify).
