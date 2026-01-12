import React from 'react';
import { MissionPoint } from '../../data/AboutData';
import { GraduationCap, Landmark, HeartHandshake } from 'lucide-react';

interface MissionVisionCardsProps {
    data: MissionPoint[];
}

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'education': return <GraduationCap className="w-8 h-8" />;
        case 'culture': return <Landmark className="w-8 h-8" />;
        case 'social': return <HeartHandshake className="w-8 h-8" />;
        default: return <GraduationCap className="w-8 h-8" />;
    }
};

export const MissionVisionCards: React.FC<MissionVisionCardsProps> = ({ data }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-6 mb-16">
            {data.map((item, index) => (
                <div
                    key={index}
                    className="bg-[#FFFBF5] p-8 rounded-xl border border-[#D4AF37]/20 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-gold-sm group"
                >
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37] to-[#F57C00] rounded-full flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                        {getIcon(item.icon)}
                    </div>
                    <h3 className="text-xl font-bold text-[#6B2C2C] mb-4 font-heading uppercase tracking-wide">
                        {item.title}
                    </h3>
                    <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-4 rounded-full opacity-50"></div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {item.description}
                    </p>
                </div>
            ))}
        </div>
    );
};
