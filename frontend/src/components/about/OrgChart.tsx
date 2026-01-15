import React from 'react';
import { useTranslation } from 'react-i18next';

interface OrgNode {
    role: string;
    name: string;
    children?: OrgNode[];
}

const TreeNode: React.FC<{ node: OrgNode }> = ({ node }) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
        <li className="flex flex-col items-center relative p-4 mb-0 isolate">
            {/* Connector lines are handled by CSS in the parent 'tree' class */}

            {/* Node Content Card */}
            <div
                className={`
          relative z-10 px-6 py-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-gold-md hover:-translate-y-1
          ${node.role.includes("Hội đồng") || node.role.includes("គណៈកម្មាធិការ")
                        ? 'bg-[#6B2C2C] text-[#FFF8E1] border-2 border-[#D4AF37] min-w-[280px]'
                        : 'bg-white text-secondary border border-[#E5CFA0] min-w-[220px] max-w-[280px]'
                    }
        `}
            >
                <div className={`text-[11px] font-bold tracking-widest uppercase mb-1.5 opacity-90 ${node.role.includes("Hội đồng") || node.role.includes("គណៈកម្មាធិការ") ? "text-[#FFD700]" : "text-[#8B4513]"
                    }`}>
                    {node.role}
                </div>
                <div className={`font-bold font-heading leading-tight ${node.role.includes("Hội đồng") || node.role.includes("គណៈកម្មាធិការ") ? "text-xl" : "text-lg"
                    }`}>
                    {node.name}
                </div>
            </div>

            {/* Recursion for Children */}
            {hasChildren && (
                <ul className="flex justify-center pt-8 relative w-fit">
                    {node.children!.map((child, index) => (
                        <TreeNode key={index} node={child} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export const OrgChart: React.FC = () => {
    const { i18n } = useTranslation();

    // Temporary hardcoded structure - TODO: Fetch from StaffMember API with hierarchy
    const orgStructure: OrgNode = i18n.language === 'km' ? {
        role: "គណៈកម្មាធិការដឹកនាំ - អាណត្តិទី២",
        name: "សាលាព្រះពុទ្ធសាសនាតេរវាទខ្មែរ",
        children: [
            {
                role: "អធិការបតី",
                name: "ព្រះតេជគុណ ដាវ ញូ",
                children: [
                    {
                        role: "អនុអធិការបតីជាអចិន្ត្រៃយ៍",
                        name: "ព្រះតេជគុណ ថាច សុក សាន"
                    },
                    {
                        role: "អនុអធិការបតីធ្វើតួនាទីអាណត្តិ",
                        name: "ព្រះតេជគុណ ថាច ហួនល៍"
                    },
                    {
                        role: "អនុអធិការបតីធ្វើតួនាទីលេខាធិការទូទៅ",
                        name: "ព្រះតេជគុណ ដានហ៍ លុង",
                        children: [
                            { role: "អនុលេខាធិការទូទៅធ្វើតួនាទីអនុការិយាល័យ", name: "ព្រះតេជសិលា សន ងោក ហ៊ុយញ" }
                        ]
                    },
                    {
                        role: "អនុអធិការបតីធ្វើតួនាទីប្រធានការិយាល័យ",
                        name: "ព្រះតេជសិលា លី ហ៊ុង",
                        children: [
                            { role: "អនុការិយាល័យ", name: "ព្រះតេជសិលា ត្រាន វ៉ាន់ ថា" },
                            { role: "អនុការិយាល័យ", name: "ព្រះតេជសិលា ត្រាន សុន" },
                            { role: "លេខាធិការ", name: "សម្តេច ថាច ឌៀប" }
                        ]
                    },
                    {
                        role: "អនុអធិការបតី",
                        name: "ព្រះតេជគុណ ដានហ៍ ថៀប"
                    },
                    {
                        role: "អនុអធិការបតី",
                        name: "ព្រះតេជគុណ ដានហ៍ ដុង"
                    }
                ]
            }
        ]
    } : {
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

    return (
        <div className="overflow-x-auto py-16 px-4 scrollbar-thin scrollbar-thumb-[#D4AF37] scrollbar-track-[#FFF8E1]">
            <div className="w-fit mx-auto min-w-min">
                <div className="css-tree">
                    <ul className="flex justify-center">
                        <TreeNode node={orgStructure} />
                    </ul>
                </div>
            </div>

            {/* Global Styles for the Tree Lines */}
            <style>{`
            .css-tree ul {
                padding-top: 20px; 
                position: relative;
                transition: all 0.5s;
                display: flex;
            }

            .css-tree li {
                float: left; text-align: center;
                list-style-type: none;
                position: relative;
                padding: 20px 5px 0 5px;
                transition: all 0.5s;
            }

            /* Vertical line up */
            .css-tree li::before, .css-tree li::after {
                content: '';
                position: absolute; top: 0; right: 50%;
                border-top: 1px solid #D4AF37;
                width: 50%; height: 20px;
                z-index: 0;
            }

            /* The other half of the top horizontal connector */
            .css-tree li::after {
                right: auto; left: 50%;
                border-left: 1px solid #D4AF37;
            }

            /* Remove left connector from first child and right connector from last child */
            .css-tree li:only-child::after, .css-tree li:only-child::before {
                display: none;
            }
            .css-tree li:only-child { padding-top: 0;}

            /* Remove space from the top of single children */
            .css-tree li:first-child::before, .css-tree li:last-child::after {
                border: 0 none;
            }

            /* Adding the vertical line for the last child */
            .css-tree li:last-child::before{
                border-right: 1px solid #D4AF37;
                border-radius: 0 5px 0 0;
            }
            .css-tree li:first-child::after{
                border-radius: 5px 0 0 0;
            }

            /* Time for the vertical line down from parents */
            .css-tree ul ul::before{
                content: '';
                position: absolute; top: 0; left: 50%;
                border-left: 1px solid #D4AF37;
                width: 0; height: 20px;
                transform: translateX(-50%);
                z-index: 0;
            }
        `}</style>
        </div>
    );
};
