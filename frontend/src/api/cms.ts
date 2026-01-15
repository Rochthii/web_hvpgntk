import axiosClient from './client';

export interface SiteSettings {
    site_name_vi: string;
    site_slogan_vi: string;
    site_name_km: string;
    site_slogan_km: string;
    logo_url: string;
    favicon_url: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    google_maps_embed: string;
    facebook_url: string;
    youtube_url: string;
    footer_text_vi: string;
    footer_text_km: string;
    student_count: string;
    course_count: string;
    founded_year: string;
    id: string;
    created_at: string;
    updated_at: string;
    hero_image?: string;
    hero_image_mobile?: string;
}

export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    image_url: string;
    image_url_mobile: string | null;
    link_url: string;
    display_order: number;
}

export interface NewsItem {
    id: string;
    title_vi: string;
    slug: string;
    excerpt_vi: string;
    content_vi: string;
    featured_image_url: string;
    category: string;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
    view_count: number;
    // aliases for compatibility
    thumbnail_url?: string;
    title?: string;
    excerpt?: string;
    content?: string;
}

export interface StaffMember {
    id: string;
    display_name_vi: string;
    position: string;
    photo_url: string;
    // Compatibility fields
    image_url?: string;
    display_order?: number;
    bio_vi?: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Page {
    id: string;
    title_vi: string;
    slug: string;
    content_vi: string;
    status: 'draft' | 'published';
    updated_at: string;
}

export const cmsApi = {
    // Dashboard
    getDashboardStats: () => axiosClient.get('/core/dashboard/stats/'),

    // Site Settings
    getSettings: () => axiosClient.get<SiteSettings>('/cms/settings/'),
    updateSettings: (data: Partial<SiteSettings>) => axiosClient.post('/cms/settings/update_settings/', data),
    getBanners: () => axiosClient.get<Banner[]>('/cms/banners/').then(res => ({ ...res, data: (res.data as any).results || res.data })),

    // News
    getNews: (params?: any) => axiosClient.get<PaginatedResponse<NewsItem>>('/cms/news/', { params }),
    getNewsDetail: (slug: string) => axiosClient.get<NewsItem>(`/cms/news/${slug}/`),
    createNews: (data: Partial<NewsItem>) => axiosClient.post('/cms/news/', data),
    updateNews: (id: string, data: Partial<NewsItem>) => axiosClient.patch(`/cms/news/${id}/`, data),
    deleteNews: (id: string) => axiosClient.delete(`/cms/news/${id}/`),

    // News Public/Filter
    getLatestNews: () => axiosClient.get<NewsItem[]>('/cms/news/latest/').then(res => ({ ...res, data: (res.data as any).results || res.data })),
    getFeaturedNews: () => axiosClient.get<NewsItem[]>('/cms/news/featured/').then(res => ({ ...res, data: (res.data as any).results || res.data })),
    getAnnouncements: () => axiosClient.get<NewsItem[]>('/cms/news/announcements/').then(res => ({ ...res, data: (res.data as any).results || res.data })),
    getNewsBySlug: (slug: string) => axiosClient.get<NewsItem>(`/cms/news/${slug}/`),

    // Pages
    getPages: () => axiosClient.get<Page[]>('/cms/pages/').then(res => ({ ...res, data: (res.data as any).results || res.data })),
    getPageDetail: (slug: string) => axiosClient.get<Page>(`/cms/pages/${slug}/`),
    createPage: (data: Partial<Page>) => axiosClient.post('/cms/pages/', data),
    updatePage: (id: string, data: Partial<Page>) => axiosClient.patch(`/cms/pages/${id}/`, data),
    deletePage: (id: string) => axiosClient.delete(`/cms/pages/${id}/`),

    // Staff
    getStaffList: () => axiosClient.get<StaffMember[]>('/cms/staff/').then(res => ({ ...res, data: (res.data as any).results || res.data })),
    getStaffDetail: (id: string) => axiosClient.get<StaffMember>(`/cms/staff/${id}/`),
    createStaff: (data: Partial<StaffMember>) => axiosClient.post('/cms/staff/', data),
    updateStaff: (id: string, data: Partial<StaffMember>) => axiosClient.patch(`/cms/staff/${id}/`, data),
    deleteStaff: (id: string) => axiosClient.delete(`/cms/staff/${id}/`),
    // History Milestones
    getHistoryMilestones: () => axiosClient.get<HistoryMilestone[]>('/cms/history-milestones/').then(res => ({ ...res, data: (res.data as any).results || res.data })),
};

export interface HistoryMilestone {
    id: string;
    year: string;
    title_vi: string;
    title_km?: string;
    description_vi: string;
    description_km?: string;
    // Localized fields returned by BilingualSerializerMixin
    title?: string;
    description?: string;
    image: string;
    display_order: number;
}
