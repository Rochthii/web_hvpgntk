import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../router/routes';
import { cmsApi, SiteSettings } from '../api/cms';
import { useFetch } from '../hooks/useFetch';

const Footer: React.FC = () => {
  const fetchSettings = useCallback(() => cmsApi.getSettings(), []);
  const { data: settings } = useFetch<SiteSettings>(fetchSettings);

  return (
    <footer
      className="text-white pt-16 pb-8"
      style={{
        background: 'linear-gradient(135deg, #4E342E 0%, #6B2C2C 100%)',
        minHeight: '300px'
      }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="bg-white rounded-full flex items-center justify-center overflow-hidden"
                style={{ width: '48px', height: '48px' }}
              >
                <img
                  src={settings?.logo_url || "/logo-hvpgntk.png"}
                  alt="Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-3 uppercase">
              {settings?.site_name_vi || "HỌC VIỆN PHẬT GIÁO NAM TÔNG CẦN THƠ"}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {settings?.contact_address || "Khu vực 12, Phường Châu Văn Liêm, Quận Ô Môn, TP. Cần Thơ"}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Trang chủ</h4>
            <ul className="space-y-2">
              <li>
                <Link to={ROUTES.ABOUT} className="hover:text-[#FFE499] text-white/80 transition-colors">Giới thiệu</Link>
              </li>
              <li>
                <Link to={ROUTES.EDUCATION} className="hover:text-[#FFE499] text-white/80 transition-colors">Đào tạo</Link>
              </li>
              <li>
                <Link to={ROUTES.NEWS} className="hover:text-[#FFE499] text-white/80 transition-colors">Tin tức</Link>
              </li>
              <li>
                <Link to={ROUTES.ADMISSIONS} className="hover:text-[#FFE499] text-white/80 transition-colors">Tuyển sinh</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>📞 {settings?.contact_phone || "0292 738 925"}</li>
              <li>✉️ {settings?.contact_email || "contact@hvpgntk.edu.vn"}</li>
              <li>🌐 hocvienphatgiaonamtong.vn</li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h4 className="font-bold mb-4">Theo dõi</h4>
            <div className="flex gap-3">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">F</a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">Y</a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 text-center border-white/10">
          <p className="text-sm text-white/60">
            {settings?.footer_text_vi || "© 2026 Học viện Phật giáo Nam tông Khmer - Cần Thơ. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;