import React, { useState } from 'react';
import { GraduationCap, Download } from 'lucide-react';
import { generateCurriculumPDF } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';
import { CurriculumTable } from '../components/education/CurriculumTable';

// TODO: Fetch from Course API instead of hardcoded data
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

// Temporary data - will be replaced with API fetch
const educationData: YearCurriculum[] = [
  {
    year: 1,
    subjects: [
      { id: "1", code: "TH014", name: "Thái Ngữ – I", credits: 4 },
      { id: "2", code: "SV013", name: "Xã Hội Học", credits: 3 },
      { id: "3", code: "SS014", name: "Sanskrit – I", credits: 4 },
      { id: "4", code: "SD013", name: "Thiền Học – I", credits: 3 },
      { id: "5", code: "PL314", name: "Dịch Thuật Pali – I", credits: 4 },
      { id: "6", code: "PL214", name: "Cú Pháp Pali – I", credits: 4 },
      { id: "7", code: "PL114", name: "Văn Phạm Pali – I", credits: 4 },
    ]
  },
  {
    year: 2,
    subjects: [
      { id: "17", code: "SD243", name: "Thiền Học – II", credits: 3 },
      { id: "18", code: "TH244", name: "Thái Ngữ – II", credits: 4 },
      { id: "19", code: "EN244", name: "Anh Ngữ – II", credits: 4 },
      { id: "20", code: "TM012", name: "Tư Tưởng HCM", credits: 3 },
    ]
  },
  {
    year: 3,
    subjects: [
      { id: "35", code: "TK033", name: "Logic Học", credits: 3 },
      { id: "36", code: "TH334", name: "Thái Ngữ – III", credits: 4 },
      { id: "37", code: "SS334", name: "Sanskrit – III", credits: 4 },
    ]
  },
  {
    year: 4,
    subjects: [
      { id: "50", code: "VB014", name: "Văn Hóa Phật Giáo", credits: 4 },
      { id: "51", code: "TH444", name: "Thái Ngữ – IV", credits: 4 },
      { id: "52", code: "EN444", name: "Anh Ngữ – IV", credits: 4 },
    ]
  }
];

const Education: React.FC = () => {
  const [activeYear, setActiveYear] = useState<number>(1);
  const currentCurriculum = educationData.find(d => d.year === activeYear);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    const toastId = toast.loading('Đang tạo file PDF...');
    try {
      await generateCurriculumPDF();
      toast.success('Tải xuống thành công!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi khi tạo PDF.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-body">

      {/* Page Header */}
      <div className="bg-[#2C1810] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-ornate.svg')] opacity-5"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] font-heading mb-4 animate-fade-in-up">
            CHƯƠNG TRÌNH ĐÀO TẠO
          </h1>
          <div className="w-24 h-1 bg-[#DAA520] mx-auto rounded-full"></div>
          <p className="text-white/80 mt-6 max-w-2xl mx-auto leading-relaxed text-lg">
            Cử nhân Phật học (04 năm) - Hệ Chính quy
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
            <h2 className="text-2xl font-bold text-secondary font-heading mb-3">Mục tiêu đào tạo</h2>
            <p className="text-gray-600 leading-relaxed">
              Chương trình đào tạo Cử nhân Phật học Nam tông Khmer được thiết kế trong 04 năm học,
              nhằm trang bị cho Tăng sinh kiến thức toàn diện về Tam tạng Pali, Văn hóa Khmer,
              và các môn học hiện đại (Anh văn, Tin học, Xã hội học...), tạo nền tảng vững chắc để phụng sự Đạo pháp và Dân tộc.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-[#8B4513] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              <span>{isGenerating ? 'Đang xử lý...' : 'Tải PDF Chi tiết'}</span>
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
              Năm thứ {yearToRoman(year)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
          {currentCurriculum ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-secondary font-heading">
                  Danh sách môn học - Năm thứ {yearToRoman(activeYear)}
                </h3>
                <p className="text-gray-500 italic">Học kỳ I & Học kỳ II</p>
              </div>
              <CurriculumTable subjects={currentCurriculum.subjects} />
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              Đang cập nhật dữ liệu...
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