import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../router/routes';
import { cmsApi, SiteSettings } from '../api/cms';
import { useFetch } from '../hooks/useFetch';
import { ArrowUp, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const fetchSettings = useCallback(() => cmsApi.getSettings(), []);
  const { data: settings } = useFetch<SiteSettings>(fetchSettings);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#2C1810] text-[#E5CFA0] pt-20 pb-10 overflow-hidden font-sans border-t-4 border-[#DAA520]">

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern-ornate.svg')] opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 shadow-[0_0_15px_rgba(218,165,32,0.5)]">
                <img
                  src={settings?.logo_url || "/logo-hvpgntk.png"}
                  alt="Logo HVPGNTK"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-lg leading-tight uppercase tracking-wide">
                  Học Viện Phật Giáo <br /> <span className="text-[#DAA520]">Nam Tông Khmer</span>
                </h3>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed text-justify">
              Nơi đào tạo Tăng tài, gìn giữ và phát huy bản sắc văn hóa Phật giáo Nam tông Khmer, góp phần xây dựng đạo pháp và dân tộc.
            </p>
            <div className="flex gap-4 pt-2">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#6B2C2C] flex items-center justify-center text-[#FFD700] hover:bg-[#DAA520] hover:text-white transition-all shadow-lg transform hover:-translate-y-1">
                  <Facebook size={20} />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#6B2C2C] flex items-center justify-center text-[#FFD700] hover:bg-[#DAA520] hover:text-white transition-all shadow-lg transform hover:-translate-y-1">
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-white text-xl mb-6 relative inline-block">
              Liên Kết Nhanh
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#DAA520]"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Trang chủ', link: ROUTES.HOME },
                { label: 'Giới thiệu', link: ROUTES.ABOUT },
                { label: 'Chương trình đào tạo', link: ROUTES.EDUCATION },
                { label: 'Tin tức & Sự kiện', link: ROUTES.NEWS },
                { label: 'Tuyển sinh', link: ROUTES.ADMISSIONS },
                { label: 'Liên hệ', link: ROUTES.CONTACT },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.link} className="flex items-center gap-2 hover:text-[#FFD700] transition-colors group">
                    <span className="w-1.5 h-1.5 bg-[#6B2C2C] rounded-full group-hover:bg-[#DAA520] transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-bold text-white text-xl mb-6 relative inline-block">
              Thông Tin Liên Hệ
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#DAA520]"></span>
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#DAA520] mt-1 shrink-0" size={20} />
                <div>
                  <strong className="block text-white">Địa chỉ:</strong>
                  <span className="opacity-90">{settings?.contact_address || "Khu vực 12, Phường Châu Văn Liêm, Quận Ô Môn, TP. Cần Thơ"}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <Phone className="text-[#DAA520] shrink-0" size={20} />
                  <div>
                    <strong className="block text-white">Điện thoại:</strong>
                    <span className="opacity-90">{settings?.contact_phone || "0292 738 925"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="text-[#DAA520] shrink-0" size={20} />
                  <div>
                    <strong className="block text-white">Email:</strong>
                    <span className="opacity-90">{settings?.contact_email || "contact@hvpgntk.edu.vn"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter (Optional) */}
            <div className="mt-8 bg-[#6B2C2C]/30 p-4 rounded-lg border border-[#6B2C2C]">
              <h5 className="font-bold text-[#FFD700] mb-2 text-sm uppercase">Đăng ký nhận tin</h5>
              <div className="flex gap-2">
                <input type="email" placeholder="Nhập email của bạn..." className="flex-1 bg-transparent border-b border-[#E5CFA0] text-sm py-1 px-2 focus:border-[#FFD700] outline-none placeholder-[#E5CFA0]/50" />
                <button className="text-sm font-bold text-[#FFD700] hover:text-white uppercase tracking-wider">Gửi</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#6B2C2C] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
          <p>
            {settings?.footer_text_vi || "© 2026 Học viện Phật giáo Nam tông Khmer Cần Thơ."}
          </p>
          <p>
            Phát triển bởi <span className="text-[#DAA520] font-bold">Chăm Rốch Thi</span>
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-[#DAA520] hover:bg-[#FFD700] text-[#2C1810] p-3 rounded-full shadow-lg transition-all transform hover:-translate-y-1 z-50 group border-2 border-white/20"
        title="Về đầu trang"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
      </button>

    </footer>
  );
};
export default Footer;