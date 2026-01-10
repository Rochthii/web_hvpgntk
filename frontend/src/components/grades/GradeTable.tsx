import React from 'react';

interface GradeItem {
    course_code: string;
    course_name: string;
    credits: number;
    midterm: number | null;
    final: number | null;
    total: number | null; // GPA points (4.0 scale)
    letter: string | null;
    status: string;
}

interface SemesterGrades {
    semester_info: {
        term: string;
        year: string;
        is_current: boolean;
    };
    grades: GradeItem[];
}

interface GradeTableProps {
    data: SemesterGrades;
}

const getGradeColor = (letter: string | null) => {
    if (!letter) return 'text-gray-400';
    if (letter.startsWith('A')) return 'text-green-600 font-bold';
    if (letter.startsWith('B')) return 'text-blue-600 font-bold';
    if (letter.startsWith('C')) return 'text-orange-600';
    if (letter.startsWith('D')) return 'text-red-500';
    return 'text-red-700';
};

export const GradeTable: React.FC<GradeTableProps> = ({ data }) => {
    const totalCredits = data.grades.reduce((sum, g) => sum + g.credits, 0);

    // Calculate Semester GPA (Simple weighted average of GPA points)
    let totalPoints = 0;
    let gradedCredits = 0;

    data.grades.forEach(g => {
        if (g.total !== null) {
            totalPoints += g.total * g.credits;
            gradedCredits += g.credits;
        }
    });

    const semesterGPA = gradedCredits > 0 ? (totalPoints / gradedCredits).toFixed(2) : '--';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-secondary text-lg">
                        {data.semester_info.year} - {data.semester_info.term}
                        {data.semester_info.is_current && <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Hiện tại</span>}
                    </h3>
                </div>
                <div className="text-right">
                    <span className="text-sm text-gray-500 mr-4">Số tín chỉ: <strong className="text-gray-800">{totalCredits}</strong></span>
                    <span className="text-sm text-gray-500">GPA HK: <strong className="text-primary text-lg">{semesterGPA}</strong></span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 w-1/12">Mã HP</th>
                            <th className="px-6 py-3 w-4/12">Tên Học Phần</th>
                            <th className="px-6 py-3 w-1/12 text-center">TC</th>
                            <th className="px-6 py-3 w-1/12 text-center">Giữa kỳ</th>
                            <th className="px-6 py-3 w-1/12 text-center">Cuối kỳ</th>
                            <th className="px-6 py-3 w-1/12 text-center">Điểm số</th>
                            <th className="px-6 py-3 w-1/12 text-center">Xếp loại</th>
                            <th className="px-6 py-3 w-2/12 text-right">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.grades.map((grade, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-700">{grade.course_code}</td>
                                <td className="px-6 py-4 font-medium text-secondary">{grade.course_name}</td>
                                <td className="px-6 py-4 text-center">{grade.credits}</td>
                                <td className="px-6 py-4 text-center text-gray-600">{grade.midterm ?? '-'}</td>
                                <td className="px-6 py-4 text-center text-gray-600">{grade.final ?? '-'}</td>
                                <td className="px-6 py-4 text-center font-bold">{grade.total ?? '-'}</td>
                                <td className={`px-6 py-4 text-center ${getGradeColor(grade.letter)}`}>{grade.letter ?? '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`text-xs px-2 py-1 rounded-full ${grade.status === 'Hoàn thành' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {grade.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {data.grades.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-400 italic">
                                    Chưa có môn học nào trong học kỳ này
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
