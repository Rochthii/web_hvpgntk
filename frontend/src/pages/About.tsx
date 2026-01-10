import React, { useState, useCallback } from 'react';
import { cmsApi, Page, StaffMember } from '../api/cms';
import { useFetch } from '../hooks/useFetch';
import { ChevronRight, Award, Scroll, Users, Clock } from 'lucide-react';

// --- Components ---

// --- New Components for "Golden Frame" Design ---

const HorizontalTimeline: React.FC = () => (
  <div className="relative py-16 px-4 overflow-x-auto">
    {/* Central Line */}
    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent transform -translate-y-1/2 hidden md:block"></div>

    <div className="flex flex-col md:flex-row justify-between relative min-w-[800px] md:min-w-0">
      {/* 1993 */}
      <div className="relative flex flex-col items-center group w-1/4">
        <div className="order-1 md:order-1 mb-8 md:mb-16 p-4 bg-cream-light rounded-lg border border-gold/30 shadow-sm text-center w-48 relative transform transition hover:-translate-y-2 hover:shadow-gold-md">
          <div className="text-2xl font-bold text-primary font-serif">1993</div>
          <div className="text-sm font-medium text-secondary">Khởi đầu</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 text-gold text-2xl hidden md:block">▼</div>
        </div>
        <div className="order-2 md:order-2 z-10 w-8 h-8 rounded-full bg-secondary border-4 border-gold shadow-lg group-hover:scale-125 transition-transform"></div>
        <div className="order-3 md:order-3 mt-4 text-sm text-gray-500 text-center px-4">
          Các lớp học sơ khai tại Chùa Pothisomron
        </div>
      </div>

      {/* 2006 */}
      <div className="relative flex flex-col items-center group w-1/4">
        <div className="order-3 md:order-1 mt-4 md:mt-0 text-sm text-gray-500 text-center px-4 md:mb-16">
          Quyết định thành lập của Thủ tướng Chính phủ
        </div>
        <div className="order-2 md:order-2 z-10 w-8 h-8 rounded-full bg-secondary border-4 border-gold shadow-lg group-hover:scale-125 transition-transform"></div>
        <div className="order-1 md:order-3 mb-8 md:mb-0 md:mt-16 p-4 bg-cream-light rounded-lg border border-gold/30 shadow-sm text-center w-48 relative transform transition hover:translate-y-2 hover:shadow-gold-md">
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-gold text-2xl hidden md:block">▲</div>
          <div className="text-2xl font-bold text-primary font-serif">2006</div>
          <div className="text-sm font-medium text-secondary">Thành lập</div>
        </div>
      </div>

      {/* 2017 */}
      <div className="relative flex flex-col items-center group w-1/4">
        <div className="order-1 md:order-1 mb-8 md:mb-16 p-4 bg-cream-light rounded-lg border border-gold/30 shadow-sm text-center w-48 relative transform transition hover:-translate-y-2 hover:shadow-gold-md">
          <div className="text-2xl font-bold text-primary font-serif">2017</div>
          <div className="text-sm font-medium text-secondary">Xây dựng</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 text-gold text-2xl hidden md:block">▼</div>
        </div>
        <div className="order-2 md:order-2 z-10 w-8 h-8 rounded-full bg-secondary border-4 border-gold shadow-lg group-hover:scale-125 transition-transform"></div>
        <div className="order-3 md:order-3 mt-4 text-sm text-gray-500 text-center px-4">
          Lễ đặt đá khởi công cơ sở mới tại Ô Môn
        </div>
      </div>

      {/* 2025 */}
      <div className="relative flex flex-col items-center group w-1/4">
        <div className="order-3 md:order-1 mt-4 md:mt-0 text-sm text-gray-500 text-center px-4 md:mb-16">
          Hoàn thiện Chánh điện & Kiết giới Sima
        </div>
        <div className="order-2 md:order-2 z-10 w-8 h-8 rounded-full bg-primary border-4 border-gold-light shadow-lg group-hover:scale-125 transition-transform animate-pulse"></div>
        <div className="order-1 md:order-3 mb-8 md:mb-0 md:mt-16 p-4 bg-white rounded-lg border-2 border-primary shadow-gold-md text-center w-48 relative transform transition hover:translate-y-2">
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-primary text-2xl hidden md:block">▲</div>
          <div className="text-2xl font-bold text-primary font-serif">2025</div>
          <div className="text-sm font-medium text-secondary">Phát triển</div>
        </div>
      </div>
    </div>
  </div>
);

const OrnateLeadershipCard: React.FC<{ staff: StaffMember }> = ({ staff }) => (
  <div className="relative bg-[#FDFBF7] p-4 rounded-xl shadow-md border border-[#E5CFA0] flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-gold-md group">
    {/* Decorative corners */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold rounded-tl-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold rounded-br-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>

    <div className="flex-shrink-0 relative">
      <div className="w-20 h-20 rounded-full border-2 border-gold p-0.5">
        <img
          src={staff.image_url || "https://ui-avatars.com/api/?name=" + staff.display_name_vi + "&background=F59E0B&color=fff"}
          alt={staff.display_name_vi}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
    </div>

    <div className="flex-grow">
      <h3 className="text-lg font-serif font-bold text-secondary">{staff.display_name_vi}</h3>
      <p className="text-sm font-medium text-primary uppercase">{staff.position}</p>
      <div className="h-0.5 w-12 bg-gold/50 my-1"></div>
    </div>
  </div>
);

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tongquan' | 'lichsu' | 'sumenh' | 'tochuc'>('lichsu'); // Default to History as per request vibe

  // Data Fetching
  const fetchPages = useCallback(() => cmsApi.getPages(), []);
  const { data: pages, loading: pagesLoading, error: pagesError } = useFetch<Page[]>(fetchPages);

  const fetchLeadership = useCallback(async () => {
    const res = await cmsApi.getLeadership();
    // Sort client-side to be safe
    const sortedData = res.data.sort((a, b) => (a.display_order || 99) - (b.display_order || 99));
    return { data: sortedData };
  }, []);
  const { data: leadership, loading: staffLoading } = useFetch<StaffMember[]>(fetchLeadership);

  // Debugging
  React.useEffect(() => {
    if (pagesError) console.error("Pages fetch error:", pagesError);
    if (pages) console.log("Fetched pages:", pages);
  }, [pages, pagesError]);

  const getPageContent = (slugPart: string) => {
    if (pagesLoading) return "Đang tải dữ liệu...";
    if (pagesError) return "Không thể tải dữ liệu. Vui lòng thử lại.";
    const page = pages?.find(p => p.slug.includes(slugPart));
    return page?.content_vi || "Nội dung đang được cập nhật...";
  };

  return (
    <div className="min-h-screen bg-[#FDF5E6] pb-20 font-sans">

      {/* DECORATIVE FRAME WRAPPER */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="relative bg-[#FFFAF0] rounded-3xl shadow-2xl border-[8px] border-double border-[#8B4513] overflow-hidden p-8 md:p-12">

          {/* Corner Ornaments (CSS Simulation) */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-[12px] border-l-[12px] border-[#DAA520] rounded-tl-3xl opacity-80 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-[12px] border-r-[12px] border-[#DAA520] rounded-tr-3xl opacity-80 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[12px] border-l-[12px] border-[#DAA520] rounded-bl-3xl opacity-80 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[12px] border-r-[12px] border-[#DAA520] rounded-br-3xl opacity-80 pointer-events-none"></div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] pointer-events-none"></div>

          {/* HEADER FOR THIS SECTION */}
          <div className="text-center mb-12 relative z-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#6B2C2C] mb-2 drop-shadow-sm">
              Về Học Viện
            </h1>
            <div className="w-64 h-1 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent mx-auto"></div>
          </div>

          {/* TABS (Re-styled to match image) */}
          <div className="flex justify-center mb-16 relative z-10">
            <div className="inline-flex border-b-2 border-[#E5CFA0]">
              {[
                { id: 'tongquan', label: 'Tổng quan' },
                { id: 'lichsu', label: 'Lịch sử' },
                { id: 'sumenh', label: 'Sứ mệnh' },
                { id: 'tochuc', label: 'Tổ chức' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-3 font-serif font-bold text-lg transition-all border-b-4 
                                ${activeTab === tab.id
                      ? 'border-[#6B2C2C] text-[#6B2C2C] bg-[#FFF3E0]'
                      : 'border-transparent text-gray-500 hover:text-[#6B2C2C] hover:bg-gray-50'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="relative z-10 min-h-[500px]">

            {activeTab === 'tongquan' && (
              <div className="animate-fade-in-up px-4">
                <div className="max-w-4xl mx-auto relative">
                  {/* Decorative Top Ornament */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-gold opacity-80">
                    <svg width="100" height="40" viewBox="0 0 100 40" fill="currentColor">
                      <path d="M50 0 C30 15 10 10 0 10 L0 15 C20 15 40 20 50 35 C60 20 80 15 100 15 L100 10 C90 10 70 15 50 0 Z" />
                    </svg>
                  </div>

                  <div className="bg-[#FFFFFE] p-10 md:p-14 rounded-xl shadow-gold-sm border-2 border-double border-[#E5CFA0] relative overflow-hidden">
                    {/* Inner Corner Accents */}
                    <div className="absolute top-2 left-2 w-16 h-16 border-t font-serif text-6xl text-gold/20 leading-none">“</div>
                    <div className="absolute bottom-2 right-2 w-16 h-16 text-right font-serif text-6xl text-gold/20 leading-none">”</div>

                    <div className="relative z-10 text-center">
                      <h2 className="text-3xl font-serif font-bold text-[#6B2C2C] mb-8 relative inline-block">
                        Giới thiệu chung
                        <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent"></div>
                      </h2>

                      <div className="prose prose-lg text-gray-700 max-w-none text-justify leading-relaxed font-light"
                        dangerouslySetInnerHTML={{ __html: getPageContent('gioi-thieu') }} />
                    </div>
                  </div>

                  {/* Decorative Bottom Ornament */}
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 rotate-180 text-gold opacity-80">
                    <svg width="100" height="40" viewBox="0 0 100 40" fill="currentColor">
                      <path d="M50 0 C30 15 10 10 0 10 L0 15 C20 15 40 20 50 35 C60 20 80 15 100 15 L100 10 C90 10 70 15 50 0 Z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lichsu' && (
              <div className="animate-fade-in-up">
                <HorizontalTimeline />
                <div className="mt-16 text-center max-w-3xl mx-auto bg-white/50 p-6 rounded-xl border border-gold/20">
                  <h3 className="text-xl font-serif font-bold text-secondary mb-4">Chặng đường phát triển</h3>
                </div>
              </div>
            )}

            {activeTab === 'tochuc' && (
              <div className="animate-fade-in-up">
                {staffLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-64"></div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-12">
                    {/* LEVEL 1: TIÊU ĐỀ - VIỆN TRƯỞNG */}
                    {leadership?.filter(s => s.display_order === 1).map(staff => (
                      <div key={staff.id} className="relative z-10 scale-110 transform transition hover:scale-115 duration-300">
                        <OrnateLeadershipCard staff={staff} />
                        {/* Connector line down */}
                        <div className="absolute top-full left-1/2 w-0.5 h-12 bg-gold/50 -translate-x-1/2"></div>
                      </div>
                    ))}

                    {/* LEVEL 2: PHÓ VIỆN TRƯỞNG (Grid 3 cột) */}
                    <div className="relative w-full max-w-6xl">
                      {/* Horizontal connector line */}
                      <div className="absolute -top-12 left-[10%] right-[10%] h-12 border-t-2 border-l-2 border-r-2 border-gold/30 rounded-t-3xl pointer-events-none"></div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center pt-8">
                        {leadership?.filter(s => s.display_order && s.display_order >= 2 && s.display_order <= 7).map(staff => (
                          <OrnateLeadershipCard key={staff.id} staff={staff} />
                        ))}
                      </div>
                    </div>

                    {/* LEVEL 3: CÁC TRƯỞNG PHÒNG/BAN (Grid 4 cột) */}
                    <div className="relative w-full max-w-7xl pt-8">
                      {/* Connector from Level 2 center */}
                      <div className="absolute -top-8 left-1/2 w-0.5 h-16 bg-gold/30 -translate-x-1/2"></div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                        {leadership?.filter(s => s.display_order && s.display_order > 7).map(staff => (
                          <OrnateLeadershipCard key={staff.id} staff={staff} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sumenh' && (
              <div className="animate-fade-in-up max-w-4xl mx-auto text-center">
                <div className="bg-white p-12 rounded-full shadow-gold-lg border-4 border-double border-gold aspect-square flex flex-col items-center justify-center max-w-[600px] mx-auto">
                  <Award size={64} className="text-primary mb-6" />
                  <div className="prose prose-lg text-gray-700"
                    dangerouslySetInnerHTML={{ __html: getPageContent('su-menh') }}
                  />
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default About;