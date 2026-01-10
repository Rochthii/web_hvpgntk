
import React, { useCallback, useState } from 'react';
import { Book, Download, GraduationCap, Scroll, Star, Clock } from 'lucide-react';
import { academicApi } from '../api/academic';
import { Course } from '../types/academic';
import { useFetch } from '../hooks/useFetch';
import { CourseRowSkeleton } from '../components/Skeleton';

const Education: React.FC = () => {
  const fetchCourses = useCallback(() => academicApi.getCourses(), []);
  const { data: courses, loading, error } = useFetch<Course[]>(fetchCourses);
  const [activeTab, setActiveTab] = useState<number>(1);

  // Helper to filter courses by roughly mapping level/code to "Years" (Simulation for now)
  const getCoursesByYear = (year: number) => {
    if (!courses) return [];
    // This is a naive filter for demo purposes. In reality, a "Curriculum" endpoint would map this.
    // We'll distribute based on ID or Level to make it look populated.
    return courses.filter((_, index) => (index % 4) + 1 === year);
  };

  return (
    <div className="min-h-screen bg-[#FDF5E6] pb-20 font-sans">

      {/* DECORATIVE FRAME WRAPPER */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="relative bg-[#FFFAF0] rounded-3xl shadow-2xl border-[8px] border-double border-[#8B4513] overflow-hidden p-6 md:p-12">

          {/* Corner Ornaments */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-[12px] border-l-[12px] border-[#DAA520] rounded-tl-3xl opacity-80 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-[12px] border-r-[12px] border-[#DAA520] rounded-tr-3xl opacity-80 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[12px] border-l-[12px] border-[#DAA520] rounded-bl-3xl opacity-80 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[12px] border-r-[12px] border-[#DAA520] rounded-br-3xl opacity-80 pointer-events-none"></div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] pointer-events-none"></div>

          {/* HEADER */}
          <div className="text-center mb-12 relative z-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#6B2C2C] mb-2 drop-shadow-sm">
              Chương trình Đào tạo
            </h1>
            <p className="text-[#8B4513] font-serif text-xl italic mb-4">Cử nhân Phật học (4 năm)</p>
            <div className="w-64 h-1 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent mx-auto"></div>
          </div>

          {/* INTRO CARD */}
          <div className="relative z-10 bg-white p-8 rounded-xl shadow-gold-sm border border-gold/20 max-w-4xl mx-auto mb-16 text-center">
            <GraduationCap size={48} className="text-[#DAA520] mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold text-secondary mb-4">Mục tiêu đào tạo</h2>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Chương trình được thiết kế nhằm cung cấp kiến thức toàn diện về Phật giáo Nam Tông,
              thông thạo ngôn ngữ Pali, Khmer và hiểu sâu sắc lịch sử, triết học Phật giáo,
              đào tạo nên những Tăng tài có đạo hạnh và trí tuệ.
            </p>
          </div>

          {/* VISUAL YEAR TABS */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
            {[1, 2, 3, 4].map((year) => (
              <button
                key={year}
                onClick={() => setActiveTab(year)}
                className={`relative px-8 py-4 rounded-lg font-serif font-bold text-lg transition-all duration-300 border-2
                  ${activeTab === year
                    ? 'bg-[#6B2C2C] text-white border-[#6B2C2C] shadow-lg scale-105'
                    : 'bg-white text-[#8B4513] border-[#E5CFA0] hover:border-[#6B2C2C] hover:text-[#6B2C2C]'
                  }`}
              >
                Năm thứ {year}
                {activeTab === year && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-[#6B2C2C]">
                    ▼
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* CURRICULUM DISPLAY */}
          <div className="relative z-10 max-w-5xl mx-auto min-h-[400px]">
            {/* Decorative Top Line */}
            <div className="hidden md:block absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DAA520] to-transparent opacity-50"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white h-32 rounded-lg shadow-sm animate-pulse border border-gray-100"></div>
                ))
              ) : error ? (
                <div className="col-span-full text-center text-red-500 py-10">
                  Không thể tải dữ liệu: {error.message}
                </div>
              ) : courses && courses.length > 0 ? (
                // Allow showing ALL courses if filtering logic mimics empty, but here we use the helper
                (getCoursesByYear(activeTab).length > 0 ? getCoursesByYear(activeTab) : courses).map((course) => (
                  <div key={course.id} className="group bg-white p-6 rounded-xl shadow-sm border border-[#E5CFA0]/50 hover:border-[#DAA520] hover:shadow-gold-md transition-all duration-300 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FFF8E1] flex items-center justify-center flex-shrink-0 text-[#DAA520] group-hover:scale-110 transition-transform">
                      <Book size={24} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif font-bold text-lg text-[#6B2C2C] group-hover:text-[#8B4513] transition-colors">
                          {course.name_vi}
                        </h3>
                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {course.code}
                        </span>
                      </div>
                      {course.name_pali && (
                        <p className="text-sm text-[#DAA520] italic mb-2">{course.name_pali}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <Star size={14} />
                          <span>{course.credits} Tín chỉ</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{course.level === 'FOUNDATIONAL' ? 'Cơ bản' : 'Chuyên sâu'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500 italic">
                  Chưa có dữ liệu môn học cho năm này.
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 text-center relative z-10">
            <button className="group relative px-8 py-3 bg-[#6B2C2C] text-white font-bold rounded-full overflow-hidden shadow-lg hover:shadow-gold-lg transition-all">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Download size={20} />
                TẢI CHƯƠNG TRÌNH CHI TIẾT (PDF)
              </span>
              <div className="absolute inset-0 bg-[#8B4513] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Education;