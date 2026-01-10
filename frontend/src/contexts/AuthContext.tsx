import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginResponse } from '../types/auth';
import { authApi } from '../api/auth';
import { tokenManager } from '../lib/tokenManager';

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
            const token = tokenManager.getAccessToken();
            if (token) {
                try {
                    const response = await authApi.getMe();
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    // If verify fails, clear tokens
                    tokenManager.clearTokens();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (data: LoginResponse) => {
        tokenManager.setTokens(data.tokens.access, data.tokens.refresh);
        setUser(data.user);
    };

    const logout = () => {
        const refresh = tokenManager.getRefreshToken();
        if (refresh) {
            authApi.logout(refresh).catch(console.error); // Best effort logout
        }
        tokenManager.clearTokens();
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
