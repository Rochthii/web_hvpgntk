import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HistoryTimeline } from '../components/about/HistoryTimeline';
import { MissionVisionCards } from '../components/about/MissionVisionCards';
import { OrgChart } from '../components/about/OrgChart';
import { cmsApi, HistoryMilestone } from '../api/cms';

interface PageContent {
  title: string;
  content: string;
  excerpt?: string;
}

const About: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [milestones, setMilestones] = useState<HistoryMilestone[]>([]);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch page content
        const pageRes = await cmsApi.getPages();
        const aboutPage = pageRes.data.find((p: any) => p.slug === 'gioi-thieu');
        if (aboutPage) {
          setPageContent({
            title: aboutPage.title || aboutPage.title_vi,
            content: aboutPage.content || aboutPage.content_vi,
            excerpt: aboutPage.excerpt || aboutPage.excerpt_vi
          });
        }

        // Fetch history milestones
        const historyRes = await cmsApi.getHistoryMilestones();
        if (historyRes.data && historyRes.data.length > 0) {
          setMilestones(historyRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch about page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading', 'Đang tải...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-body">

      {/* Page Header */}
      <div className="bg-[#2C1810] pt-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-ornate.svg')] opacity-5"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] font-heading mb-4 animate-fade-in-up">
            {pageContent?.title || 'HỌC VIỆN PHẬT GIÁO NAM TÔNG KHMER'}
          </h1>
          <div className="w-24 h-1 bg-[#DAA520] mx-auto rounded-full mb-6"></div>
          <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed font-light italic">
            {pageContent?.excerpt || t('about.quote', '"Nơi ươm mầm trí tuệ, gìn giữ bản sắc, phụng sự nhân sinh."')}
          </p>
        </div>
      </div>

      {/* Floating Mission Cards */}
      <div className="relative z-20 -mt-24 container mx-auto px-6">
        <MissionVisionCards />
      </div>

      {/* History Timeline */}
      <section className="py-20 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary font-heading mb-4">{t('about.history', 'LỊCH SỬ HÌNH THÀNH')}</h2>
          <p className="text-gray-600">
            {t('about.history_subtitle', 'Chặng đường 20 năm xây dựng và phát triển (2006 - 2026).')}
          </p>
        </div>

        {milestones.length > 0 && (
          <HistoryTimeline data={milestones} />
        )}
      </section>

      {/* Organization Chart */}
      <div className="pb-20">
        <OrgChart />
      </div>

    </div>
  );
};

export default About;