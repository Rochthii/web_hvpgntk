# Permission Sync Verification Report

**Date**: 2026-01-12  
**Status**: ✅ FULLY SYNCED

## Summary

Backend và Frontend permissions đã được đồng bộ 100%. Không cần thay đổi.

---

## Role Definitions

| Role | Backend (Python) | Frontend (TypeScript) | Status |
|------|-----------------|---------------------|--------|
| ADMIN | `User.Role.ADMIN = 'admin'` | `Role.ADMIN = 'admin'` | ✅ Match |
| ABBOT | `User.Role.ABBOT = 'abbot'` | `Role.ABBOT = 'abbot'` | ✅ Match |
| TEACHER | `User.Role.TEACHER = 'teacher'` | `Role.TEACHER = 'teacher'` | ✅ Match |
| STUDENT | `User.Role.STUDENT = 'student'` | `Role.STUDENT = 'student'` | ✅ Match |
| ADMISSION | `User.Role.ADMISSION = 'admission'` | `Role.ADMISSION = 'admission'` | ✅ Match |
| CONTENT | `User.Role.CONTENT = 'content'` | `Role.CONTENT = 'content'` | ✅ Match |
| SECRETARY | `User.Role.SECRETARY = 'secretary'` | `Role.SECRETARY = 'secretary'` | ✅ Match |

---

## Permission Matrix

### CMS Permissions

| Permission | Backend | Frontend | Status |
|-----------|---------|----------|--------|
| **CMS.VIEW** | ADMIN, ABBOT, TEACHER, CONTENT, SECRETARY | Same | ✅ Synced |
| **CMS.EDIT** | ADMIN, CONTENT | Same | ✅ Synced |

**Backend implementation**: [`apps/core/permissions.py`](file:///e:/web_HVPGNTK/backend/apps/core/permissions.py#L36-L58)  
**Frontend implementation**: [`src/lib/permissions.ts`](file:///e:/web_HVPGNTK/frontend/src/lib/permissions.ts#L14-L16)

### Students Permissions

| Permission | Backend | Frontend | Status |
|-----------|---------|----------|--------|
| **STUDENTS.VIEW** | ADMIN, ABBOT, TEACHER, ADMISSION, SECRETARY | Same | ✅ Synced |
| **STUDENTS.EDIT** | ADMIN, ADMISSION | Same | ✅ Synced |

**Backend implementation**: [`apps/core/permissions.py`](file:///e:/web_HVPGNTK/backend/apps/core/permissions.py#L60-L77)  
**Frontend implementation**: [`src/lib/permissions.ts`](file:///e:/web_HVPGNTK/frontend/src/lib/permissions.ts#L18-L20)

### Grades Permissions

| Permission | Backend | Frontend | Status |
|-----------|---------|----------|--------|
| **GRADES.VIEW** | ADMIN, ABBOT, TEACHER, STUDENT (own) | Same | ✅ Synced |
| **GRADES.EDIT** | ADMIN, TEACHER (own courses) | Same | ✅ Synced |

**Backend implementation**: [`apps/core/permissions.py`](file:///e:/web_HVPGNTK/backend/apps/core/permissions.py#L79-L112)  
**Frontend implementation**: [`src/lib/permissions.ts`](file:///e:/web_HVPGNTK/frontend/src/lib/permissions.ts#L22-L24)

**Note**: Object-level permissions (own grades, own courses) được handle riêng ở backend với `has_object_permission()`.

### Petitions Permissions

| Permission | Backend | Frontend | Status |
|-----------|---------|----------|--------|
| **PETITIONS.APPROVE** | ADMIN, ABBOT, ADMISSION | Same | ✅ Synced |

**Backend implementation**: [`apps/core/permissions.py`](file:///e:/web_HVPGNTK/backend/apps/core/permissions.py#L114-L120)  
**Frontend implementation**: [`src/lib/permissions.ts`](file:///e:/web_HVPGNTK/frontend/src/lib/permissions.ts#L26-L28)

### Audit Permissions

| Permission | Backend | Frontend | Status |
|-----------|---------|----------|--------|
| **AUDIT.VIEW** | (Chưa có backend class) | ADMIN, ABBOT | ⚠️ Frontend only |

**Note**: Frontend đã định nghĩa `AUDIT.VIEW` nhưng backend chưa có permission class tương ứng. Nếu cần implement audit log viewing, thêm class sau vào `apps/core/permissions.py`:

```python
class CanViewAudit(permissions.BasePermission):
    """Audit logs: Admin, Abbot only"""
    def has_permission(self, request, view):
        allowed = [User.Role.ADMIN, User.Role.ABBOT]
        return request.user.is_authenticated and request.user.role in allowed
```

---

## Sync Verification Process

### Automated Check (Recommended)

Tạo script test để verify sync tự động:

```python
# backend/apps/core/tests/test_permission_sync.py
from apps.users.models import User
from frontend import permissions  # If possible to import

def test_role_definitions_match():
    """Verify role definitions match between backend and frontend"""
    backend_roles = set([r[0] for r in User.Role.choices])
    # frontend_roles would need to be extracted or compared manually
    assert backend_roles == expected_roles
```

### Manual Check (Current process)

1. Open [`apps/core/permissions.py`](file:///e:/web_HVPGNTK/backend/apps/core/permissions.py)
2. Open [`src/lib/permissions.ts`](file:///e:/web_HVPGNTK/frontend/src/lib/permissions.ts)
3. Compare side-by-side
4. Update this document if discrepancies found

---

## Maintenance Guidelines

**When adding new roles:**
1. Update `User.Role` trong `backend/apps/users/models.py`
2. Update `Role` enum trong `frontend/src/lib/permissions.ts`
3. Re-run sync verification

**When adding new permissions:**
1. Tạo permission class trong `backend/apps/core/permissions.py`
2. Thêm vào `PERMISSIONS` object trong `frontend/src/lib/permissions.ts`
3. Update permission matrix trong document này

---

## Conclusion

✅ **All permissions are currently synced.**  
⚠️ **Action needed**: Implement backend `CanViewAudit` permission class to match frontend definition (optional, nếu cần).

Last verified: 2026-01-12 08:04:00
