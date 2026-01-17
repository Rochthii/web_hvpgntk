import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
// Mocking the API call for now as we might need a specific endpoint or filter
import { academicApi } from '../../api/academic';

export const MyClasses: React.FC = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real implementation, this would call an endpoint like /academic/my-teaching-classes/
        // For now, we simulate with a mock or existing list filtered logic
        // simulating delay
        setTimeout(() => {
            setClasses([
                { id: 1, name: 'Tiếng Pali Cơ Bản 1', code: 'PALI101', students: 32, schedule: 'T2, T4 (07:30 - 09:00)', room: 'A201', semester: 'HK1/2024' },
                { id: 2, name: 'Luật học Đại cương', code: 'VINAYA101', students: 45, schedule: 'T3, T5 (09:30 - 11:00)', room: 'B102', semester: 'HK1/2024' },
                { id: 3, name: 'Lịch sử Phật giáo Nam tông', code: 'HIST201', students: 28, schedule: 'T6 (13:30 - 16:30)', room: 'A301', semester: 'HK1/2024' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    if (loading) {
        return <div className="text-center py-10">Đang tải danh sách lớp...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Lớp Đang Dạy</h2>
                <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    Học kỳ 1 - 2024
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{cls.code}</span>
                                    <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-1" title={cls.name}>{cls.name}</h3>
                                </div>
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <BookOpen size={20} />
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Users size={16} className="mr-2 text-gray-400" />
                                    <span>{cls.students} sinh viên</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar size={16} className="mr-2 text-gray-400" />
                                    <span>{cls.schedule}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 mr-2 border border-gray-400 rounded flex items-center justify-center text-[10px]">📍</div>
                                    <span>Phòng {cls.room}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs text-gray-500 font-medium">Trạng thái: Đang học</span>
                            <Link
                                to={`${ROUTES.PORTAL.TEACHER_GRADES}/${cls.id}`}
                                className="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
                            >
                                Nhập điểm <ArrowRight size={16} className="ml-1" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
