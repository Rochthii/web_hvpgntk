import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role, PERMISSIONS, hasPermission } from '../lib/permissions';

type Resource = keyof typeof PERMISSIONS;
type Action = 'VIEW' | 'EDIT' | 'APPROVE';

export const usePermissions = () => {
    const { user } = useAuth();

    const can = useCallback((action: string, resource: string) => {
        if (!user) return false;

        // Convert string action/resource to uppercase keys
        const resKey = resource.toUpperCase() as Resource;
        const actKey = action.toUpperCase() as Action;

        if (!PERMISSIONS[resKey]) {
            console.warn(`Resource ${resource} not found in permissions`);
            return false;
        }

        // @ts-ignore
        const allowedRoles = PERMISSIONS[resKey][actKey];
        if (!allowedRoles) {
            console.warn(`Action ${action} not found for resource ${resource}`);
            return false;
        }

        return hasPermission(user, allowedRoles);
    }, [user]);

    // Role helpers
    const isAdmin = user?.role === Role.ADMIN;
    const isAbbot = user?.role === Role.ABBOT;
    const isTeacher = user?.role === Role.TEACHER;
    const isStudent = user?.role === Role.STUDENT;

    return {
        can,
        isAdmin,
        isAbbot,
        isTeacher,
        isStudent,
        user
    };
};
