import { User } from '../types/auth';

export enum Role {
    ADMIN = 'admin',
    ABBOT = 'abbot',
    TEACHER = 'teacher',
    STUDENT = 'student',
    ADMISSION = 'admission',
    CONTENT = 'content',
    SECRETARY = 'secretary'
}

export const PERMISSIONS = {
    CMS: {
        VIEW: [Role.ADMIN, Role.ABBOT, Role.TEACHER, Role.CONTENT, Role.SECRETARY],
        EDIT: [Role.ADMIN, Role.CONTENT]
    },
    STUDENTS: {
        VIEW: [Role.ADMIN, Role.ABBOT, Role.TEACHER, Role.ADMISSION, Role.SECRETARY],
        EDIT: [Role.ADMIN, Role.ADMISSION]
    },
    GRADES: {
        VIEW: [Role.ADMIN, Role.ABBOT, Role.TEACHER, Role.STUDENT], // Student own check separate
        EDIT: [Role.ADMIN, Role.TEACHER] // Teacher own check separate
    },
    PETITIONS: {
        APPROVE: [Role.ADMIN, Role.ABBOT, Role.ADMISSION]
    },
    AUDIT: {
        VIEW: [Role.ADMIN, Role.ABBOT]
    }
};

export const hasPermission = (user: User | null, allowedRoles: Role[]) => {
    if (!user) return false;
    // Check if user has one of the allowed roles
    // Map string role from backend to enum if needed (assuming backend role matches string values)
    return allowedRoles.includes(user.role as Role);
};

export const canViewCMS = (user: User | null) => hasPermission(user, PERMISSIONS.CMS.VIEW);
export const canEditCMS = (user: User | null) => hasPermission(user, PERMISSIONS.CMS.EDIT);
export const canViewStudents = (user: User | null) => hasPermission(user, PERMISSIONS.STUDENTS.VIEW);
export const canEditStudents = (user: User | null) => hasPermission(user, PERMISSIONS.STUDENTS.EDIT);
export const canApprovePetitions = (user: User | null) => hasPermission(user, PERMISSIONS.PETITIONS.APPROVE);
export const canViewAudit = (user: User | null) => hasPermission(user, PERMISSIONS.AUDIT.VIEW);
