import React, { useEffect, useState } from 'react';
import { Search, Users, Filter, Download } from 'lucide-react';

interface Student {
    id: number;
    student_code: string;
    display_name: string;
    cohort: string;
    status: string;
    email: string;
    phone?: string;
}

export const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cohortFilter, setCohortFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, cohortFilter, statusFilter, students]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            // Mock data - in real implementation: await academicApi.getStudents()
            const mockData: Student[] = [
                { id: 1, student_code: 'TS2024001', display_name: 'Thích Tâm An', cohort: 'K2024', status: 'active', email: 'taman@hvpgntk.edu.vn' },
                { id: 2, student_code: 'TS2024002', display_name: 'Thích Minh Đức', cohort: 'K2024', status: 'active', email: 'minhduc@hvpgntk.edu.vn' },
                { id: 3, student_code: 'TS2023015', display_name: 'Thích Bảo Quang', cohort: 'K2023', status: 'active', email: 'baoquang@hvpgntk.edu.vn' },
                { id: 4, student_code: 'TS2023008', display_name: 'Thích Thiện Tâm', cohort: 'K2023', status: 'leave', email: 'thientam@hvpgntk.edu.vn' },
                { id: 5, student_code: 'TS2022025', display_name: 'Thích Huệ Minh', cohort: 'K2022', status: 'graduated', email: 'hueminh@hvpgntk.edu.vn' },
            ];
            setStudents(mockData);
            setFilteredStudents(mockData);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...students];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(s =>
                s.display_name.toLowerCase().includes(term) ||
                s.student_code.toLowerCase().includes(term) ||
                s.email.toLowerCase().includes(term)
            );
        }

        // Cohort filter
        if (cohortFilter !== 'all') {
            filtered = filtered.filter(s => s.cohort === cohortFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => s.status === statusFilter);
        }

        setFilteredStudents(filtered);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: 'bg-green-100 text-green-700',
            leave: 'bg-yellow-100 text-yellow-700',
            graduated: 'bg-blue-100 text-blue-700',
            suspended: 'bg-red-100 text-red-700',
        };
        const labels: Record<string, string> = {
            active: 'Đang học',
            leave: 'Bảo lưu',
            graduated: 'Đã tốt nghiệp',
            suspended: 'Đình chỉ',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const handleExport = () => {
        // In real implementation: export to Excel
        alert('Tính năng xuất Excel sẽ được triển khai sau');
    };

    if (loading) {
        return <div className="text-center py-10">Đang tải danh sách sinh viên...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Danh sách Sinh viên</h2>
                    <p className="text-gray-500 text-sm">{filteredStudents.length} / {students.length} sinh viên</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Download size={18} />
                    <span>Xuất Excel</span>
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, mã SV, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Cohort Filter */}
                <div>
                    <select
                        value={cohortFilter}
                        onChange={(e) => setCohortFilter(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả khóa</option>
                        <option value="K2024">Khóa 2024</option>
                        <option value="K2023">Khóa 2023</option>
                        <option value="K2022">Khóa 2022</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang học</option>
                        <option value="leave">Bảo lưu</option>
                        <option value="graduated">Đã tốt nghiệp</option>
                        <option value="suspended">Đình chỉ</option>
                    </select>
                </div>
            </div>

            {/* Student Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <div key={student.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {student.display_name.charAt(student.display_name.lastIndexOf(' ') + 1)}
                                </div>
                                {getStatusBadge(student.status)}
                            </div>

                            <h3 className="font-bold text-gray-900 text-lg mb-1">{student.display_name}</h3>
                            <p className="text-gray-500 text-sm mb-4">{student.student_code} • {student.cohort}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <span className="w-16 font-medium">Email:</span>
                                    <span className="text-gray-500 truncate">{student.email}</span>
                                </div>
                                {student.phone && (
                                    <div className="flex items-center text-gray-600">
                                        <span className="w-16 font-medium">SĐT:</span>
                                        <span className="text-gray-500">{student.phone}</span>
                                    </div>
                                )}
                            </div>

                            <button className="mt-4 w-full py-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors text-sm font-medium">
                                Xem hồ sơ
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Users size={48} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">Không tìm thấy sinh viên nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};
