# Implementation Plan - Project Standardization v1

## Goal
To resolve the "core fragility" of the project by enforcing strict contracts between Frontend and Backend, creating a robust data seeding mechanism, and centralizing routing logic.

## User Review Required
> [!IMPORTANT]
> This plan modifies core API definition files. It is strictly additive/corrective, but ensuring all frontend components handle `null` values is critical.

## Proposed Changes

### Backend (Django)
#### [NEW] `apps/core/management/commands/seed_core_data.py`
- A management command to populate:
    - Default `SiteSettings`.
    - Basic `Pages` (About, History, Education).
    - Initial `AcademicYear`.
    - Sample `News` and `Courses` (if empty).
- **Benefit:** Prevents "White Screen" on fresh install.

### Frontend (React/TypeScript)
#### [MODIFY] `src/api/cms.ts` & `src/api/academic.ts`
- Update interfaces to reflect nullable fields (e.g., `thumbnail_url: string | null`).
- Add helper types for API Responses.

#### [NEW] `src/router/routes.ts`
- Define a single source of truth for URL paths:
    ```typescript
    export const ROUTES = {
        HOME: '/',
        ABOUT: '/about',
        EDUCATION: '/education',
        NEWS: '/news',
        ADMISSIONS: '/admissions',
        CONTACT: '/contact',
    }
    ```

#### [MODIFY] `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/App.tsx`
- Refactor to use `ROUTES` constants instead of hardcoded strings.

## Verification Plan

### Automated Verification
- **Build Test:** Run `npm run build` to ensure no type errors with new interfaces.
- **Seed Test:** Run `python manage.py seed_core_data` and verify no errors.

### Manual Verification
1.  **Fresh Start:**
    - Flush Database: `python manage.py flush`.
    - Run Seeder: `python manage.py seed_core_data`.
2.  **Frontend Check:**
    - Start App.
    - Verify Homepage loads (no "Loading..." stuck).
    - Verify "Giới thiệu" page has content (from seeder).
    - Verify "Đào tạo" page has content.
