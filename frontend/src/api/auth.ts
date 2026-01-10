import client from './client';
import { LoginResponse, User } from '../types/auth';

export const authApi = {
    login: (credentials: { email?: string; phone?: string; password: string }) =>
        client.post<LoginResponse>('/auth/login/', credentials),

    logout: (refreshToken: string) =>
        client.post('/auth/logout/', { refresh: refreshToken }),

    getMe: () =>
        client.get<User>('/auth/me/'),

    refreshToken: (refresh: string) =>
        client.post<{ access: string }>('/auth/refresh/', { refresh }),
};
