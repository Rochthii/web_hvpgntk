import React from 'react';
import { BookOpen, Star } from 'lucide-react';

interface Subject {
    id: string;
    code: string;
    name: string;
    credits: number;
}

interface CurriculumTableProps {
    subjects: Subject[];
}

export const CurriculumTable: React.FC<CurriculumTableProps> = ({ subjects }) => {
    return (
        <div className="overflow-x-auto rounded-xl shadow-gold-sm border border-[#E5CFA0]/30 bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#6B2C2C] text-[#FFF8E1]">
                        <th className="py-4 px-6 font-heading text-sm uppercase tracking-wider w-16 text-center">STT</th>
                        <th className="py-4 px-6 font-heading text-sm uppercase tracking-wider w-32">Mã Môn</th>
                        <th className="py-4 px-6 font-heading text-sm uppercase tracking-wider">Tên Môn Học</th>
                        <th className="py-4 px-6 font-heading text-sm uppercase tracking-wider w-24 text-center">Tín Chỉ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E5CFA0]/30">
                    {subjects.map((subject, index) => (
                        <tr
                            key={subject.id}
                            className="hover:bg-[#FFFBF5] transition-colors duration-200 group"
                        >
                            <td className="py-4 px-6 text-center text-gray-500 font-mono text-sm">
                                {index + 1}
                            </td>
                            <td className="py-4 px-6 font-mono text-[#8B4513] font-bold text-sm">
                                {subject.code}
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#FFF8E1] rounded-full text-[#DAA520] group-hover:scale-110 transition-transform">
                                        <BookOpen size={16} />
                                    </div>
                                    <span className="font-medium text-[#2C1810] group-hover:text-[#8B4513] transition-colors">
                                        {subject.name}
                                    </span>
                                </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                                    <Star size={12} className="text-[#DAA520]" />
                                    {subject.credits}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-[#FFFBF5]">
                    <tr>
                        <td colSpan={3} className="py-4 px-6 text-right font-bold text-[#6B2C2C]">Tổng số tín chỉ năm này:</td>
                        <td className="py-4 px-6 text-center font-bold text-[#DAA520] text-lg">
                            {subjects.reduce((sum, s) => sum + s.credits, 0)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};
