import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../lib/permissions';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate('/login');
            } else if (allowedRoles && user && !allowedRoles.includes(user.role as Role)) {
                navigate(user.role === 'student' ? '/portal' : '/unauthorized');
            }
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, navigate]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải xác thực...</div>;
    }

    if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role as Role))) {
        return null;
    }

    return <>{children}</>;
};
