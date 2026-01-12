import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

interface StatCardData {
    num: string;
    label: string;
}

interface StatsCardsProps {
    foundedYear: string;
    studentCount: string;
    courseCount: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
    foundedYear,
    studentCount,
    courseCount,
}) => {
    const stats: StatCardData[] = [
        { num: foundedYear || '2006', label: 'Năm thành lập' },
        { num: studentCount || '300+', label: 'Sinh viên tốt nghiệp' },
        { num: courseCount || '8', label: 'Tỉnh Nam Bộ' },
    ];

    return (
        <div className="-mt-[95px] relative z-50 px-8">
            <div className="max-w-[1180px] mx-auto grid grid-cols-3 gap-[1.875rem]">
                {stats.map((stat, idx) => (
                    <Link
                        key={stat.num}
                        to={ROUTES.ABOUT}
                        className="bg-gradient-to-br from-cream-50 to-cream-200 border-[2.5px] border-gold-500 rounded-[22px] p-9 text-center shadow-gold-md min-h-[172px] flex flex-col items-center justify-center transition-all duration-[350ms] cubic-bezier(0.4, 0, 0.2, 1) cursor-pointer hover:-translate-y-2 hover:shadow-gold-lg no-underline"
                        style={{
                            animation: `fadeInUp ${0.6 + idx * 0.15}s ease-out`,
                        }}
                    >
                        <div className="text-[3.125rem] font-black text-primary mb-2 font-serif-khmer drop-shadow-sm">
                            {stat.num}
                        </div>
                        <div className="text-[1.0625rem] font-semibold text-secondary tracking-wide">
                            {stat.label}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
