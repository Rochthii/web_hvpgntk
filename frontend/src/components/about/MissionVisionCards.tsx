import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Landmark, HeartHandshake } from 'lucide-react';
import { cmsApi } from '../../api/cms';

interface MissionPoint {
    title: string;
    description: string;
    icon: string;
}

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'education': return <GraduationCap className="w-8 h-8" />;
        case 'culture': return <Landmark className="w-8 h-8" />;
        case 'social': return <HeartHandshake className="w-8 h-8" />;
        default: return <GraduationCap className="w-8 h-8" />;
    }
};

export const MissionVisionCards: React.FC = () => {
    const { i18n } = useTranslation();
    const [missionPoints, setMissionPoints] = useState<MissionPoint[]>([]);

    useEffect(() => {
        const fetchMissionData = async () => {
            try {
                const response = await cmsApi.getPageDetail('su-menh');
                // Default mission points if API doesn't return structured data
                // In the future, we can parse the HTML content or use a custom field
                const defaultMissions: MissionPoint[] = [
                    {
                        title: i18n.language === 'km' ? 'ការអប់រំនិងការបណ្តុះបណ្តាល' : 'Giáo dục & Đào tạo',
                        description: i18n.language === 'km'
                            ? 'បណ្តុះបណ្តាលបរិញ្ញាបត្រព្រះពុទ្ធសាសនា Pali-Khmer និងសាសនាវិទ្យា បណ្តុះបណ្តាលព្រះសង្ឃដែលមានចំណេះដឹងជ្រាលជ្រៅអំពីព្រះពុទ្ធសាសនានិងអប្បបរមា។'
                            : 'Đào tạo Cử nhân Phật học Pali - Khmer và Tôn giáo học, bồi dưỡng Tăng tài có kiến thức sâu rộng về Phật học và thế học.',
                        icon: 'education'
                    },
                    {
                        title: i18n.language === 'km' ? 'អភិរក្សវប្បធម៌' : 'Bảo tồn Văn hóa',
                        description: i18n.language === 'km'
                            ? 'អនុរក្សនិងលើកកម្ពស់អត្តសញ្ញាណវប្បធម៌ ភាសា អក្សរសាស្ត្រ និងប្រពៃណីដ៏ល្អរបស់ព្រះពុទ្ធសាសនាតេរវាទខ្មែរ។'
                            : 'Gìn giữ và phát huy bản sắc văn hóa, ngôn ngữ, chữ viết và truyền thống tốt đẹp của Phật giáo Nam tông Khmer.',
                        icon: 'culture'
                    },
                    {
                        title: i18n.language === 'km' ? 'បំរើសង្គម' : 'Phụng sự Xã hội',
                        description: i18n.language === 'km'
                            ? 'រួមចំណែកក្នុងការកសាងឯកភាពជាតិ លើកទឹកចិត្តព្រះសង្ឃ ព្រះសង្ឃស្រី និងពុទ្ធបរិស័ទរស់នៅ "ល្អសម្រាប់ជីវិតនិងលំនឹងសម្រាប់សាសនា"។'
                            : 'Góp phần xây dựng khối đại đoàn kết dân tộc, vận động Tăng ni, Phật tử sống "tốt đời đẹp đạo".',
                        icon: 'social'
                    }
                ];
                setMissionPoints(defaultMissions);
            } catch (error) {
                console.error('Error fetching mission data:', error);
            }
        };

        fetchMissionData();
    }, [i18n.language]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-6 mb-16">
            {missionPoints.map((item, index) => (
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
