/**
 * Token Manager
 * Handles JWT token storage and expiry checking.
 */

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const tokenManager = {
    /**
     * Get access token from localStorage
     */
    getAccessToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Get refresh token from localStorage
     */
    getRefreshToken: (): string | null => {
        return localStorage.getItem(REFRESH_KEY);
    },

    /**
     * Store both access and refresh tokens
     */
    setTokens: (access: string, refresh: string): void => {
        localStorage.setItem(TOKEN_KEY, access);
        localStorage.setItem(REFRESH_KEY, refresh);
    },

    /**
     * Clear all tokens (logout)
     */
    clearTokens: (): void => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
    },

    /**
     * Check if a JWT token is expired
     * @param token - JWT token string
     * @returns true if token is expired or invalid
     */
    isTokenExpired: (token: string): boolean => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    },

    /**
     * Get token expiry time in seconds
     * @param token - JWT token string
     * @returns Expiry timestamp or null if invalid
     */
    getTokenExpiry: (token: string): number | null => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp;
        } catch {
            return null;
        }
    },
};
