import React from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../api/cms';
import { ROUTES } from '../../router/routes';
import { Calendar, ArrowRight } from 'lucide-react';

interface NewsGridProps {
    news: NewsItem[];
    loading: boolean;
    error?: boolean;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ news, loading, error }) => {
    if (loading) {
        return (
            <section className="py-20 px-4 bg-[#FDF5E6]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#6B2C2C] mb-4">
                            TIN TỨC HỌC VIỆN
                        </h2>
                        <div className="w-24 h-1 bg-[#DAA520] mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden border-2 border-[#E5CFA0] animate-pulse">
                                <div className="h-52 bg-gray-200" />
                                <div className="p-6">
                                    <div className="h-4 bg-gray-200 mb-3 rounded w-1/3" />
                                    <div className="h-5 bg-gray-200 mb-2 rounded" />
                                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || news.length === 0) {
        return (
            <section className="py-20 px-4 bg-[#FDF5E6]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#6B2C2C] mb-4">
                            TIN TỨC HỌC VIỆN
                        </h2>
                        <div className="w-24 h-1 bg-[#DAA520] mx-auto rounded-full"></div>
                    </div>
                    <div className="text-center text-[#8B4513] italic py-12 bg-white rounded-2xl border-2 border-[#E5CFA0]">
                        {error ? 'Đang cập nhật tin tức...' : 'Chưa có tin tức nào.'}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-4 bg-[#FDF5E6] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-[url('/images/pattern-ornate.svg')] opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#6B2C2C] mb-4 tracking-wide">
                        TIN TỨC HỌC VIỆN
                    </h2>
                    <div className="w-24 h-1 bg-[#DAA520] mx-auto rounded-full mb-4"></div>
                    <p className="text-[#8B4513] max-w-2xl mx-auto">
                        Cập nhật những hoạt động Phật sự, văn hóa và lễ hội mới nhất từ Học viện
                    </p>
                </div>

                {/* News Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, idx) => (
                        <article
                            key={item.id}
                            className="group bg-white rounded-2xl overflow-hidden border-2 border-[#E5CFA0] shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500"
                            style={{
                                animation: `fadeInUp ${0.5 + idx * 0.1}s ease-out`,
                            }}
                        >
                            {/* Image Container */}
                            <Link to={`${ROUTES.NEWS}/${item.slug}`} className="block relative h-56 overflow-hidden">
                                <img
                                    src={item.featured_image_url || item.thumbnail_url || `/images/news_placeholder_${(idx % 3) + 1}.png`}
                                    alt={item.title_vi}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `/images/news_placeholder_${(idx % 3) + 1}.png`;
                                    }}
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Category Badge */}
                                {item.category && (
                                    <span className="absolute top-4 left-4 bg-[#DAA520] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
                                        {item.category === 'academy_news' ? 'Tin Học viện' :
                                            item.category === 'khmer_festival' ? 'Lễ hội Khmer' :
                                                item.category === 'buddhist_news' ? 'Phật sự' :
                                                    item.category === 'announcement' ? 'Thông báo' : 'Tin tức'}
                                    </span>
                                )}
                            </Link>

                            {/* Content */}
                            <div className="p-6">
                                {/* Date */}
                                <div className="flex items-center gap-2 text-[#8B4513] text-sm mb-3">
                                    <Calendar size={14} className="text-[#DAA520]" />
                                    <span>{item.published_at ? new Date(item.published_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Mới cập nhật'}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-[#6B2C2C] mb-3 min-h-[3.5rem] line-clamp-2 leading-snug group-hover:text-[#DAA520] transition-colors">
                                    <Link to={`${ROUTES.NEWS}/${item.slug}`}>
                                        {item.title_vi}
                                    </Link>
                                </h3>

                                {/* Excerpt */}
                                <p className="text-sm text-[#8B4513]/80 mb-5 line-clamp-2 leading-relaxed">
                                    {item.excerpt_vi || 'Xem chi tiết bài viết...'}
                                </p>

                                {/* Read More Link */}
                                <Link
                                    to={`${ROUTES.NEWS}/${item.slug}`}
                                    className="inline-flex items-center gap-2 text-[#6B2C2C] text-sm font-bold uppercase tracking-wide hover:text-[#DAA520] transition-colors group/link"
                                >
                                    <span>Đọc thêm</span>
                                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-14">
                    <Link
                        to={ROUTES.NEWS}
                        className="inline-flex items-center gap-3 bg-[#6B2C2C] hover:bg-[#8B4513] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <span>Xem tất cả tin tức</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};
