import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import client from '../api/client';
import toast, { Toaster } from 'react-hot-toast';
import { useSiteSettings } from '../features/news/hooks/useNews';

const Contact: React.FC = () => {
   const { data: settings } = useSiteSettings();
   const [formData, setFormData] = useState({ name: '', email: '', message: '' });
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      const loadingToast = toast.loading('Đang gửi tin nhắn...');

      try {
         await client.post('/core/contact/', {
            sender_name: formData.name,
            sender_email: formData.email,
            message: formData.message,
            subject: 'Liên hệ từ Website'
         });
         toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm.', { id: loadingToast });
         setFormData({ name: '', email: '', message: '' });
      } catch (err) {
         console.error(err);
         toast.error('Gửi thất bại. Vui lòng thử lại sau.', { id: loadingToast });
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#FDF5E6] pb-20 font-sans">
         <Toaster position="top-center" />

         {/* HEADER SECTION */}
         <div className="relative py-20 bg-[#6B2C2C] overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern-ornate.svg')] opacity-10"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
               <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#FFD700] mb-4 drop-shadow-md">
                  Liên Hệ Với Chúng Tôi
               </h1>
               <div className="w-32 h-1 bg-[#DAA520] mx-auto rounded-full mb-6"></div>
               <p className="text-[#E5CFA0] text-lg max-w-2xl mx-auto font-serif italic">
                  "Học viện luôn lắng nghe và sẵn sàng giải đáp mọi thắc mắc của Tăng Ni, Phật tử và quý độc giả."
               </p>
            </div>
         </div>

         <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-6xl">
            {/* Unified Card Design - Low Contrast */}
            <div className="bg-white rounded-3xl shadow-2xl border-[6px] border-double border-[#8B4513] overflow-hidden flex flex-col lg:flex-row">

               {/* LEFT: INFO & FORM */}
               <div className="lg:w-7/12 p-8 md:p-12 relative">
                  <h2 className="text-2xl font-bold text-[#6B2C2C] mb-8 flex items-center gap-3 border-b border-[#E5CFA0] pb-4">
                     <MessageSquare className="text-[#DAA520]" /> Gửi Tin Nhắn Trực Tuyến
                  </h2>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-[#8B4513] mb-2">Họ tên của bạn <span className="text-red-500">*</span></label>
                           <input
                              required
                              type="text"
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-[#FFFAF0] border border-[#E5CFA0] rounded-lg p-3 focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520] outline-none transition-all"
                              placeholder="Nhập họ tên..."
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-[#8B4513] mb-2">Email liên hệ <span className="text-red-500">*</span></label>
                           <input
                              required
                              type="email"
                              value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-[#FFFAF0] border border-[#E5CFA0] rounded-lg p-3 focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520] outline-none transition-all"
                              placeholder="example@email.com"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-[#8B4513] mb-2">Lời nhắn <span className="text-red-500">*</span></label>
                        <textarea
                           required
                           rows={5}
                           value={formData.message}
                           onChange={e => setFormData({ ...formData, message: e.target.value })}
                           className="w-full bg-[#FFFAF0] border border-[#E5CFA0] rounded-lg p-3 focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520] outline-none transition-all"
                           placeholder="Nội dung cần hỗ trợ (Tuyển sinh, Cầu an, Cúng dường...)"
                        ></textarea>
                     </div>
                     <button
                        disabled={loading}
                        className="w-full py-4 bg-[#6B2C2C] hover:bg-[#8B4513] text-white font-bold rounded-lg shadow-lg hover:shadow-gold-md transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70"
                     >
                        {loading ? 'Đang gửi...' : <><Send size={20} /> Gửi Tin Nhắn Ngay</>}
                     </button>
                  </form>
               </div>

               {/* RIGHT: CONTACT INFO & MAP */}
               <div className="lg:w-5/12 bg-[#FFFAF0] border-l border-[#E5CFA0] p-8 md:p-12 relative flex flex-col justify-between">

                  <div>
                     <h3 className="text-xl font-bold text-[#6B2C2C] mb-8 border-b border-[#E5CFA0] pb-4">Thông Tin Liên Hệ</h3>

                     <div className="space-y-6">
                        <div className="flex items-start gap-4 group">
                           <div className="p-3 bg-white border border-[#E5CFA0] rounded-full text-[#6B2C2C] shadow-sm group-hover:text-[#DAA520] transition-colors">
                              <MapPin size={24} />
                           </div>
                           <div>
                              <h4 className="font-bold text-[#6B2C2C] text-lg">Địa chỉ</h4>
                              <p className="text-[#8B4513] leading-relaxed mt-1 text-sm">
                                 {settings?.contact_address || 'Khu vực 12, Phường Châu Văn Liêm, Quận Ô Môn, TP. Cần Thơ'}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                           <div className="p-3 bg-white border border-[#E5CFA0] rounded-full text-[#6B2C2C] shadow-sm group-hover:text-[#DAA520] transition-colors">
                              <Phone size={24} />
                           </div>
                           <div>
                              <h4 className="font-bold text-[#6B2C2C] text-lg">Điện thoại</h4>
                              <p className="text-[#8B4513] mt-1 font-mono text-lg font-bold">
                                 {settings?.contact_phone || '0292 738 925'}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                           <div className="p-3 bg-white border border-[#E5CFA0] rounded-full text-[#6B2C2C] shadow-sm group-hover:text-[#DAA520] transition-colors">
                              <Mail size={24} />
                           </div>
                           <div>
                              <h4 className="font-bold text-[#6B2C2C] text-lg">Email</h4>
                              <p className="text-[#8B4513] mt-1 text-sm">
                                 {settings?.contact_email || 'contact@hvpgntk.edu.vn'}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                           <div className="p-3 bg-white border border-[#E5CFA0] rounded-full text-[#6B2C2C] shadow-sm group-hover:text-[#DAA520] transition-colors">
                              <Clock size={24} />
                           </div>
                           <div>
                              <h4 className="font-bold text-[#6B2C2C] text-lg">Giờ làm việc</h4>
                              <p className="text-[#8B4513] mt-1 text-sm">
                                 Thứ 2 - Thứ 7: 7:00 - 17:00 <br />
                                 Chủ nhật: Nghỉ
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* MINI MAP PREVIEW */}
                  <div className="mt-8 rounded-xl overflow-hidden border border-[#DAA520] shadow-md h-48 relative group">
                     <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.567634898144!2d105.7276563147653!3d10.052516992815143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a087c5660662d5%3A0x8846175f32483569!2zSOG7jWMgVmnhu4duIFBo4bqtdCBGiDoobyBOYW0gVMO0bmcgS2htZXI!5e0!3m2!1sen!2s!4v1626248562856!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        className="grayscale group-hover:grayscale-0 transition-all duration-500"
                     ></iframe>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Contact;