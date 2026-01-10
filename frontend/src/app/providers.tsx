/**
 * Application Providers
 * Wraps the app with React Query, Auth context, ErrorBoundary, and Toast notifications
 */
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '../lib/queryClient';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

interface AppProvidersProps {
    children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {children}
                </AuthProvider>
                {/* DevTools only in development */}
                {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
                {/* Toast notifications */}
                <Toaster />
            </QueryClientProvider>
        </ErrorBoundary>
    );
};
