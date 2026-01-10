import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../router/routes';

const Footer: React.FC = () => {
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
                <div className="w-full h-full flex items-center justify-center text-xs font-bold" style={{ color: '#6B2C2C' }}>
                  LOGO
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-3">
              HỌC VIỆN PHẬT GIÁO NAM TÔNG CẦN THƠ
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Khu vực 12, Phường Châu Văn Liêm<br />
              Quận Ô Môn, TP. Cần Thơ
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Trang chủ</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to={ROUTES.ABOUT}
                  className="transition-colors duration-200"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFE499'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.EDUCATION}
                  className="transition-colors duration-200"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFE499'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Đào tạo
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.NEWS}
                  className="transition-colors duration-200"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFE499'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Tin tức
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.ADMISSIONS}
                  className="transition-colors duration-200"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFE499'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Tuyển sinh
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li>📞 0292 738 925</li>
              <li>✉️ hocvienphatgiaonamtong@edu.vn</li>
              <li>🌐 hocvienphatgiaonamtong.vn</li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h4 className="font-bold mb-4">Theo dõi</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                F
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                Y
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                I
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 text-center" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            © 2026 Học viện Phật giáo Nam tông Khmer - Cần Thơ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;