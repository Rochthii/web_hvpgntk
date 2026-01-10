import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ROUTES } from '../router/routes';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClass = (path: string) => {
    return `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${isActive(path)
        ? 'bg-[#FFA726] text-white' // Active state (Golden/Orange)
        : 'text-white/90 hover:text-white hover:bg-white/10' // Inactive state
      }`;
  };

  return (
    <header
      className="sticky top-0 z-[1100] bg-gradient-to-r from-[#6B2C2C] via-[#3E2723] to-[#6B2C2C] text-white shadow-lg"
      style={{ height: '80px' }}
    >
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <div
              className="bg-white rounded-full flex items-center justify-center overflow-hidden"
              style={{ width: '60px', height: '60px' }}
            >
              <img
                src="/logo-hvpgntk.png"
                alt="Logo GHPGVN"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link to={ROUTES.HOME} className={getLinkClass(ROUTES.HOME)}>
              Trang chủ
            </Link>
            <Link to={ROUTES.ABOUT} className={getLinkClass(ROUTES.ABOUT)}>
              Giới thiệu
            </Link>
            <Link to={ROUTES.EDUCATION} className={getLinkClass(ROUTES.EDUCATION)}>
              Đào tạo
            </Link>
            <Link to={ROUTES.NEWS} className={getLinkClass(ROUTES.NEWS)}>
              Tin tức
            </Link>
            <Link to={ROUTES.ADMISSIONS} className={getLinkClass(ROUTES.ADMISSIONS)}>
              Tuyển sinh
            </Link>
            <Link to={ROUTES.CONTACT} className={getLinkClass(ROUTES.CONTACT)}>
              Liên hệ
            </Link>
          </nav>

          {/* Right side - Language */}
          <div className="flex items-center gap-4">
            <button className="text-white/80 hover:text-white transition-colors text-sm">
              VI
            </button>
            <button className="text-white/80 hover:text-white transition-colors text-sm">
              KH
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;