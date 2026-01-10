
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { academicApi } from '../../api/academic';
import { CourseList } from '../../components/registration/CourseList';
import { RegistrationClass } from '../../types/registration';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { showToast } from '../../lib/toast';

const CourseRegistration: React.FC = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState<RegistrationClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingClassId, setLoadingClassId] = useState<number | null>(null);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await academicApi.getAvailableClasses();
            setClasses(response.data);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
            showToast.error('Không thể tải danh sách môn học');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleEnroll = async (classId: number) => {
        setLoadingClassId(classId);
        try {
            await academicApi.enrollClass(classId);
            showToast.success('Đăng ký thành công!');
            // Refresh data to update counts and status
            const response = await academicApi.getAvailableClasses();
            setClasses(response.data);
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || 'Đăng ký thất bại';
            showToast.error(msg);
        } finally {
            setLoadingClassId(null);
        }
    };

    const handleUnenroll = async (classId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy học phần này?')) return;

        setLoadingClassId(classId);
        try {
            await academicApi.unenrollClass(classId);
            showToast.success('Hủy đăng ký thành công');
            // Refresh
            const response = await academicApi.getAvailableClasses();
            setClasses(response.data);
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || 'Hủy thất bại';
            showToast.error(msg);
        } finally {
            setLoadingClassId(null);
        }
    };

    // Calculate stats
    const totalCredits = classes
        .filter(c => c.is_enrolled)
        .reduce((sum, c) => sum + c.credits, 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to={ROUTES.STUDENT_PORTAL} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-serif font-bold text-secondary">Đăng Ký Môn Học</h1>
                    </div>

                    <div className="flex items-center space-x-3 text-sm">
                        <span className="text-gray-500">Đã chọn: <strong className="text-secondary text-lg">{totalCredits}</strong> TC</span>
                        <button
                            onClick={fetchClasses}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                            title="Làm mới"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
                    <InfoIcon className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                    <div className="text-sm text-blue-800">
                        <p className="font-bold mb-1">Lưu ý đăng ký:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Số tín chỉ tối thiểu mỗi học kỳ: 12. Tối đa: 25.</li>
                            <li>Vui lòng kiểm tra kỹ lịch học để tránh trùng lịch.</li>
                            <li>Sau khi đăng ký xong, hãy kiểm tra lại tại trang "Lịch học".</li>
                        </ul>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3">
                            <CourseList
                                classes={classes}
                                onEnroll={handleEnroll}
                                onUnenroll={handleUnenroll}
                                loadingClassId={loadingClassId}
                            />
                        </div>
                        {/* Future: Add Calendar Preview Sidebar here */}
                    </div>
                )}
            </div>
        </div>
    );
};

const InfoIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export default CourseRegistration;
