import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { admissionsApi, AdmissionPeriod } from '../api/admissions';
import { useFetch } from '../hooks/useFetch';

const Admissions: React.FC = () => {
   const fetchCurrentPeriod = useCallback(() => admissionsApi.getCurrentPeriod(), []);
   const { data: period, loading: periodLoading } = useFetch<AdmissionPeriod>(fetchCurrentPeriod);

   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

   useEffect(() => {
      if (!period || !period.application_end_date) return;

      // Auto-calculate time left
      const calculateTimeLeft = () => {
         const difference = +new Date(period.application_end_date) - +new Date();
         let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

         if (difference > 0) {
            timeLeft = {
               days: Math.floor(difference / (1000 * 60 * 60 * 24)),
               hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
               minutes: Math.floor((difference / 1000 / 60) % 60),
               seconds: Math.floor((difference / 1000) % 60),
            };
         }
         setTimeLeft(timeLeft);
      }

      // Initial call
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
   }, [period]);

   return (
      <div className="min-h-screen bg-[#FDF5E6] pb-20 font-sans">

         {/* DECORATIVE FRAME WRAPPER */}
         <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="relative bg-[#FFFAF0] rounded-3xl shadow-2xl border-[8px] border-double border-[#8B4513] overflow-hidden p-6 md:p-12 mb-10">

               {/* Corner Ornaments */}
               <div className="absolute top-0 left-0 w-32 h-32 border-t-[12px] border-l-[12px] border-[#DAA520] rounded-tl-3xl opacity-80 pointer-events-none"></div>
               <div className="absolute top-0 right-0 w-32 h-32 border-t-[12px] border-r-[12px] border-[#DAA520] rounded-tr-3xl opacity-80 pointer-events-none"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[12px] border-l-[12px] border-[#DAA520] rounded-bl-3xl opacity-80 pointer-events-none"></div>
               <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[12px] border-r-[12px] border-[#DAA520] rounded-br-3xl opacity-80 pointer-events-none"></div>

               {/* HEADER */}
               <div className="text-center mb-12 relative z-10">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#6B2C2C] mb-2 drop-shadow-sm">
                     Đăng Ký Tuyển Sinh
                  </h1>
                  <p className="text-[#8B4513] font-serif text-xl italic mb-4">
                     {periodLoading ? 'Đang tải thông tin...' : (period ? `Khóa ${period.admission_year}` : 'Hiện chưa có đợt tuyển sinh')}
                  </p>
                  <div className="w-64 h-1 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent mx-auto"></div>
               </div>

               {/* TIMER BANNER */}
               {period && period.status === 'OPEN' && (
                  <div className="relative z-10 bg-white rounded-xl shadow-gold-sm p-8 mb-12 flex flex-col md:flex-row justify-between items-center border-2 border-[#DAA520] max-w-4xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
                     <div className="mb-4 md:mb-0 text-center md:text-left">
                        <h3 className="font-serif font-bold text-[#6B2C2C] text-xl flex items-center gap-2 justify-center md:justify-start">
                           <Clock className="text-[#DAA520]" />
                           Thời hạn nộp hồ sơ còn:
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">Hạn chót: {new Date(period.application_end_date).toLocaleDateString('vi-VN')}</p>
                     </div>
                     <div className="flex items-center space-x-4">
                        {['Ngày', 'Giờ', 'Phút', 'Giây'].map((label, idx) => {
                           const value = idx === 0 ? timeLeft.days : idx === 1 ? timeLeft.hours : idx === 2 ? timeLeft.minutes : timeLeft.seconds;
                           return (
                              <div key={label} className="flex flex-col items-center">
                                 <span className="bg-[#6B2C2C] text-[#FFD700] text-3xl font-mono font-bold w-16 h-16 rounded-lg flex items-center justify-center shadow-lg border border-[#DAA520]">
                                    {value.toString().padStart(2, '0')}
                                 </span>
                                 <span className="text-xs text-secondary font-bold mt-2 uppercase tracking-wider">{label}</span>
                              </div>
                           )
                        })}
                     </div>
                  </div>
               )}

               {/* WIZARD STEPS */}
               <div className="relative z-10 max-w-4xl mx-auto mb-12">
                  <div className="flex justify-between items-center relative px-4">
                     {/* Connecting Line */}
                     <div className="absolute left-8 right-8 top-5 h-1 bg-[#E5CFA0] -z-10"></div>

                     {[
                        { num: 1, label: 'Thông tin cá nhân', active: true },
                        { num: 2, label: 'Thông tin tu học', active: false },
                        { num: 3, label: 'Hồ sơ đính kèm', active: false },
                        { num: 4, label: 'Xác nhận', active: false }
                     ].map((step) => (
                        <div key={step.num} className="flex flex-col items-center group cursor-pointer">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-300 z-10
                       ${step.active
                                 ? 'bg-[#6B2C2C] text-white border-[#DAA520] shadow-gold-md scale-110'
                                 : 'bg-white text-gray-400 border-[#E5CFA0] group-hover:border-[#DAA520]'}`}>
                              {step.active ? <CheckCircle size={20} /> : step.num}
                           </div>
                           <span className={`text-xs font-bold mt-3 hidden md:block px-2 py-1 rounded transition-colors
                       ${step.active ? 'text-[#6B2C2C] bg-[#FFF8E1]' : 'text-gray-400'}`}>
                              {step.label}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* FORM CONTAINER */}
               <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-[#E5CFA0] max-w-4xl mx-auto">
                  {/* Decorative Form Border */}
                  <div className="absolute inset-2 border border-dashed border-[#E5CFA0] rounded-xl pointer-events-none"></div>

                  <h2 className="text-2xl font-serif font-bold text-[#6B2C2C] mb-8 pb-4 border-b-2 border-[#E5CFA0]/30 relative z-10">
                     Bước 1: Thông Tin Cá Nhân
                  </h2>

                  <form className="space-y-6 relative z-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-[#8B4513] mb-2">Họ và tên Khmer <span className="text-red-500">*</span></label>
                           <input type="text" className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520] outline-none transition-all placeholder-gray-400" placeholder="Nhập họ và tên..." />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-[#8B4513] mb-2">Tên Pali (nếu có)</label>
                           <input type="text" className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520] outline-none transition-all placeholder-gray-400" placeholder="Nhập tên Pali..." />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-[#8B4513] mb-2">Ngày sinh</label>
                           <input type="date" className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-[#8B4513] mb-2">Số điện thoại</label>
                           <input type="tel" className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none placeholder-gray-400" placeholder="090..." />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-[#8B4513] mb-2">Email</label>
                           <input type="email" className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none placeholder-gray-400" placeholder="example@email.com" />
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-[#8B4513] mb-2">Địa chỉ thường trú</label>
                        <input type="text" className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none placeholder-gray-400" placeholder="Số nhà, đường, phường/xã..." />
                     </div>

                     <div className="flex justify-end pt-8">
                        <button type="button" className="group relative px-10 py-3 bg-[#6B2C2C] text-white font-bold rounded-lg shadow-lg hover:shadow-gold-lg overflow-hidden transition-all">
                           <span className="relative z-10 flex items-center gap-2">Tiếp theo →</span>
                           <div className="absolute inset-0 bg-[#8B4513] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                        </button>
                     </div>
                  </form>
               </div>

            </div>
         </div>
      </div>
   );
};

export default Admissions;