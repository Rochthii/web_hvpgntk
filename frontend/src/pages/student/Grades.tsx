import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { academicApi } from '../../api/academic';
import { GradeTable } from '../../components/grades/GradeTable';
import { GPAChart } from '../../components/grades/GPAChart';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { ArrowLeft, Printer } from 'lucide-react';
import { showToast } from '../../lib/toast';

const Grades: React.FC = () => {
    const { user } = useAuth();
    const [gradesData, setGradesData] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gradesRes, statsRes] = await Promise.all([
                    academicApi.getMyGrades(),
                    academicApi.getStudentStats()
                ]);
                setGradesData(gradesRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error('Failed to fetch grades:', error);
                showToast.error('Không thể tải bảng điểm');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header (Hidden on Print) */}
            <div className="bg-white shadow-sm border-b border-gray-200 print:hidden">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to={ROUTES.STUDENT_PORTAL} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-serif font-bold text-secondary">Kết Quả Học Tập</h1>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700"
                    >
                        <Printer size={16} />
                        <span className="hidden sm:inline">In Bảng Điểm</span>
                    </button>
                </div>
            </div>

            {/* Print Header (Visible ONLY on Print) */}
            <div className="hidden print:block mb-8 text-center pt-8">
                <h2 className="text-xl font-bold uppercase mb-1">HỌC VIỆN PHẬT GIÁO NAM TÔNG KHMER</h2>
                <p className="text-sm text-gray-500 mb-6">Ô Môn, Cần Thơ, Việt Nam</p>

                <h1 className="text-2xl font-bold uppercase text-secondary mb-6 decoration-double underline decoration-gray-300 underline-offset-4">BẢNG KẾT QUẢ HỌC TẬP</h1>

                <div className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto text-sm border p-4 rounded-lg">
                    <div>
                        <p><span className="text-gray-500">Họ và tên:</span> <span className="font-bold">{user?.display_name}</span></p>
                        <p><span className="text-gray-500">Mã sinh viên:</span> <span className="font-bold">{user?.monk_profile?.student_code || user?.layperson_profile?.student_code}</span></p>
                    </div>
                    <div>
                        <p><span className="text-gray-500">Hệ đào tạo:</span> <span>Cử nhân Phật học</span></p>
                        <p><span className="text-gray-500">Ngày in:</span> <span>{new Date().toLocaleDateString('vi-VN')}</span></p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Charts & Summary */}
                <GPAChart
                    currentGPA={stats?.gpa || 0}
                    totalCredits={stats?.earned_credits || 0}
                />

                {/* Grade Tables by Semester */}
                <div className="space-y-8">
                    {gradesData.length > 0 ? (
                        gradesData.map((semesterData, idx) => (
                            <GradeTable key={idx} data={semesterData} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">Chưa có dữ liệu điểm số nào.</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>* Điểm số hiển thị là kết quả chính thức từ phòng đào tạo.</p>
                    <p>Nếu có thắc mắc, vui lòng liên hệ phòng giáo vụ.</p>
                </div>
            </div>
        </div>
    );
};

export default Grades;
