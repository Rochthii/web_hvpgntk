import client from './client';

export interface SiteSettings {
    site_name_vi: string;
    site_name_km: string;
    site_slogan_vi: string;
    site_slogan_km: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    logo_url: string;
    favicon_url: string;
    google_maps_embed: string;
    footer_text_vi: string;
    footer_text_km: string;
    facebook_url: string | null;
    youtube_url: string | null;
    founded_year: string;
    student_count: string;
    course_count: string;
}

export interface NewsItem {
    id: string;
    title_vi: string;
    slug: string;
    excerpt_vi: string;
    content_vi: string;
    thumbnail_url: string | null;
    category: string;
    published_at: string;
}

export interface StaffMember {
    id: string;
    display_name_vi: string;
    position: string;
    image_url: string | null;
    staff_type: string;
    display_order?: number;
}

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

export interface Page {
    id: string;
    title_vi: string;
    slug: string;
    content_vi: string;
    page_type: string;
}
