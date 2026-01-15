import React from 'react';
import { Link } from 'react-router-dom';
import { SiteSettings } from '../api/cms';
import { ROUTES } from '../router/routes';
import { HeroSection } from '../components/home/HeroSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { StatsCards } from '../components/home/StatsCards';
import { NewsGrid } from '../components/home/NewsGrid';
import { useNews, useSiteSettings, useAnnouncements, useBanners } from '../features/news/hooks/useNews';
import { AnnouncementsSection } from '../components/home/AnnouncementsSection';

/** NOTE: Header & Footer are kept inline for now - will extract later **/

const Home: React.FC = () => {
  // Use React Query hooks
  const { data: siteSettings } = useSiteSettings();
  const { data: news = [], isLoading: newsLoading, isError: newsError } = useNews();
  const { data: announcements = [], isLoading: announcementsLoading } = useAnnouncements();
  const { data: banners = [] } = useBanners();

  const bannerImage = banners.length > 0 ? banners[0].image_url : undefined;

  return (
    <div className="min-h-screen bg-cream">
      {/* HEADER */}
      <Header />

      {/* HERO SECTION */}
      <HeroSection
        siteName={siteSettings?.site_name_vi || 'Học viện Phật giáo Nam tông Khmer'}
        siteSlogan={siteSettings?.site_slogan_vi || 'Đoàn kết - Hòa hợp - Trí tuệ - Phụng sự'}
        backgroundImage={bannerImage}
      />



      {/* STATS CARDS */}
      <StatsCards
        foundedYear={siteSettings?.founded_year || '2006'}
        studentCount={siteSettings?.student_count || '450+'}
        courseCount={siteSettings?.course_count || '30+'}
      />

      {/* NEWS GRID */}
      <NewsGrid news={news.slice(0, 3)} loading={newsLoading} error={newsError} />

      {/* FOOTER - Shared Component */}
      <Footer />
    </div>
  );
};

export default Home;
