
import React from 'react';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

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

export const AdminDashboard: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng Quan Hệ Thống</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Tổng Sinh Viên"
                    value="452"
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Đơn Chờ Duyệt"
                    value="12"
                    icon={Clock}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Đơn Đã Xử Lý"
                    value="1,284"
                    icon={CheckCircle}
                    color="bg-green-500"
                />
                <StatCard
                    title="Bài Viết Mới"
                    value="3"
                    icon={FileText}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Hoạt Động Gần Đây</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                                <div>
                                    <p className="text-sm text-gray-800 font-medium">Nguyễn Văn A vừa gửi đơn xin nghỉ học</p>
                                    <p className="text-xs text-gray-400">2 phút trước</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Thống Kê Đăng Ký</h3>
                    <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                        Chart Mockup Area
                    </div>
                </div>
            </div>
        </div>
    );
};
