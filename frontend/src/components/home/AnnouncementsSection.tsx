import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import { NewsItem } from '../../api/cms';

interface AnnouncementsSectionProps {
    announcements: NewsItem[];
    loading?: boolean;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ announcements, loading }) => {
    if (loading) {
        return (
            <section className="bg-gradient-to-r from-[#FFF8E1] to-[#FFF3E0] py-6">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-3">
                            <div className="h-4 bg-[#DAA520]/30 rounded w-3/4"></div>
                            <div className="h-4 bg-[#DAA520]/30 rounded"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!announcements || announcements.length === 0) {
        return null; // Don't show section if no announcements
    }

    return (
        <section className="bg-gradient-to-r from-[#FFF8E1] to-[#FFF3E0] py-6 border-y-2 border-[#DAA520]/30">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#DAA520] p-2 rounded-full">
                        <Bell className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-[#6B2C2C]">
                        📢 Thông Báo Quan Trọng
                    </h2>
                </div>

                <div className="space-y-3">
                    {announcements.slice(0, 3).map((item) => (
                        <Link
                            key={item.id}
                            to={`/tin-tuc/${item.slug}`}
                            className="block group"
                        >
                            <div className="bg-white p-4 rounded-lg border-l-4 border-[#DAA520] hover:border-[#8B4513] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-2">
                                            URGENT
                                        </span>
                                        <h3 className="font-bold text-[#8B4513] group-hover:text-[#6B2C2C] transition-colors">
                                            {item.title_vi}
                                        </h3>
                                        {item.excerpt_vi && (
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {item.excerpt_vi}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(item.published_at || item.created_at).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#DAA520] group-hover:translate-x-1 transition-transform flex-shrink-0 ml-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {announcements.length > 3 && (
                    <div className="text-center mt-4">
                        <Link
                            to="/tin-tuc?category=announcement"
                            className="text-[#8B4513] hover:text-[#6B2C2C] font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                        >
                            Xem tất cả thông báo
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};
