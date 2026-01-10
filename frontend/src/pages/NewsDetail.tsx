import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronLeft, User } from 'lucide-react';
import { cmsApi, NewsItem } from '../api/cms';
import { ROUTES } from '../router/routes';

const NewsDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            if (!slug) return;
            try {
                const response = await cmsApi.getNewsBySlug(slug);
                setNews(response.data);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Không tìm thấy bài viết hoặc đã xảy ra lỗi.');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF8ED]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8ED] text-center p-4">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
                <p className="text-gray-600 mb-6">{error || 'Bài viết không tồn tại'}</p>
                <Link to={ROUTES.NEWS} className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
                    Quay lại Tin tức
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF8ED] pb-20 pt-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Breadcrumb */}
                <Link to={ROUTES.NEWS} className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-6 font-medium transition-colors">
                    <ChevronLeft size={20} className="mr-1" /> Quay lại Tin tức
                </Link>

                {/* Article Header */}
                <header className="mb-10">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(news.published_at).toLocaleDateString('vi-VN')}</span>
                        <span className="flex items-center"><User size={14} className="mr-1" /> Ban Biên Tập</span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-semibold">{news.category}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#6B2C2C] leading-tight mb-6">
                        {news.title_vi}
                    </h1>
                    <p className="text-xl text-gray-700 font-serif italic border-l-4 border-amber-400 pl-4 py-2">
                        {news.excerpt_vi}
                    </p>
                </header>

                {/* Featured Image */}
                {(news.featured_image_url || news.thumbnail_url) && (
                    <div className="rounded-xl overflow-hidden shadow-lg mb-12">
                        <img src={news.featured_image_url || news.thumbnail_url} alt={news.title_vi} className="w-full h-auto object-cover max-h-[600px]" />
                    </div>
                )}

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-8 md:p-12 mb-12">
                    <div
                        className="prose prose-amber max-w-none prose-lg font-serif text-gray-800"
                        dangerouslySetInnerHTML={{ __html: news.content_vi }}
                    />
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
