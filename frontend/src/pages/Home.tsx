import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SiteSettings } from '../api/cms';
import { ROUTES } from '../router/routes';
import { HeroSection } from '../components/home/HeroSection';
import Header from '../components/Header';
import { StatsCards } from '../components/home/StatsCards';
import { NewsGrid } from '../components/home/NewsGrid';
import { useNews, useSiteSettings } from '../features/news/hooks/useNews';

/** NOTE: Header & Footer are kept inline for now - will extract later **/

const Home: React.FC = () => {
  // Use React Query hooks
  const { data: settingsData, isLoading: settingsLoading } = useSiteSettings();
  const { data: news = [], isLoading: newsLoading } = useNews();

  // Memoized settings with guaranteed defaults
  const siteSettings = useMemo<SiteSettings>(() => {
    return settingsData || {
      site_name_vi: 'Học viện Phật giáo Nam tông Khmer',
      site_slogan_vi: 'Đoàn kết - Hòa hợp - Trí tuệ - Phụng sự',
      contact_email: 'hvpgntk@edu.vn',
      contact_phone: '0292 738 925',
      contact_address: 'Cần Thơ',
      founded_year: '2006',
      student_count: '450+',
      course_count: '30+',
      facebook_url: '',
      youtube_url: '',
      site_name_km: '',
      site_slogan_km: '',
      logo_url: '',
      favicon_url: '',
      google_maps_embed: '',
      footer_text_vi: '',
      footer_text_km: '',
      id: 'default',
      created_at: '',
      updated_at: '',
    } as SiteSettings;
  }, [settingsData]);

  return (
    <div className="min-h-screen bg-cream">
      {/* HEADER - Inline styles kept for now */}
      <Header />

      {/* HERO SECTION */}
      <HeroSection siteName={siteSettings.site_name_vi} siteSlogan={siteSettings.site_slogan_vi} />

      {/* STATS CARDS */}
      <StatsCards
        foundedYear={siteSettings.founded_year}
        studentCount={siteSettings.student_count}
        courseCount={siteSettings.course_count}
      />

      {/* NEWS GRID */}
      <NewsGrid news={news.slice(0, 3)} loading={newsLoading} />

      {/* FOOTER - Simplified */}
      <footer className="bg-secondary text-white/90 py-12 px-8 text-center">
        <div className="max-w-[1180px] mx-auto">
          <p className="text-sm mb-2">{siteSettings.contact_address}</p>
          <p className="text-sm mb-2">Email: {siteSettings.contact_email} | SĐT: {siteSettings.contact_phone}</p>
          <p className="text-xs text-white/60 mt-4">
            © {new Date().getFullYear()} Học viện Phật giáo Nam tông Khmer. All rights reserved. <br />
            <span className="text-white/40">System Status: Connected • Version 1.0.2</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
