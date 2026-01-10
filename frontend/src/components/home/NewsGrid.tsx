import React from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../api/cms';
import { ROUTES } from '../../router/routes';

interface NewsGridProps {
    news: NewsItem[];
    loading: boolean;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ news, loading }) => {
    if (loading) {
        return (
            <section className="py-20 px-8 bg-cream">
                <h2 className="text-center text-[2rem] font-bold text-secondary mb-11 font-serif tracking-wide">
                    TIN TỨC HỌC VIỆN
                </h2>

                <div className="max-w-[1180px] mx-auto grid grid-cols-3 gap-[1.875rem]">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-[14px] overflow-hidden border-2 border-[#E0D4B8] animate-fade-in-up">
                            <div className="h-48 bg-gray-100" />
                            <div className="p-5">
                                <div className="h-[14px] bg-gray-200 mb-2.5 rounded w-[35%]" />
                                <div className="h-4 bg-gray-200 mb-2 rounded" />
                                <div className="h-4 bg-gray-200 rounded w-[70%]" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-8 bg-cream">
            <h2 className="text-center text-[2rem] font-bold text-secondary mb-11 font-serif tracking-wide">
                TIN TỨC HỌC VIỆN
            </h2>

            <div className="max-w-[1180px] mx-auto grid grid-cols-3 gap-[1.875rem]">
                {news.map((item, idx) => (
                    <article
                        key={item.id}
                        className="bg-white rounded-[14px] overflow-hidden border-2 border-[#E9DCC4] shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all duration-[350ms] cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{
                            animation: `fadeInUp ${0.7 + idx * 0.15}s ease-out`,
                        }}
                    >
                        <div className="h-48 overflow-hidden">
                            <img
                                src={item.thumbnail_url || `/images/news_placeholder_${(idx % 3) + 1}.png`}
                                alt={item.title_vi}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-400"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `/images/news_placeholder_${(idx % 3) + 1}.png`;
                                }}
                            />
                        </div>

                        <div className="p-5">
                            <div className="text-[0.6875rem] text-gray-400 mb-2 font-medium">
                                {new Date(item.published_at).toLocaleDateString('vi-VN')}
                            </div>

                            <h3 className="text-[1.0625rem] font-bold text-text-primary mb-2 min-h-[3rem] line-clamp-2 leading-normal">
                                {item.title_vi}
                            </h3>

                            <p className="text-[0.8125rem] text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {item.excerpt_vi}
                            </p>

                            <Link
                                to={`${ROUTES.NEWS}/${item.slug}`}
                                className="inline-block text-primary text-[0.75rem] font-semibold uppercase tracking-widest no-underline hover:text-primary-700 transition-colors"
                            >
                                ĐỌC THÊM →
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};
