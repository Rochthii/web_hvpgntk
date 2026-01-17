import React, { useEffect, useState } from 'react';
import { Calendar, Users, ClipboardList, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
// import { academicApi } from '../../api/academic'; // To be implemented

export const TeacherDashboard: React.FC = () => {
    // Mock Data
    const stats = [
        { label: 'Lớp đang dạy', value: '4', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
        { label: 'Tổng sinh viên', value: '128', icon: Users, color: 'bg-indigo-100 text-indigo-600' },
        { label: 'Cần nhập điểm', value: '2', icon: ClipboardList, color: 'bg-red-100 text-red-600' },
    ];

    const todayClasses = [
        { time: '07:30 - 09:00', code: 'PALI101', name: 'Tiếng Pali Cơ Bản 1', room: 'A201' },
        { time: '09:30 - 11:00', code: 'VINAYA101', name: 'Luật học Đại cương', room: 'B102' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Tổng quan Giáo Thọ</h2>

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Teaching Schedule */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                        <Calendar className="mr-2 text-primary" size={20} />
                        Lịch dạy hôm nay
                    </h3>
                    <div className="space-y-4">
                        {todayClasses.length > 0 ? todayClasses.map((cls, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                                <div>
                                    <h4 className="font-bold text-gray-800">{cls.name}</h4>
                                    <p className="text-sm text-gray-500">{cls.code} • Phòng {cls.room}</p>
                                </div>
                                <div className="mt-2 sm:mt-0 font-mono font-bold text-primary bg-white px-3 py-1 rounded border border-gray-200">
                                    {cls.time}
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 italic text-center py-4">Hôm nay không có lịch dạy.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Tác vụ</h3>
                    <div className="space-y-3">
                        <Link
                            to={ROUTES.PORTAL.TEACHER_GRADES}
                            className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-red-800">Nhập điểm thi</span>
                                <ClipboardList size={18} className="text-red-600" />
                            </div>
                            <p className="text-xs text-red-600">Còn 2 lớp chưa nhập điểm giữa kỳ</p>
                        </Link>

                        <Link
                            to={ROUTES.PORTAL.TEACHER_CLASSES}
                            className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-blue-800">Danh sách lớp</span>
                                <BookOpen size={18} className="text-blue-600" />
                            </div>
                            <p className="text-xs text-blue-600">Xem danh sách sinh viên & điểm danh</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
