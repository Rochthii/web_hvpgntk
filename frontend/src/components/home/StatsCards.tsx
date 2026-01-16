import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useCounter, useInView } from '../../utils/animations';

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
    const [ref, isInView] = useInView(0.3);

    // Parse numbers from strings like "250+"
    const studentNum = parseInt(studentCount.replace(/\D/g, '')) || 0;
    const courseNum = parseInt(courseCount.replace(/\D/g, '')) || 0;

    const studentCounter = useCounter(studentNum, 2000, isInView);
    const courseCounter = useCounter(courseNum, 1500, isInView);

    const stats: StatCardData[] = [
        { num: foundedYear, label: 'Năm thành lập' },
        {
            num: studentCount.includes('+') ? `${studentCounter}+` : `${studentCounter}`,
            label: 'Sinh viên tốt nghiệp'
        },
        {
            num: courseCount.includes('+') ? `${courseCounter}+` : `${courseCounter}`,
            label: 'Tỉnh Nam Bộ'
        },
    ];

    return (
        <div className="-mt-[95px] relative z-50 px-8" ref={ref}>
            <div className="max-w-[1180px] mx-auto grid grid-cols-3 gap-[1.875rem]">
                {stats.map((stat, idx) => (
                    <Link
                        key={idx}
                        to={ROUTES.ABOUT}
                        className="bg-gradient-to-br from-cream-50 to-cream-200 
                                   border-[2.5px] border-gold-500 rounded-[22px] p-9 
                                   text-center shadow-gold-md min-h-[172px] 
                                   flex flex-col items-center justify-center 
                                   transition-all duration-[400ms] cubic-bezier(0.4, 0, 0.2, 1) 
                                   cursor-pointer no-underline
                                   hover:-translate-y-3 hover:shadow-gold-lg hover:scale-105
                                   animate-float"
                        style={{
                            animation: `fadeInUp ${0.6 + idx * 0.15}s ease-out, float ${4 + idx * 0.5}s ease-in-out infinite`,
                            animationDelay: `${idx * 0.1}s, ${idx * 0.3}s`,
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
