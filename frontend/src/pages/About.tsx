import React from 'react';
import { HistoryTimeline } from '../components/about/HistoryTimeline';
import { MissionVisionCards } from '../components/about/MissionVisionCards';
import { OrgChart } from '../components/about/OrgChart';
import { historyData, missionData } from '../data/AboutData';

const About: React.FC = () => {
  return (
    <div className="font-body">

      {/* Page Header & Mission - Merged for unification */}
      <div className="bg-[#2C1810] pt-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-ornate.svg')] opacity-5"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] font-heading mb-4 animate-fade-in-up">
            HỌC VIỆN PHẬT GIÁO NAM TÔNG KHMER
          </h1>
          <div className="w-24 h-1 bg-[#DAA520] mx-auto rounded-full mb-6"></div>
          <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed font-light italic">
            "Nơi ươm mầm trí tuệ, gìn giữ bản sắc, phụng sự nhân sinh."
          </p>
        </div>
      </div>

      {/* Floating Mission Cards */}
      <div className="relative z-20 -mt-24 container mx-auto px-6">
        <MissionVisionCards data={missionData} />
      </div>

      {/* History Timeline */}
      <section className="py-20 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary font-heading mb-4">LỊCH SỬ HÌNH THÀNH</h2>
          <p className="text-gray-600">
            Chặng đường 20 năm xây dựng và phát triển (2006 - 2026).
          </p>
        </div>
        <HistoryTimeline data={historyData} />
      </section>

      {/* Organizational Structure */}
      <section className="py-20 bg-[#FFF8E1]/50 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary font-heading mb-4">CƠ CẤU TỔ CHỨC</h2>
        </div>
        <OrgChart />
      </section>
    </div>
  );
};

export default About;