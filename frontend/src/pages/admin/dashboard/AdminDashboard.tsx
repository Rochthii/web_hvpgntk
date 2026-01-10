
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, CheckCircle, Clock, Settings } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
        <div className={`p-4 rounded-full ${color} mr-4`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

import { cmsApi } from '../../../api/cms';
// ... existing imports ...

import { usePermissions } from '../../../hooks/usePermissions';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { can, isAdmin } = usePermissions();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await cmsApi.getDashboardStats();
                setStats(res.data);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng Quan Hệ Thống</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Tổng Sinh Viên"
                    value={stats?.total_students || 0}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Đơn Chờ Duyệt"
                    value={stats?.pending_requests || 0}
                    icon={Clock}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Đơn Đã Xử Lý"
                    value={stats?.processed_requests || 0}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
                <StatCard
                    title="Bài Viết CMS"
                    value={stats?.total_news || 0}
                    icon={FileText}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Hoạt Động Gần Đây</h3>
                    <div className="space-y-4">
                        {stats?.recent_activities?.map((act: any) => (
                            <div key={act.id} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                                <div>
                                    <p className="text-sm text-gray-800 font-medium">{act.text}</p>
                                    <p className="text-xs text-gray-400">{new Date(act.time).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                        ))}
                        {(!stats?.recent_activities || stats.recent_activities.length === 0) && (
                            <p className="text-sm text-gray-400 text-center py-4">Chưa có hoạt động nào.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                    <h3 className="font-bold text-lg mb-4">Thao Tác Nhanh</h3>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        {can('edit', 'cms') && (
                            <Link
                                to="/admin/news/create"
                                className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors cursor-pointer"
                            >
                                <FileText size={24} className="text-amber-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Viết Tin Mới</span>
                            </Link>
                        )}

                        {can('approve', 'petitions') && (
                            <Link
                                to="/admin/approvals"
                                className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                                <CheckCircle size={24} className="text-blue-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Duyệt Đơn</span>
                            </Link>
                        )}

                        {isAdmin && (
                            <Link
                                to="/admin/staff/create"
                                className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer"
                            >
                                <Users size={24} className="text-green-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Thêm Nhân Sự</span>
                            </Link>
                        )}

                        {isAdmin && (
                            <Link
                                to="/admin/settings"
                                className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer"
                            >
                                <Settings size={24} className="text-purple-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Cấu Hình</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
