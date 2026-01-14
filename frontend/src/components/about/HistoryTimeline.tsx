import React from 'react';
import { HistoryMilestone } from '../../api/cms';

interface HistoryTimelineProps {
    data: HistoryMilestone[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ data }) => {
    return (
        <div className="relative container mx-auto px-6 py-16">
            {/* Central Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#D4AF37]/30 hidden md:block"></div>

            <div className="flex flex-col gap-12">
                {data.map((item, index) => (
                    <div
                        key={item.id || index}
                        className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                            }`}
                    >
                        {/* Content Card */}
                        <div className="flex-1 w-full bg-white p-6 rounded-lg shadow-warm border border-[#D4AF37]/20 hover:shadow-gold-md transition-all duration-300 relative group">
                            {/* Arrow */}
                            <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-t border-l border-[#D4AF37]/20 transform rotate-45 ${index % 2 === 0 ? '-right-2 border-r border-b border-t-0 border-l-0' : '-left-2'
                                }`}></div>

                            <span className="text-4xl font-bold text-[#D4AF37] opacity-20 absolute top-4 right-6 font-heading">
                                {item.year}
                            </span>
                            <h3 className="text-xl font-bold text-secondary mb-3 font-heading flex items-center gap-3">
                                <span className="text-[#D4AF37] text-2xl">•</span> {item.title_vi}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm text-justify">
                                {item.description_vi}
                            </p>
                        </div>

                        {/* Decorator Dot on Line */}
                        <div className="hidden md:flex flex-none w-12 h-12 rounded-full bg-[#FFF3E0] border-4 border-[#D4AF37] items-center justify-center z-10 shadow-lg shrink-0">
                            <div className="w-4 h-4 rounded-full bg-[#D4AF37]"></div>
                        </div>

                        {/* Image (Optional) or Spacer */}
                        <div className="flex-1 w-full hidden md:block">
                            {/* We can place an image here later if available, for now it balances the layout */}
                            {item.image ? (
                                <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-[#D4AF37]/30 shadow-md">
                                    <img
                                        src={item.image}
                                        alt={item.title_vi}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                        onError={(e) => (e.target as HTMLImageElement).src = '/images/temple-hero.jpg'} // Fallback
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-transparent"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
