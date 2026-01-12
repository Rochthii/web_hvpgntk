import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import client from '../api/client';
import toast, { Toaster } from 'react-hot-toast';

import { useSiteSettings } from '../features/news/hooks/useNews';

const Contact: React.FC = () => {
   const { data: settings } = useSiteSettings();
   const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
   const [loading, setLoading] = React.useState(false);

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
         toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.', { id: loadingToast });
         setFormData({ name: '', email: '', message: '' });
      } catch (err) {
         console.error(err);
         toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.', { id: loadingToast });
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-cream">
         <Toaster position="top-center" />
         <div className="py-16 text-center">
            <h1 className="text-4xl font-serif font-bold text-secondary mb-2">Liên Hệ</h1>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
         </div>

         <div className="container mx-auto px-4 pb-20">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-amber-100">

               {/* Left: Form */}
               <div className="lg:w-1/2 p-8 lg:p-12 bg-amber-50/50">
                  <h2 className="text-2xl font-serif font-bold text-secondary mb-6">Gửi tin nhắn cho chúng tôi</h2>
                  <form className="space-y-5" onSubmit={handleSubmit}>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Họ tên:</label>
                        <input
                           required
                           type="text"
                           value={formData.name}
                           onChange={e => setFormData({ ...formData, name: e.target.value })}
                           className="w-full bg-white border border-amber-200 rounded p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email:</label>
                        <input
                           required
                           type="email"
                           value={formData.email}
                           onChange={e => setFormData({ ...formData, email: e.target.value })}
                           className="w-full bg-white border border-amber-200 rounded p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung tin nhắn:</label>
                        <textarea
                           required
                           rows={4}
                           value={formData.message}
                           onChange={e => setFormData({ ...formData, message: e.target.value })}
                           className="w-full bg-white border border-amber-200 rounded p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        ></textarea>
                     </div>
                     <button
                        disabled={loading}
                        className={`bg-secondary hover:bg-secondary-accent text-white font-bold py-3 px-8 rounded flex items-center transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                     >
                        {loading ? 'Đang gửi...' : <><Send size={16} className="mr-2" /> Gửi đi</>}
                     </button>
                  </form>

                  <div className="mt-10 space-y-4 pt-8 border-t border-amber-200">
                     <div className="flex items-start space-x-3">
                        <div className="bg-secondary text-white p-2 rounded-full mt-1">
                           <MapPin size={16} />
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-800">Địa chỉ:</h4>
                           <p className="text-sm text-gray-600">{settings?.contact_address || 'Khu vực 12, Phường Châu Văn Liêm, Quận Ô Môn, TP. Cần Thơ'}</p>
                        </div>
                     </div>
                     <div className="flex items-start space-x-3">
                        <div className="bg-secondary text-white p-2 rounded-full mt-1">
                           <Phone size={16} />
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-800">Điện thoại:</h4>
                           <p className="text-sm text-gray-600">{settings?.contact_phone || '0292 738 925'}</p>
                        </div>
                     </div>
                     <div className="flex items-start space-x-3">
                        <div className="bg-secondary text-white p-2 rounded-full mt-1">
                           <Mail size={16} />
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-800">Email:</h4>
                           <p className="text-sm text-gray-600">{settings?.contact_email || 'contact@hvpgntk.edu.vn'}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right: Map Placeholder */}
               <div className="lg:w-1/2 bg-gray-200 relative min-h-[400px]">
                  <iframe
                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.567634898144!2d105.7276563147653!3d10.052516992815143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a087c5660662d5%3A0x8846175f32483569!2zSOG7jWMgVmnhu4duIFBo4bqtdCBGiDoobyBOYW0gVMO0bmcgS2htZXI!5e0!3m2!1sen!2s!4v1626248562856!5m2!1sen!2s"
                     width="100%"
                     height="100%"
                     style={{ border: 0, position: 'absolute', inset: 0 }}
                     allowFullScreen={true}
                     loading="lazy"
                  ></iframe>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Contact;