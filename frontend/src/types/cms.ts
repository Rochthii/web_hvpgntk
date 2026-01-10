/**
 * CMS (Content Management System) Type Definitions
 * Types for settings, news, pages, and staff
 */
import { Timestamps, WithId } from './api';

/**
 * Site-wide settings and configuration
 */
export interface SiteSettings extends WithId, Timestamps {
    site_name_vi: string;
    site_name_km: string;
    site_slogan_vi: string;
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
    founded_year: string;
    student_count: string;
    course_count: string;
}

/**
 * News article/post
 */
export interface NewsItem extends WithId, Timestamps {
    slug: string;
    title_vi: string;
    title_km: string | null;
    excerpt_vi: string;
    excerpt_km: string | null;
    content_vi: string;
    content_km: string | null;
    featured_image_url: string | null;
    thumbnail_url: string | null;
    category: 'academy_news' | 'buddhist_news' | 'khmer_festival' | 'announcement' | 'event';
    tags: string[];
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    is_pinned: boolean;
    published_at: string;
    view_count: number;
    author_id: string;
}

/**
 * CMS Page (About, Education, etc.)
 */
export interface Page extends WithId, Timestamps {
    slug: string;
    page_type: string;
    title_vi: string;
    title_km: string | null;
    content_vi: string;
    content_km: string | null;
    excerpt_vi: string | null;
    excerpt_km: string | null;
    featured_image_url: string | null;
    meta_title: string | null;
    meta_description: string | null;
    template: string;
    status: 'draft' | 'published';
    published_at: string | null;
    view_count: number;
}

/**
 * Staff member (admin, monk, teacher)
 */
export interface StaffMember extends WithId {
    display_name_vi: string;
    position: string;
    image_url: string | null;
    staff_type: string;
    display_order?: number;
}
