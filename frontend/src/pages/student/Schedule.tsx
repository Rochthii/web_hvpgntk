import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { academicApi } from '../../api/academic';
import { WeeklyCalendar } from '../../components/schedule/WeeklyCalendar';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { ArrowLeft, Calendar as CalendarIcon, Download } from 'lucide-react';
import { showToast } from '../../lib/toast';

const Schedule: React.FC = () => {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await academicApi.getMySchedule();
                setSchedule(response.data);
            } catch (error) {
                console.error('Failed to fetch schedule:', error);
                showToast.error('Không thể tải thời khóa biểu');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to={ROUTES.STUDENT_PORTAL} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-serif font-bold text-secondary">Thời Khóa Biểu</h1>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                            <Download size={16} />
                            <span className="hidden sm:inline">Xuất PDF</span>
                        </button>
                        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                            HK1 / 2024-2025
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Student Info */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Sinh viên: <span className="font-bold text-gray-800">{user?.display_name}</span></p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon size={16} className="mr-2" />
                        <span>Tuần học hiện tại: <strong>Tuần 12</strong></span>
                    </div>
                </div>

                {/* Calendar */}
                <WeeklyCalendar schedule={schedule} isLoading={loading} />

                {/* List View for Mobile (Optional, hidden on desktop) */}
                <div className="mt-8 md:hidden">
                    <h3 className="font-bold mb-4">Danh sách môn học</h3>
                    <div className="space-y-4">
                        {schedule.map((slot, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-secondary">{slot.course_name}</h4>
                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Thứ {slot.day_of_week}</span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>🕒 {slot.start_time} - {slot.end_time}</p>
                                    <p>🏫 {slot.room}</p>
                                    <p>👨‍🏫 {slot.lecturer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
