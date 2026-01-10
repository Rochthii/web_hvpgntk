/**
 * CMS API Client
 * API methods for content management system data
 */
import client from './client';
import type { SiteSettings, NewsItem, Page, StaffMember } from '../types/cms';

export const cmsApi = {
    getSettings: () => client.get<SiteSettings>('/cms/settings/'),
    getNews: () => client.get<NewsItem[]>('/cms/news/'),
    getLatestNews: () => client.get<NewsItem[]>('/cms/news/latest/'),
    getNewsBySlug: (slug: string) => client.get<NewsItem>(`/cms/news/${slug}/`),
    getFeaturedNews: () => client.get<NewsItem[]>('/cms/news/featured/'),
    getStaff: () => client.get<StaffMember[]>('/cms/staff/'),
    getLeadership: () => client.get<StaffMember[]>('/cms/staff/leadership/'),
    getPages: () => client.get<Page[]>('/cms/pages/'),
    getPageBySlug: (slug: string) => client.get<Page>(`/cms/pages/${slug}/`),
};

// Re-export types for backward compatibility
export type { SiteSettings, NewsItem, Page, StaffMember };
