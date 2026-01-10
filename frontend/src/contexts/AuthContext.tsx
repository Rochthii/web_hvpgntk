import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginResponse } from '../types/auth';
import { authApi } from '../api/auth';
import client from '../api/client';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                // Set header immediately for the request
                client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const response = await authApi.getMe();
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    // If verify fails, clear local storage
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    delete client.defaults.headers.common['Authorization'];
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (data: LoginResponse) => {
        localStorage.setItem('accessToken', data.tokens.access);
        localStorage.setItem('refreshToken', data.tokens.refresh);
        client.defaults.headers.common['Authorization'] = `Bearer ${data.tokens.access}`;
        setUser(data.user);
    };

    const logout = () => {
        const refresh = localStorage.getItem('refreshToken');
        if (refresh) {
            authApi.logout(refresh).catch(console.error); // Best effort logout
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete client.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
