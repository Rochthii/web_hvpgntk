/**
 * React Query Client Configuration
 * Provides optimized defaults for data fetching and caching
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,      // Data fresh for 5 minutes
            gcTime: 10 * 60 * 1000,        // Cache for 10 minutes (was cacheTime)
            retry: 1,                       // Retry failed requests once
            refetchOnWindowFocus: false,    // Don't refetch on window focus
            refetchOnReconnect: true,       // Refetch on network reconnect
        },
        mutations: {
            retry: 0,                       // Don't retry mutations
        },
    },
});
