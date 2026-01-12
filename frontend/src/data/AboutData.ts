export interface Milestone {
    year: string;
    title: string;
    description: string;
    image?: string;
}

export interface MissionPoint {
    title: string;
    description: string;
    icon: string;
}

export interface OrgNode {
    role: string;
    name: string;
    children?: OrgNode[];
}

export const historyData: Milestone[] = [
    {
        year: "2006",
        title: "Thành lập Học viện",
        description: "Được thành lập theo Quyết định số 171/QĐ/TGCP ngày 14/9/2006 của Ban Tôn giáo Chính phủ. Đây là Học viện Phật giáo thứ tư của cả nước và là đầu tiên dành cho hệ phái Nam tông Khmer.",
        image: "/images/history/2006-establishment.jpg"
    },
    {
        year: "2017",
        title: "Khởi công xây dựng",
        description: "Lễ đặt đá khởi công xây dựng cơ sở mới tại Quận Ô Môn, TP. Cần Thơ trên diện tích gần 7ha với tổng kinh phí dự kiến trên 450 tỷ đồng.",
        image: "/images/history/2017-groundbreaking.jpg"
    },
    {
        year: "2019",
        title: "Khánh thành Giai đoạn 1",
        description: "Hoàn thành và đưa vào sử dụng các hạng mục cơ bản sau 2 năm xây dựng, chính thức phục vụ công tác đào tạo và tu học của Tăng sinh.",
        image: "/images/history/2019-phase1.jpg"
    },
    {
        year: "2023",
        title: "Khánh thành Trai đường",
        description: "Khánh thành tòa nhà Trai đường (nhà ăn) khang trang sau 4 năm xây dựng, nâng cao chất lượng đời sống cho Tăng sinh.",
        image: "/images/history/2023-dining-hall.jpg"
    },
    {
        year: "2025",
        title: "Hoàn thiện Chánh điện",
        description: "Khánh thành ngôi Chánh điện và Kiết giới Sima, đánh dấu sự hoàn thiện cơ bản của quần thể kiến trúc Học viện sau gần 20 năm hình thành và phát triển.",
        image: "/images/history/2025-main-hall.jpg"
    }
];

export const missionData: MissionPoint[] = [
    {
        title: "Giáo dục & Đào tạo",
        description: "Đào tạo Cử nhân Phật học Pali - Khmer và Tôn giáo học, bồi dưỡng Tăng tài có kiến thức sâu rộng về Phật học và thế học.",
        icon: "education"
    },
    {
        title: "Bảo tồn Văn hóa",
        description: "Gìn giữ và phát huy bản sắc văn hóa, ngôn ngữ, chữ viết và truyền thống tốt đẹp của Phật giáo Nam tông Khmer.",
        icon: "culture"
    },
    {
        title: "Phụng sự Xã hội",
        description: "Góp phần xây dựng khối đại đoàn kết dân tộc, vận động Tăng ni, Phật tử sống 'tốt đời đẹp đạo'.",
        icon: "social"
    }
];

export const orgStructure: OrgNode = {
    role: "Hội đồng Điều hành - Nhiệm kỳ II",
    name: "Học viện Phật giáo Nam tông Khmer",
    children: [
        {
            role: "Viện trưởng",
            name: "Hòa thượng Đào Như",
            children: [
                {
                    role: "Phó Viện trưởng Thường trực",
                    name: "Hòa thượng Thạch Sok Xane"
                },
                {
                    role: "Phó Viện trưởng kiêm Giám Luật",
                    name: "Hòa thượng Thạch Huônl"
                },
                {
                    role: "Phó Viện trưởng kiêm Tổng Thư ký",
                    name: "Hòa thượng Danh Lung",
                    children: [
                        { role: "Phó Tổng Thư ký kiêm Phó VP", name: "Thượng tọa Sơn Ngọc Huỳnh" }
                    ]
                },
                {
                    role: "Phó Viện trưởng kiêm Chánh Văn phòng",
                    name: "Thượng tọa Lý Hùng",
                    children: [
                        { role: "Phó Văn phòng", name: "Thượng tọa Trần Văn Tha" },
                        { role: "Phó Văn phòng", name: "Thượng tọa Trần Sone" },
                        { role: "Thư ký", name: "Đại đức Thạch Điệp" }
                    ]
                },
                {
                    role: "Phó Viện trưởng",
                    name: "Hòa thượng Danh Thiệp"
                },
                {
                    role: "Phó Viện trưởng",
                    name: "Hòa thượng Danh Đồng"
                }
            ]
        }
    ]
};
