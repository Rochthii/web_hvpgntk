/**
 * React Query hooks for News data
 */
import { useQuery } from '@tanstack/react-query';
import { cmsApi } from '../../../api/cms';

/**
 * Fetch all news articles
 */
export const useNews = () => {
    return useQuery({
        queryKey: ['news'],
        queryFn: () => cmsApi.getLatestNews().then(res => res.data),
    });
};

/**
 * Fetch single news article by slug
 */
export const useNewsDetail = (slug: string) => {
    return useQuery({
        queryKey: ['news', slug],
        queryFn: () => cmsApi.getNewsDetail(slug).then(res => res.data),
        enabled: !!slug, // Only fetch if slug exists
    });
};

/**
 * Fetch site settings
 */
export const useSiteSettings = () => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: () => cmsApi.getSettings().then(res => res.data),
        staleTime: 15 * 60 * 1000, // Settings rarely change - 15 minutes
    });
};
