import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NotificationBell } from './layout/NotificationBell';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../router/routes';

const Header: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
              {t('nav.home')}
            </Link>
            <Link to={ROUTES.ABOUT} className={getLinkClass(ROUTES.ABOUT)}>
              {t('nav.about')}
            </Link>
            <Link to={ROUTES.EDUCATION} className={getLinkClass(ROUTES.EDUCATION)}>
              {t('nav.education')}
            </Link>
            <Link to={ROUTES.NEWS} className={getLinkClass(ROUTES.NEWS)}>
              {t('nav.news')}
            </Link>
            <Link to={ROUTES.ADMISSIONS} className={getLinkClass(ROUTES.ADMISSIONS)}>
              {t('nav.admissions')}
            </Link>
            <Link to={ROUTES.CONTACT} className={getLinkClass(ROUTES.CONTACT)}>
              {t('nav.contact')}
            </Link>


          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link to={ROUTES.PROFILE} className="flex items-center gap-2 hover:bg-white/10 p-1 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-orange-200 border-2 border-orange-300 overflow-hidden flex items-center justify-center text-[#6B2C2C] font-bold text-xs">
                  {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : user.display_name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium hidden md:inline">{user.display_name?.split(' ').pop()}</span>
              </Link>
            ) : (
              <Link to={ROUTES.STUDENT_PORTAL} className="text-sm font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors">
                {t('nav.login')}
              </Link>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => changeLanguage('vi')}
                className={`text-sm font-bold transition-colors ${i18n.language === 'vi'
                    ? 'text-[#FFA726]'
                    : 'text-white/80 hover:text-white'
                  }`}
              >
                VI
              </button>
              <div className="w-px h-4 bg-white/20"></div>
              <button
                onClick={() => changeLanguage('km')}
                className={`text-sm font-bold transition-colors ${i18n.language === 'km'
                    ? 'text-[#FFA726]'
                    : 'text-white/80 hover:text-white'
                  }`}
              >
                KH
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;