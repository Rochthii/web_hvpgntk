import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, UploadCloud, FileText, ChevronLeft, ChevronRight, AlertCircle, X } from 'lucide-react';
import { admissionsApi, AdmissionPeriod } from '../api/admissions';
import { useFetch } from '../hooks/useFetch';

import { Toaster, toast } from 'react-hot-toast';

const Admissions: React.FC = () => {
   const fetchCurrentPeriod = useCallback(() => admissionsApi.getCurrentPeriod(), []);
   const { data: rawPeriod, loading: periodLoading } = useFetch(fetchCurrentPeriod);

   // Robust check: Ensure period is a valid object with an ID or required field
   const period = (rawPeriod && typeof rawPeriod === 'object' && 'id' in rawPeriod) ? rawPeriod as AdmissionPeriod : null;

   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

   // Form State
   const [currentStep, setCurrentStep] = useState(1);
   const [isSuccess, setIsSuccess] = useState(false); // New Success State
   const [formData, setFormData] = useState<any>({
      applicant_name: '',
      date_of_birth: '',
      place_of_birth: '',
      current_residence: '',
      phone: '',
      email: '',
      is_ordained: false,
      monk_name: '',
      ordination_date: '',
      vassa_count: 0,
      home_temple: '',
      recommending_monk: '',
      documents: {}
   });

   const [uploading, setUploading] = useState<string | null>(null);
   const [submitting, setSubmitting] = useState(false);

   // Handlers
   const handleNext = () => {
      // Simple validation
      if (currentStep === 1) {
         if (!formData.applicant_name || !formData.place_of_birth || !formData.current_residence) {
            toast.error("Vui lòng điền đủ các mục có dấu *", { position: 'top-center' });
            return;
         }
      }
      setCurrentStep(prev => prev + 1);
   };

   const handleBack = () => setCurrentStep(prev => prev - 1);

   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Client-side size check (5MB)
      if (file.size > 5 * 1024 * 1024) {
         toast.error("File quá lớn! Vui lòng chọn file dưới 5MB.");
         return;
      }

      setUploading(docType);
      const loadingToast = toast.loading("Đang tải lên...");
      try {
         const res = await admissionsApi.uploadFile(file);
         setFormData((prev: any) => ({
            ...prev,
            documents: { ...prev.documents, [docType]: res.data.url }
         }));
         toast.success("Tải lên thành công!", { id: loadingToast });
      } catch (error) {
         console.error("Upload error:", error);
         toast.error("Lỗi tải file. Vui lòng thử lại.", { id: loadingToast });
      } finally {
         setUploading(null);
      }
   };

   const handleSubmit = async () => {
      if (!period) return;
      setSubmitting(true);
      const loadingToast = toast.loading("Đang nộp hồ sơ...");
      try {
         await admissionsApi.submitApplication({
            ...formData,
            period_id: period.id,
            admission_period: period.id
         });
         toast.success("Nộp hồ sơ thành công!", { id: loadingToast });
         setIsSuccess(true); // Show Success Screen
      } catch (error) {
         console.error(error);
         toast.error("Nộp hồ sơ thất bại. Vui lòng kiểm tra kết nối.", { id: loadingToast });
      } finally {
         setSubmitting(false);
      }
   };

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

   if (isSuccess) {
      return (
         <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-[#DAA520] max-w-lg text-center animate-fade-in-up">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
               </div>
               <h2 className="text-3xl font-serif font-bold text-[#6B2C2C] mb-4">Nộp Hồ Sơ Thành Công!</h2>
               <p className="text-gray-600 mb-6">
                  Cảm ơn bạn đã đăng ký tuyển sinh vào Học viện. <br />
                  Hồ sơ của bạn đã được ghi nhận và đang chờ xét duyệt.
               </p>
               <div className="p-4 bg-[#FFFAF0] rounded-lg border border-[#E5CFA0] mb-8 text-sm text-[#8B4513]">
                  <p className="font-bold">Lưu ý:</p>
                  <ul className="list-disc list-inside text-left mt-2 space-y-1">
                     <li>Nhà trường sẽ liên hệ qua SĐT/Email trong vòng 3-5 ngày làm việc.</li>
                     <li>Vui lòng để ý điện thoại để nhận thông báo phỏng vấn.</li>
                  </ul>
               </div>
               <button
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-3 bg-[#6B2C2C] text-white rounded-lg font-bold shadow-lg hover:bg-[#8B4513] transition-colors"
               >
                  Về Trang Chủ
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#FDF5E6] pb-20 font-sans">
         <Toaster />
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
                        { num: 1, label: 'Cá nhân', active: currentStep >= 1 },
                        { num: 2, label: 'Tu học', active: currentStep >= 2 },
                        { num: 3, label: 'Hồ sơ', active: currentStep >= 3 },
                        { num: 4, label: 'Xác nhận', active: currentStep >= 4 }
                     ].map((step) => (
                        <div key={step.num} className="flex flex-col items-center group">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-300 z-10
                       ${step.active
                                 ? 'bg-[#6B2C2C] text-white border-[#DAA520] shadow-gold-md scale-110'
                                 : 'bg-white text-gray-400 border-[#E5CFA0]'}`}>
                              {currentStep > step.num ? <CheckCircle size={20} /> : step.num}
                           </div>
                           <span className={`text-xs font-bold mt-3 hidden md:block px-2 py-1 rounded transition-colors
                       ${currentStep === step.num ? 'text-[#6B2C2C] bg-[#FFF8E1]' : 'text-gray-400'}`}>
                              {step.label}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* FORM CONTAINER */}
               <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-[#E5CFA0] max-w-4xl mx-auto min-h-[500px]">
                  {/* Decorative Form Border */}
                  <div className="absolute inset-2 border border-dashed border-[#E5CFA0] rounded-xl pointer-events-none"></div>

                  <h2 className="text-2xl font-serif font-bold text-[#6B2C2C] mb-8 pb-4 border-b-2 border-[#E5CFA0]/30 relative z-10">
                     {currentStep === 1 && "Bước 1: Thông Tin Cá Nhân"}
                     {currentStep === 2 && "Bước 2: Thông Tin Tu Học"}
                     {currentStep === 3 && "Bước 3: Hồ Sơ Đính Kèm"}
                     {currentStep === 4 && "Bước 4: Xác Nhận Thông Tin"}
                  </h2>

                  <div className="relative z-10">
                     {/* STEP 1: PERSONAL INFO */}
                     {currentStep === 1 && (
                        <div className="space-y-6 animate-fade-in-up">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <label className="block text-sm font-bold text-[#8B4513] mb-2">Họ và tên Khmer <span className="text-red-500">*</span></label>
                                 <input type="text" value={formData.applicant_name} onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none" placeholder="Nhập họ và tên..." />
                              </div>
                              <div>
                                 <label className="block text-sm font-bold text-[#8B4513] mb-2">Tên Pali (nếu có)</label>
                                 <input type="text" value={formData.monk_name} onChange={(e) => setFormData({ ...formData, monk_name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none" placeholder="Nhập tên Pali..." />
                              </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                 <label className="block text-sm font-bold text-[#8B4513] mb-2">Ngày sinh</label>
                                 <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none" />
                              </div>
                              <div>
                                 <label className="block text-sm font-bold text-[#8B4513] mb-2">Số điện thoại</label>
                                 <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none" placeholder="09..." />
                              </div>
                              <div>
                                 <label className="block text-sm font-bold text-[#8B4513] mb-2">Email</label>
                                 <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none" placeholder="email@..." />
                              </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <label className="block text-sm font-bold text-[#8B4513] mb-2">Nơi sinh (Tỉnh/Thành) <span className="text-red-500">*</span></label>
                                 <input type="text" value={formData.place_of_birth} onChange={(e) => setFormData({ ...formData, place_of_birth: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none" placeholder="Nhập nơi sinh..." />
                              </div>
                              <div>
                                 <label className="block text-sm font-bold text-[#8B4513] mb-2">Địa chỉ thường trú <span className="text-red-500">*</span></label>
                                 <input type="text" value={formData.current_residence} onChange={(e) => setFormData({ ...formData, current_residence: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#FFFAF0] border border-[#E5CFA0] focus:border-[#DAA520] outline-none" placeholder="Nhập địa chỉ..." />
                              </div>
                           </div>
                        </div>
                     )}

                     {/* STEP 2: MONASTIC INFO */}
                     {currentStep === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                           <label className="flex items-center space-x-3 p-4 bg-[#FFFAF0] rounded-lg border border-[#DAA520]">
                              <input type="checkbox" checked={formData.is_ordained} onChange={(e) => setFormData({ ...formData, is_ordained: e.target.checked })} className="w-5 h-5 text-[#6B2C2C] focus:ring-[#DAA520] border-gray-300 rounded" />
                              <span className="font-bold text-[#6B2C2C]">Tôi là Tăng sinh (Đã thọ giới)</span>
                           </label>

                           {formData.is_ordained && (
                              <>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                       <label className="block text-sm font-bold text-[#8B4513] mb-2">Ngày thọ giới</label>
                                       <input type="date" value={formData.ordination_date} onChange={(e) => setFormData({ ...formData, ordination_date: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white border border-[#E5CFA0] focus:border-[#DAA520] outline-none" />
                                    </div>
                                    <div>
                                       <label className="block text-sm font-bold text-[#8B4513] mb-2">Số hạ (Vassa)</label>
                                       <input type="number" value={formData.vassa_count} onChange={(e) => setFormData({ ...formData, vassa_count: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-lg bg-white border border-[#E5CFA0] focus:border-[#DAA520] outline-none" />
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                       <label className="block text-sm font-bold text-[#8B4513] mb-2">Sinh hoạt tại Chùa</label>
                                       <input type="text" value={formData.home_temple} onChange={(e) => setFormData({ ...formData, home_temple: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white border border-[#E5CFA0] focus:border-[#DAA520] outline-none" placeholder="Tên chùa..." />
                                    </div>
                                    <div>
                                       <label className="block text-sm font-bold text-[#8B4513] mb-2">Vị sư giới thiệu</label>
                                       <input type="text" value={formData.recommending_monk} onChange={(e) => setFormData({ ...formData, recommending_monk: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white border border-[#E5CFA0] focus:border-[#DAA520] outline-none" placeholder="Đại đức..." />
                                    </div>
                                 </div>
                              </>
                           )}
                        </div>
                     )}

                     {/* STEP 3: DOCUMENTS */}
                     {currentStep === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                           {[
                              { id: 'identity_card', label: 'CCCD / Hộ chiếu (Mặt trước)' },
                              { id: 'monk_certificate', label: 'Chứng nhận Tăng Ni (Nếu có)' },
                              { id: 'recommendation_letter', label: 'Giấy giới thiệu' }
                           ].map((doc) => (
                              <div key={doc.id} className="bg-[#FFFAF0] p-4 rounded-lg border border-[#E5CFA0]">
                                 <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                       <div className={`p-2 rounded-full ${formData.documents[doc.id] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                          <FileText size={20} />
                                       </div>
                                       <div>
                                          <p className="font-bold text-[#6B2C2C]">{doc.label}</p>
                                          {formData.documents[doc.id] ? (
                                             <a href={formData.documents[doc.id]} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Xem file đã tải lên</a>
                                          ) : (
                                             <p className="text-xs text-gray-500">Chưa có file</p>
                                          )}
                                       </div>
                                    </div>
                                    <div className="relative">
                                       <input
                                          type="file"
                                          accept=".pdf,.jpg,.jpeg,.png"
                                          onChange={(e) => handleFileUpload(e, doc.id)}
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          disabled={uploading === doc.id}
                                       />
                                       <button className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${uploading === doc.id ? 'bg-gray-200 text-gray-500' : 'bg-[#DAA520] text-white hover:bg-[#B8860B]'}`}>
                                          <UploadCloud size={16} />
                                          {uploading === doc.id ? 'Đang tải...' : (formData.documents[doc.id] ? 'Thay đổi' : 'Tải lên')}
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {/* STEP 4: REVIEW */}
                     {currentStep === 4 && (
                        <div className="space-y-6 animate-fade-in-up">
                           <div className="bg-[#FFFAF0] p-6 rounded-lg border border-[#DAA520] text-center">
                              <CheckCircle className="w-16 h-16 text-[#DAA520] mx-auto mb-4" />
                              <h3 className="text-xl font-bold text-[#6B2C2C]">Xác nhận nộp hồ sơ?</h3>
                              <p className="text-gray-600 mt-2">Vui lòng kiểm tra kỹ thông tin trước khi nộp. Sau khi nộp, bạn sẽ không thể chỉnh sửa.</p>
                           </div>
                           <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                 <span className="text-gray-500 block">Họ tên:</span>
                                 <span className="font-bold">{formData.applicant_name}</span>
                              </div>
                              <div>
                                 <span className="text-gray-500 block">Ngày sinh:</span>
                                 <span className="font-bold">{formData.date_of_birth}</span>
                              </div>
                              <div>
                                 <span className="text-gray-500 block">Pháp danh:</span>
                                 <span className="font-bold">{formData.monk_name || 'Không'}</span>
                              </div>
                              <div>
                                 <span className="text-gray-500 block">Số file:</span>
                                 <span className="font-bold">{Object.keys(formData.documents).length} tài liệu</span>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* ACTION BUTTONS */}
                     <div className="flex justify-between pt-8 border-t border-[#E5CFA0]/30 mt-8">
                        {currentStep > 1 ? (
                           <button onClick={handleBack} className="px-6 py-3 rounded-lg border-2 border-[#8B4513] text-[#8B4513] font-bold hover:bg-[#FFFAF0] flex items-center gap-2">
                              <ChevronLeft size={18} /> Quay lại
                           </button>
                        ) : <div></div>}

                        {currentStep < 4 ? (
                           <button onClick={handleNext} className="px-8 py-3 bg-[#6B2C2C] text-white rounded-lg font-bold shadow-lg hover:bg-[#8B4513] flex items-center gap-2">
                              Tiếp tục <ChevronRight size={18} />
                           </button>
                        ) : (
                           <button onClick={handleSubmit} disabled={submitting} className="px-10 py-3 bg-[#DAA520] text-white rounded-lg font-bold shadow-lg hover:bg-[#B8860B] flex items-center gap-2">
                              {submitting ? 'Đang xử lý...' : 'Nộp Hồ Sơ Chính Thức'} <CheckCircle size={18} />
                           </button>
                        )}
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
};

export default Admissions;