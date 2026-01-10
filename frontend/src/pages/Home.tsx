import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cmsApi, SiteSettings, NewsItem } from '../api/cms';
import { ROUTES } from '../router/routes';

const Home: React.FC = () => {
  // Optimistic/Default Settings to prevent blocking
  const defaultSettings: SiteSettings = {
    site_name_vi: 'Học viện Phật giáo Nam tông Khmer',
    site_slogan_vi: 'Đoàn kết - Hòa hợp - Trí tuệ - Phụng sự',
    contact_email: 'hvpgntk@edu.vn',
    contact_phone: '0292 738 925',
    contact_address: 'Cần Thơ',
    founded_year: '2006',
    student_count: '450+',
    course_count: '30+',
    facebook_url: '',
    youtube_url: '',
    site_name_km: '',
    site_slogan_km: '',
    logo_url: '',
    favicon_url: '',
    google_maps_embed: '',
    footer_text_vi: '',
    footer_text_km: ''
  };

  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // 1. Fetch Settings (Fast)
  useEffect(() => {
    cmsApi.getSettings()
      .then(res => setSettings(prev => ({ ...prev, ...res.data })))
      .catch(err => console.error('Settings fetch error:', err));
  }, []);

  // 2. Fetch News (Lazy) - won't block main UI
  useEffect(() => {
    cmsApi.getLatestNews()
      .then(res => {
        setNews(res.data);
        setNewsLoading(false);
      })
      .catch(err => {
        console.error('News fetch error:', err);
        setNewsLoading(false);
      });
  }, []);

  // Removed blocking Loading state. The UI will render immediately with defaults.

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFF3E0'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: '72px',
        background: 'linear-gradient(90deg, #6B2C2C 0%, #3E2723 50%, #6B2C2C 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2.5rem',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to={ROUTES.HOME} style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(212,175,55,0.3)'
          }}>
            <img src="/logo-hvpgntk.png" alt={settings.site_name_vi} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Link>
        </div>

        <nav style={{ display: 'flex', gap: '0.375rem' }}>
          {[
            { label: 'Trang chủ', path: ROUTES.HOME },
            { label: 'Giới thiệu', path: ROUTES.ABOUT },
            { label: 'Đào tạo', path: ROUTES.EDUCATION },
            { label: 'Tin tức', path: ROUTES.NEWS },
            { label: 'Tuyển sinh', path: ROUTES.ADMISSIONS },
            { label: 'Liên hệ', path: ROUTES.CONTACT }
          ].map((item, idx) => (
            <Link
              key={item.label}
              to={item.path}
              onMouseEnter={(e) => {
                if (idx !== 0) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                if (idx !== 0) e.currentTarget.style.backgroundColor = 'transparent';
              }}
              style={{
                padding: '0.5rem 1rem',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                backgroundColor: idx === 0 ? '#FF9800' : 'transparent',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: idx === 0 ? 600 : 500,
                fontSize: '0.9375rem'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '1.25rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', fontWeight: 500 }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>VI</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>KH</span>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        position: 'relative',
        height: '460px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/temple-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1,
          filter: 'brightness(1.02) contrast(1.05)'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(107,44,44,0.4) 100%)'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '880px',
          padding: '0 2rem',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: '2.625rem',
            fontWeight: 800,
            color: '#FFD700',
            textShadow: '0 0 35px rgba(255,215,0,0.65), 0 0 18px rgba(255,215,0,0.45), 2px 2px 5px rgba(0,0,0,0.85)',
            marginBottom: '1.125rem',
            letterSpacing: '0.075em',
            lineHeight: 1.4,
            fontFamily: '"Noto Serif Khmer", Georgia, serif'
          }}>
            {settings.site_name_vi.toUpperCase()}
          </h1>

          <p style={{
            fontSize: '0.9375rem',
            color: 'white',
            marginBottom: '1.625rem',
            textShadow: '1px 1px 3px rgba(0,0,0,0.75)',
            fontWeight: 500,
            opacity: 0.95,
            letterSpacing: '0.015em'
          }}>
            {settings.site_slogan_vi}
          </p>

          <Link to={ROUTES.ADMISSIONS} style={{ textDecoration: 'none' }}>
            <button
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(255,152,0,0.65)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 5px 18px rgba(255,152,0,0.5)';
              }}
              style={{
                backgroundColor: '#FF9800',
                color: 'white',
                padding: '0.8125rem 2.125rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                border: 'none',
                borderRadius: '7px',
                cursor: 'pointer',
                boxShadow: '0 5px 18px rgba(255,152,0,0.5)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'uppercase'
              }}
            >
              THAM QUAN
            </button>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <div style={{
        marginTop: '-95px',
        position: 'relative',
        zIndex: 50,
        padding: '0 2rem'
      }}>
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.875rem'
        }}>
          {[
            { num: settings.founded_year || '2006', label: 'Năm thành lập' },
            { num: settings.student_count || '150+', label: 'Tăng tín đồ' },
            { num: settings.course_count || '30+', label: 'Khóa học' }
          ].map((stat, idx) => (
            <Link
              to={ROUTES.ABOUT}
              key={stat.num}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(212,175,55,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(212,175,55,0.22)';
              }}
              style={{
                background: 'linear-gradient(135deg, #FFFBF5 0%, #FFF3E0 100%)',
                border: '2.5px solid #D4AF37',
                borderRadius: '22px',
                padding: '2.25rem 1.375rem',
                textAlign: 'center',
                boxShadow: '0 10px 28px rgba(212,175,55,0.22)',
                minHeight: '172px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                animation: `fadeInUp ${0.6 + idx * 0.15}s ease-out`,
                textDecoration: 'none'
              }}
            >
              <div style={{
                fontSize: '3.125rem',
                fontWeight: 900,
                color: '#FF9800',
                marginBottom: '0.5rem',
                fontFamily: '"Noto Serif Khmer", Georgia, serif',
                textShadow: '1px 1px 2px rgba(255,152,0,0.2)'
              }}>
                {stat.num}
              </div>
              <div style={{
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: '#5D4037',
                letterSpacing: '0.015em'
              }}>
                {stat.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* NEWS */}
      <section style={{
        padding: '4.5rem 2rem 5rem',
        backgroundColor: '#FFF8ED'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#6B2C2C',
          marginBottom: '2.75rem',
          fontFamily: '"Noto Serif Khmer", Georgia, serif',
          letterSpacing: '0.02em'
        }}>
          TIN TỨC HỌC VIỆN
        </h2>

        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.875rem'
        }}>
          {newsLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{
                backgroundColor: 'white',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '2px solid #E0D4B8',
                animation: 'fadeInUp 0.6s ease-out'
              }}>
                <div style={{ height: '192px', backgroundColor: '#f5f5f5' }} />
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ height: '14px', backgroundColor: '#e8e8e8', marginBottom: '0.625rem', borderRadius: '4px', width: '35%' }} />
                  <div style={{ height: '16px', backgroundColor: '#e8e8e8', marginBottom: '0.5rem', borderRadius: '4px' }} />
                  <div style={{ height: '16px', backgroundColor: '#e8e8e8', borderRadius: '4px', width: '70%' }} />
                </div>
              </div>
            ))
          ) : (
            news.map((item, idx) => (
              <article
                key={item.id}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.14)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '2px solid #E9DCC4',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInUp ${0.7 + idx * 0.15}s ease-out`
                }}
              >
                <div style={{ height: '192px', overflow: 'hidden' }}>
                  <img
                    src={item.thumbnail_url || `/images/news_placeholder_${(idx % 3) + 1}.png`}
                    alt={item.title_vi}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/images/news_placeholder_${(idx % 3) + 1}.png`;
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#999', marginBottom: '0.5rem', fontWeight: 500 }}>
                    {new Date(item.published_at).toLocaleDateString('vi-VN')}
                  </div>
                  <h3 style={{
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: '#2C1810',
                    marginBottom: '0.5rem',
                    minHeight: '3rem',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.5
                  }}>
                    {item.title_vi}
                  </h3>
                  <p style={{
                    fontSize: '0.8125rem',
                    color: '#666',
                    marginBottom: '1rem',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.6
                  }}>
                    {item.excerpt_vi}
                  </p>
                  <Link
                    to={`${ROUTES.NEWS}/${item.slug}`}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    style={{
                      color: '#FF9800',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Xem thêm →
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: 'linear-gradient(90deg, #6B2C2C 0%, #3E2723 50%, #6B2C2C 100%)',
        color: 'white',
        padding: '3.75rem 2rem 1.875rem',
        minHeight: '300px'
      }}>
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'white',
              marginBottom: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <img src="/logo-hvpgntk.png" alt={settings.site_name_vi} style={{ width: '100%', height: '100%' }} />
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4 }}>
              {settings.site_name_vi.toUpperCase()}
            </h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.7, opacity: 0.9 }}>
              {settings.contact_address}
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '0.9375rem' }}>Trang chủ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              {[
                { label: 'Giới thiệu', path: ROUTES.ABOUT },
                { label: 'Đào tạo', path: ROUTES.EDUCATION },
                { label: 'Tin tức', path: ROUTES.NEWS },
                { label: 'Tuyển sinh', path: ROUTES.ADMISSIONS }
              ].map(link => (
                <Link
                  key={link.label}
                  to={link.path}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFE499'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '0.9375rem' }}>Liên hệ</h4>
            <div style={{ fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.9 }}>
              <div>📞 {settings.contact_phone}</div>
              <div>✉️ {settings.contact_email}</div>
              <div>�️ {settings.contact_address}</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '0.9375rem' }}>Theo dõi</h4>
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {[
                { label: 'F', url: settings.facebook_url },
                { label: 'Y', url: settings.youtube_url }
              ].map(social => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: 'white',
                    textDecoration: 'none'
                  }}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.375rem',
          textAlign: 'center',
          fontSize: '0.8125rem',
          opacity: 0.7
        }}>
          © 2026 {settings.site_name_vi}. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
