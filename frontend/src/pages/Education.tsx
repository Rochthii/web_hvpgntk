import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Download } from 'lucide-react';
import { generateCurriculumPDF } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';
import { CurriculumTable } from '../components/education/CurriculumTable';
import { academicApi } from '../api/academic';
import { Course } from '../types/academic';

interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
}

interface YearCurriculum {
  year: number;
  subjects: Subject[];
}

const Education: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeYear, setActiveYear] = useState<number>(1);
  const [educationData, setEducationData] = useState<YearCurriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await academicApi.getCourses();
        const courses: Course[] = response.data;

        // Group courses by name pattern to determine year
        // Year 1: ends with "– I" or "– ១"
        // Year 2: ends with "– II" or "– ២"
        // Year 3: ends with "– III" or "– ៣"
        // Year 4: ends with "– IV" or "– ៤"
        const grouped: YearCurriculum[] = [
          { year: 1, subjects: [] },
          { year: 2, subjects: [] },
          { year: 3, subjects: [] },
          { year: 4, subjects: [] }
        ];

        courses.forEach((course) => {
          const name = i18n.language === 'km' && course.name_km ? course.name_km : course.name_vi;
          let year = 1; // default

          // Detect year from name pattern
          if (name.includes(' I') || name.includes(' ១')) {
            year = 1;
          } else if (name.includes(' II') || name.includes(' ២')) {
            year = 2;
          } else if (name.includes(' III') || name.includes(' ៣')) {
            year = 3;
          } else if (name.includes(' IV') || name.includes(' ៤')) {
            year = 4;
          }

          grouped[year - 1].subjects.push({
            id: course.id,
            code: course.code,
            name: name,
            credits: course.credits
          });
        });

        setEducationData(grouped);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error(t('common.error', 'Có lỗi xảy ra'));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [i18n.language, t]);

  const currentCurriculum = educationData.find(d => d.year === activeYear);

  const handleDownload = async () => {
    setIsGenerating(true);
    const toastId = toast.loading(t('common.generating', 'Đang tạo file PDF...'));
    try {
      await generateCurriculumPDF(educationData);
      toast.success(t('common.success', 'Tải xuống thành công!'), { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(t('common.error', 'Có lỗi khi tạo PDF.'), { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

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
    <div className="min-h-screen bg-cream font-body">

      {/* Page Header */}
      <div className="bg-[#2C1810] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-ornate.svg')] opacity-5"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] font-heading mb-4 animate-fade-in-up">
            {t('education.title', 'CHƯƠNG TRÌNH ĐÀO TẠO')}
          </h1>
          <div className="w-24 h-1 bg-[#DAA520] mx-auto rounded-full"></div>
          <p className="text-white/80 mt-6 max-w-2xl mx-auto leading-relaxed text-lg">
            {t('education.subtitle', 'Cử nhân Phật học (04 năm) - Hệ Chính quy')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">

        {/* Intro Card */}
        <div className="bg-white p-8 rounded-2xl shadow-gold-sm border border-[#E5CFA0]/30 mb-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-20 h-20 bg-[#FFF8E1] rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#DAA520]">
            <GraduationCap size={40} className="text-[#6B2C2C]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-secondary font-heading mb-3">
              {t('education.goal', 'Mục tiêu đào tạo')}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t('education.description', 'Chương trình đào tạo Cử nhân Phật học Nam tông Khmer được thiết kế trong 04 năm học, nhằm trang bị cho Tăng sinh kiến thức toàn diện về Tam tạng Pali, Văn hóa Khmer, và các môn học hiện đại (Anh văn, Tin học, Xã hội học...), tạo nền tảng vững chắc để phụng sự Đạo pháp và Dân tộc.')}
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-[#8B4513] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              <span>{isGenerating ? t('common.processing', 'Đang xử lý...') : t('education.download', 'Tải PDF Chi tiết')}</span>
            </button>
          </div>
        </div>

        {/* Year Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[1, 2, 3, 4].map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`
                        py-3 px-8 rounded-full font-bold font-heading text-lg transition-all duration-300 border-2
                        ${activeYear === year
                  ? 'bg-[#6B2C2C] text-[#FFD700] border-[#6B2C2C] shadow-lg transform -translate-y-1'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#DAA520] hover:text-[#DAA520]'
                }
                    `}
            >
              {t(`education.year${year}`, `Năm thứ ${yearToRoman(year)}`)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
          {currentCurriculum && currentCurriculum.subjects.length > 0 ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-secondary font-heading">
                  {t(`education.courseList`, 'Danh sách môn học')} - {t(`education.year${activeYear}`, `Năm thứ ${yearToRoman(activeYear)}`)}
                </h3>
                <p className="text-gray-500 italic">{t('education.semesters', 'Học kỳ I & Học kỳ II')}</p>
              </div>
              <CurriculumTable subjects={currentCurriculum.subjects} />
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              {t('common.no_data', 'Đang cập nhật dữ liệu...')}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

// Helper for Roman Numerals
const yearToRoman = (num: number) => {
  const roman = ["I", "II", "III", "IV"];
  return roman[num - 1] || num;
};

export default Education;