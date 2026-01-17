import React from 'react';
import { FileText, PlusCircle, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

export const ContentDashboard: React.FC = () => {
    // Mock Data - In real app, fetch from API
    const stats = [
        { label: 'Tin đã đăng', value: '24', icon: FileText, color: 'bg-blue-100 text-blue-600' },
        { label: 'Chờ duyệt', value: '2', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
        { label: 'Lượt xem tuần này', value: '1.2k', icon: Eye, color: 'bg-green-100 text-green-600' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Tổng quan Biên Tập</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Tác vụ nhanh</h3>
                    <div className="space-y-3">
                        <Link
                            to={ROUTES.PORTAL.CONTENT_NEWS_CREATE}
                            className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-amber-800 font-medium"
                        >
                            <PlusCircle size={20} />
                            <span>Viết bài mới</span>
                        </Link>
                        <Link
                            to={ROUTES.PORTAL.CONTENT_NEWS}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                        >
                            <FileText size={20} />
                            <span>Quản lý tin tức</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity (Placeholder) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Hoạt động gần đây</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start space-x-3 text-sm">
                                <div className="w-2 h-2 mt-1.5 bg-gray-300 rounded-full"></div>
                                <div>
                                    <p className="text-gray-800">Bạn đã cập nhật bài viết <span className="font-medium">"Lễ khai giảng năm học 2024"</span></p>
                                    <span className="text-xs text-gray-400">2 giờ trước</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
