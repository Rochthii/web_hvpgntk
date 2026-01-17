import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle, Settings, Download, Lock, Unlock } from 'lucide-react';
import { academicApi } from '../../api/academic';
import { GradeStructureConfig } from '../../components/portal/GradeStructureConfig';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../lib/permissions';

interface GradeComponent {
    id: string;
    name: string;
    weight: number;
}

interface Enrollment {
    id: number;
    student: {
        id: number;
        display_name: string;
        student_code: string;
    };
    scores: Record<string, number | undefined>;
    total_score?: number;
}

export const GradeEntry: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [className, setClassName] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [gradeStructure, setGradeStructure] = useState<GradeComponent[]>([
        { id: '1', name: 'Chuyên cần', weight: 20 },
        { id: '2', name: 'Giữa kỳ', weight: 30 },
        { id: '3', name: 'Cuối kỳ', weight: 50 },
    ]);
    const [showConfig, setShowConfig] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedChanges, setSavedChanges] = useState(false);

    const isAdmin = user?.role === Role.ADMIN || user?.role === Role.ABBOT;

    useEffect(() => {
        fetchEnrollments();
    }, [classId]);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const mockData: Enrollment[] = [
                { id: 1, student: { id: 1, display_name: 'Thích Tâm An', student_code: 'TS2024001' }, scores: { '1': 8, '2': 7.5, '3': 8.5 } },
                { id: 2, student: { id: 2, display_name: 'Thích Minh Đức', student_code: 'TS2024002' }, scores: { '1': 9, '2': 8.0, '3': 9.0 } },
                { id: 3, student: { id: 3, display_name: 'Thích Bảo Quang', student_code: 'TS2024003' }, scores: { '1': 7.5, '2': 6.5, '3': 7.0 } },
            ];
            setEnrollments(mockData.map(e => ({ ...e, total_score: calculateTotal(e.scores) })));
            setClassName('Tiếng Pali Cơ Bản 1');
            setIsLocked(false); // In real: fetch from API
        } catch (error) {
            console.error('Failed to fetch enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (scores: Record<string, number | undefined>): number | undefined => {
        let total = 0;
        let hasAll = true;

        for (const component of gradeStructure) {
            const score = scores[component.id];
            if (score === undefined) {
                hasAll = false;
                break;
            }
            total += score * (component.weight / 100);
        }

        return hasAll ? total : undefined;
    };

    const handleScoreChange = (enrollmentId: number, componentId: string, value: string) => {
        if (isLocked) {
            alert('Điểm đã bị khóa! Không thể chỉnh sửa.');
            return;
        }

        const numValue = value === '' ? undefined : parseFloat(value);

        if (numValue !== undefined && (numValue < 0 || numValue > 10)) {
            return;
        }

        setEnrollments(prev => prev.map(enrollment => {
            if (enrollment.id === enrollmentId) {
                const updated = {
                    ...enrollment,
                    scores: { ...enrollment.scores, [componentId]: numValue }
                };
                updated.total_score = calculateTotal(updated.scores);
                return updated;
            }
            return enrollment;
        }));
    };

    const handleSaveStructure = (newStructure: GradeComponent[]) => {
        setGradeStructure(newStructure);
        setShowConfig(false);
        setEnrollments(prev => prev.map(e => ({
            ...e,
            total_score: calculateTotal(e.scores)
        })));
        alert('Đã lưu cấu hình cơ cấu điểm!');
    };

    const handleSaveAll = async () => {
        if (isLocked) {
            alert('Điểm đã bị khóa! Không thể lưu.');
            return;
        }

        try {
            setSaving(true);
            // await academicApi.saveGrades(classId, enrollments);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSavedChanges(true);
            setTimeout(() => setSavedChanges(false), 3000);
        } catch (error) {
            console.error('Failed to save grades:', error);
            alert('Lỗi khi lưu điểm!');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleLock = async () => {
        if (!isAdmin) {
            alert('Chỉ Admin mới có quyền khóa/mở khóa điểm!');
            return;
        }

        const action = isLocked ? 'mở khóa' : 'khóa';
        if (!confirm(`Bạn có chắc muốn ${action} điểm lớp này?\n${isLocked ? 'Sau khi mở khóa, giáo viên có thể chỉnh sửa điểm.' : 'Sau khi khóa, không ai có thể sửa điểm (trừ Admin).'}`)) {
            return;
        }

        try {
            // await academicApi.toggleGradeLock(classId, !isLocked);
            setIsLocked(!isLocked);
            alert(`Đã ${action} điểm thành công!`);
        } catch (error) {
            alert(`Lỗi khi ${action} điểm!`);
        }
    };

    const handleExportExcel = () => {
        // Create CSV data
        let csv = `Bảng điểm: ${className}\n\n`;
        csv += 'STT,Mã SV,Họ tên,';
        csv += gradeStructure.map(c => `${c.name} (${c.weight}%)`).join(',');
        csv += ',Tổng kết\n';

        enrollments.forEach((e, i) => {
            csv += `${i + 1},${e.student.student_code},${e.student.display_name},`;
            csv += gradeStructure.map(c => e.scores[c.id] ?? '').join(',');
            csv += `,${e.total_score?.toFixed(2) ?? ''}\n`;
        });

        // Download
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `BangDiem_${className.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    if (loading) {
        return <div className="text-center py-10">Đang tải danh sách sinh viên...</div>;
    }

    if (showConfig) {
        return (
            <GradeStructureConfig
                classId={classId || ''}
                className={className}
                currentStructure={gradeStructure}
                onSave={handleSaveStructure}
                onCancel={() => setShowConfig(false)}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/portal/teacher/classes')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold text-gray-800">Nhập điểm</h2>
                            {isLocked && (
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold flex items-center space-x-1">
                                    <Lock size={14} />
                                    <span>Đã khóa</span>
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">{className} • {enrollments.length} sinh viên</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center space-x-2 px-4 py-2 border border-green-300 text-green-700 bg-green-50 rounded-lg hover:bg-green-100"
                    >
                        <Download size={18} />
                        <span>Xuất Excel</span>
                    </button>
                    {isAdmin && (
                        <button
                            onClick={handleToggleLock}
                            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg ${isLocked
                                    ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                                    : 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                                }`}
                        >
                            {isLocked ? <Unlock size={18} /> : <Lock size={18} />}
                            <span>{isLocked ? 'Mở khóa' : 'Khóa điểm'}</span>
                        </button>
                    )}
                    <button
                        onClick={() => setShowConfig(true)}
                        disabled={isLocked && !isAdmin}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        <Settings size={18} />
                        <span>Cấu hình</span>
                    </button>
                    <button
                        onClick={handleSaveAll}
                        disabled={saving || isLocked}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang lưu...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Lưu tất cả</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Success notification */}
            {savedChanges && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                    <CheckCircle size={20} />
                    <span>Đã lưu điểm thành công!</span>
                </div>
            )}

            {/* Lock Warning */}
            {isLocked && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-start space-x-2">
                        <Lock size={18} className="text-red-600 mt-0.5" />
                        <div className="text-sm text-red-800">
                            <p className="font-bold mb-1">Điểm đã bị khóa</p>
                            <p>Không thể chỉnh sửa điểm. {isAdmin ? 'Bạn có thể mở khóa bằng nút "Mở khóa" ở trên.' : 'Liên hệ Admin để mở khóa.'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Grading Info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">Cơ cấu điểm hiện tại</h3>
                <div className="flex flex-wrap gap-3 text-sm text-blue-800">
                    {gradeStructure.map(comp => (
                        <div key={comp.id}>
                            • <strong>{comp.name}</strong>: {comp.weight}%
                        </div>
                    ))}
                </div>
            </div>

            {/* Grade Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">STT</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Mã SV</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Họ tên</th>
                                {gradeStructure.map(component => (
                                    <th key={component.id} className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                                        {component.name}<br />({component.weight}%)
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase bg-amber-50">Tổng kết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {enrollments.map((enrollment, index) => (
                                <tr key={enrollment.id} className={`transition-colors ${isLocked ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-700">{enrollment.student.student_code}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{enrollment.student.display_name}</td>
                                    {gradeStructure.map(component => (
                                        <td key={component.id} className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                step="0.5"
                                                value={enrollment.scores[component.id] ?? ''}
                                                onChange={(e) => handleScoreChange(enrollment.id, component.id, e.target.value)}
                                                disabled={isLocked}
                                                className={`w-20 px-3 py-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 ${isLocked ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300'
                                                    }`}
                                                placeholder="0-10"
                                            />
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 bg-amber-50">
                                        <div className="w-20 mx-auto px-3 py-2 bg-white border-2 border-amber-300 rounded-lg text-center font-bold text-amber-800">
                                            {enrollment.total_score !== undefined ? enrollment.total_score.toFixed(2) : '--'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500">
                <p>Lưu ý: Điểm số từ 0-10, có thể nhập số thập phân (VD: 7.5, 8.25)</p>
            </div>
        </div>
    );
};
