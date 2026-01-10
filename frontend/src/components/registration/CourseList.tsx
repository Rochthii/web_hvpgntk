import React, { useState } from 'react';
import { RegistrationClass } from '../../types/registration';
import { Search, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CourseListProps {
    classes: RegistrationClass[];
    onEnroll: (classId: number) => void;
    onUnenroll: (classId: number) => void;
    loadingClassId: number | null;
}

export const CourseList: React.FC<CourseListProps> = ({ classes, onEnroll, onUnenroll, loadingClassId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'available' | 'enrolled'>('all');

    const filteredClasses = classes.filter(cls => {
        const matchesSearch =
            cls.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.course_code.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'enrolled') return matchesSearch && cls.is_enrolled;
        if (filter === 'available') return matchesSearch && !cls.is_full && !cls.is_enrolled;
        return matchesSearch;
    });

    const getScheduleString = (schedule: any) => {
        if (!schedule) return 'Chưa có lịch';
        // Mock parsing logic, can look like "T2 (7:00-9:00), T4 (7:00-9:00)"
        if (Array.isArray(schedule)) {
            return schedule.map(s => `Thứ ${s.day} (${s.start}-${s.end})`).join(', ');
        }
        return `Thứ ${schedule.day} (${schedule.start}-${schedule.end})`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm môn học, mã môn..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => setFilter('available')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'available' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Còn chỗ
                    </button>
                    <button
                        onClick={() => setFilter('enrolled')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'enrolled' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Đã đăng ký
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
                {filteredClasses.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Không tìm thấy môn học nào.
                    </div>
                ) : (
                    filteredClasses.map(cls => (
                        <div key={cls.id} className={cn("p-4 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between gap-4", cls.is_enrolled && "bg-blue-50/50")}>
                            <div className="flex-1">
                                <div className="flex items-center mb-1">
                                    <span className="font-bold text-gray-800 text-lg mr-2">{cls.course_name}</span>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">{cls.course_code}</span>
                                    {cls.is_enrolled && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center"><CheckCircle size={12} className="mr-1" /> Đã đăng ký</span>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                                    <p>👨‍🏫 GV: {cls.instructor}</p>
                                    <p>📅 Lịch: {getScheduleString(cls.schedule)}</p>
                                    <p>🏫 Phòng: {cls.room}</p>
                                    <p>⚡ Tín chỉ: <span className="font-bold">{cls.credits}</span></p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-center min-w-[140px]">
                                <div className="mb-2 text-sm">
                                    <span className={cn("font-bold", cls.is_full ? "text-red-500" : "text-green-600")}>
                                        {cls.current_students}/{cls.max_students}
                                    </span>
                                    <span className="text-gray-400 text-xs ml-1">đã đăng ký</span>
                                </div>

                                {cls.is_enrolled ? (
                                    <button
                                        onClick={() => onUnenroll(cls.id)}
                                        disabled={loadingClassId === cls.id}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                                    >
                                        {loadingClassId === cls.id ? 'Loading...' : (
                                            <>
                                                <XCircle size={16} className="mr-2" /> Hủy ĐK
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onEnroll(cls.id)}
                                        disabled={cls.is_full || loadingClassId === cls.id}
                                        className={cn(
                                            "w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                            cls.is_full
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-secondary text-white hover:bg-secondary-accent shadow-sm"
                                        )}
                                    >
                                        {loadingClassId === cls.id ? 'Loading...' : (cls.is_full ? 'Hết chỗ' : 'Đăng ký')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
