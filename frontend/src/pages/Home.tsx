import React from 'react';
import { Link } from 'react-router-dom';
import { cmsApi, SiteSettings } from '../api/cms';
import { ROUTES } from '../router/routes';
import { HeroSection } from '../components/home/HeroSection';
import { StatsCards } from '../components/home/StatsCards';
import { NewsGrid } from '../components/home/NewsGrid';
import { useNews, useSiteSettings } from '../features/news/hooks/useNews';

/** NOTE: Header & Footer are kept inline for now - will extract later **/

const Home: React.FC = () => {
  // Use React Query hooks instead of useEffect
  const { data: settings } = useSiteSettings();
  const { data: news = [], isLoading: newsLoading } = useNews();

  // Fallback to defaults if settings not loaded yet
  const siteSettings = settings || {
    site_name_vi: 'Học viện Phật giáo Nam tông Khmer',
    site_slogan_vi: 'Đoàn kết - Hòa hợp - Trí tuệ - Phụng sự',
    contact_email: 'hvpgntk@edu.vn',
    contact_phone: '0292 738 925',
    contact_address: 'Cần Thơ',
    founded_year: '2006',
    student_count: '450+',
    course_count: '30+',
  } as SiteSettings;

  return (
    <div className="min-h-screen bg-cream">
      {/* HEADER - Inline styles kept for now */}
      <header className="sticky top-0 z-[1000] h-[72px] flex items-center justify-between px-10 shadow-lg backdrop-blur-md bg-gradient-to-r from-secondary via-[#3E2723] to-secondary">
        <div className="flex items-center gap-4">
          <Link to={ROUTES.HOME} className="w-[54px] h-[54px] rounded-full bg-white flex items-center justify-center shadow-gold-sm">
            <img src="/logo-hvpgntk.png" alt={siteSettings.site_name_vi} className="w-full h-full object-contain" />
          </Link>
        </div>

        <nav className="flex gap-1.5">
          {[
            { label: 'Trang chủ', path: ROUTES.HOME },
            { label: 'Giới thiệu', path: ROUTES.ABOUT },
            { label: 'Đào tạo', path: ROUTES.EDUCATION },
            { label: 'Tin tức', path: ROUTES.NEWS },
            { label: 'Tuyển sinh', path: ROUTES.ADMISSIONS },
            { label: 'Liên hệ', path: ROUTES.CONTACT }
          ].map((item, idx) => (
            <Link
              key={item.label}
              to={item.path}
              className="px-4 py-2 text-white no-underline rounded-md transition-all duration-250 font-medium text-[0.9375rem] hover:bg-white/10"
              style={{
                backgroundColor: idx === 0 ? '#FF9800' : 'transparent',
                fontWeight: idx === 0 ? 600 : 500,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-5 text-white/75 text-sm font-medium">
          <span className="cursor-pointer hover:text-white transition-colors">VI</span>
          <span className="cursor-pointer hover:text-white transition-colors">KH</span>
        </div>
      </header>

      {/* HERO SECTION */}
      <HeroSection siteName={settings.site_name_vi} siteSlogan={settings.site_slogan_vi} />

      {/* STATS CARDS */}
      <StatsCards
        foundedYear={settings.founded_year}
        studentCount={settings.student_count}
        courseCount={settings.course_count}
      />

      {/* NEWS GRID */}
      <NewsGrid news={news.slice(0, 3)} loading={newsLoading} />

      {/* FOOTER - Simplified */}
      <footer className="bg-secondary text-white/90 py-12 px-8 text-center">
        <div className="max-w-[1180px] mx-auto">
          <p className="text-sm mb-2">{settings.contact_address}</p>
          <p className="text-sm mb-2">Email: {settings.contact_email} | SĐT: {settings.contact_phone}</p>
          <p className="text-xs text-white/60 mt-4">© {new Date().getFullYear()} Học viện Phật giáo Nam tông Khmer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
