export interface Subject {
    id: string;
    code: string;
    name: string;
    credits: number; // STC
    department?: string; // Bộ môn (Optional/Derived)
}

export interface YearCurriculum {
    year: number;
    subjects: Subject[];
}

export const educationData: YearCurriculum[] = [
    {
        year: 1,
        subjects: [
            { id: "1", code: "TH014", name: "Thái Ngữ – I", credits: 4 },
            { id: "2", code: "SV013", name: "Xã Hội Học", credits: 3 },
            { id: "3", code: "SS014", name: "Sanskrit – I", credits: 4 },
            { id: "4", code: "SD013", name: "Thiền Học – I", credits: 3 },
            { id: "5", code: "PL314", name: "Dịch Thuật Pali – I", credits: 4 },
            { id: "6", code: "PL214", name: "Cú Pháp Pali – I", credits: 4 },
            { id: "7", code: "PL114", name: "Văn Phạm Pali – I", credits: 4 },
            { id: "8", code: "PB014", name: "Lịch Sử Phật Giáo Thế Giới (PG. Khmer)", credits: 4 },
            { id: "9", code: "MB013", name: "Phật Pháp Căn Bản", credits: 3 },
            { id: "10", code: "EN014", name: "Anh Ngữ – I", credits: 3 },
            { id: "11", code: "CT013", name: "Chính Sách Tôn Giáo & Dân Tộc", credits: 3 },
            { id: "12", code: "CP013", name: "Tin Học Đại Cương", credits: 3 },
            { id: "13", code: "AS014", name: "Văn Học Khmer – I", credits: 4 },
            { id: "14", code: "AK014", name: "Văn Minh Khmer – I", credits: 4 },
            { id: "15", code: "NK013", name: "Tông Phái Phật Giáo (V&K)", credits: 3 },
            { id: "16", code: "LV013", name: "Phương Pháp Viết Luận Văn", credits: 3 },
        ]
    },
    {
        year: 2,
        subjects: [
            { id: "17", code: "SD243", name: "Thiền Học – II", credits: 3 },
            { id: "18", code: "TH244", name: "Thái Ngữ – II", credits: 4 },
            { id: "19", code: "EN244", name: "Anh Ngữ – II", credits: 4 },
            { id: "20", code: "TM012", name: "Tư Tưởng HCM", credits: 3 },
            { id: "21", code: "ML015", name: "Những NL Cơ Bản của CN. Mác – Lênin", credits: 5 },
            { id: "22", code: "LV013", name: "Lịch Sử Việt Nam Đại Cương", credits: 3 },
            { id: "23", code: "LP013", name: "Pháp Luật Đại Cương", credits: 3 },
            { id: "24", code: "CM013", name: "Đường Lối CM của ĐCSVN", credits: 3 },
            { id: "25", code: "PL644", name: "Dịch Thuật Pali – II", credits: 4 },
            { id: "26", code: "PL544", name: "Cú Pháp Pali – II", credits: 4 },
            { id: "27", code: "PL444", name: "Văn Phạm Pali – II", credits: 4 },
            { id: "28", code: "DP013", name: "Triết Học Phật Giáo", credits: 3 },
            { id: "29", code: "SS244", name: "Sanskrit – II", credits: 4 },
            { id: "30", code: "AS224", name: "Văn Học Khmer – II", credits: 4 },
            { id: "31", code: "AK224", name: "Văn Minh Khmer – II", credits: 4 },
            { id: "32", code: "PA133", name: "Văn Học Pali – I", credits: 4 },
            { id: "33", code: "AB123", name: "Abhidhamma (V&K)", credits: 3 },
            { id: "34", code: "NK013-2", name: "Tông Phái Phật giáo (K)", credits: 3 },
        ]
    },
    {
        year: 3,
        subjects: [
            { id: "35", code: "TK033", name: "Logic Học", credits: 3 },
            { id: "36", code: "TH334", name: "Thái Ngữ – III", credits: 4 },
            { id: "37", code: "SS334", name: "Sanskrit – III", credits: 4 },
            { id: "38", code: "SK034", name: "Tôn Giáo Học", credits: 4 },
            { id: "39", code: "SD333", name: "Thiền Học – III", credits: 4 },
            { id: "40", code: "PL334", name: "Dịch Thuật Pali – III", credits: 4 },
            { id: "41", code: "PL234", name: "Cú Pháp Pali – III", credits: 4 },
            { id: "42", code: "PL124", name: "Văn Phạm Pali – III", credits: 4 },
            { id: "43", code: "PA233", name: "Văn Học Pali – II", credits: 4 },
            { id: "44", code: "EN334", name: "Anh Ngữ – III", credits: 4 },
            { id: "45", code: "AS334", name: "Văn Học Khmer – III", credits: 4 },
            { id: "46", code: "AB233", name: "Abhidhamma – II (V&K)", credits: 3 },
            { id: "47", code: "BG013", name: "Mỹ Thuật và Kiến Trúc Phật Giáo Khmer", credits: 3 },
            { id: "48", code: "MB013-2", name: "Phật Pháp Căn Bản – II", credits: 3 },
            { id: "49", code: "AK224-2", name: "Văn Minh Khmer – III", credits: 3 },
        ]
    },
    {
        year: 4,
        subjects: [
            { id: "50", code: "VB014", name: "Văn Hóa Phật Giáo", credits: 4 },
            { id: "51", code: "TH444", name: "Thái Ngữ – IV", credits: 4 },
            { id: "52", code: "EN444", name: "Anh Ngữ – IV", credits: 4 },
            { id: "53", code: "SD443", name: "Thiền Học – IV", credits: 3 },
            { id: "54", code: "CS013", name: "Tâm Lý Học", credits: 3 },
            { id: "55", code: "SS444", name: "Sanskrit – IV", credits: 4 },
            { id: "56", code: "PL944", name: "Dịch Thuật Pali – IV", credits: 4 },
            { id: "57", code: "PL844", name: "Cú Pháp Pali – IV", credits: 4 },
            { id: "58", code: "PL744", name: "Văn Phạm Pali – IV", credits: 4 },
            { id: "59", code: "PL343", name: "Văn Học Pali – III", credits: 4 },
            { id: "60", code: "VX013", name: "Văn Hóa Xã Hội", credits: 3 },
            { id: "61", code: "AS334-2", name: "Văn Học Khmer – IV", credits: 4 },
            { id: "62", code: "NK013-3", name: "Tông Phái Phật Giáo", credits: 3 },
            { id: "63", code: "SB033", name: "Xã Hội Phật Giáo (Khmer)", credits: 3 },
        ]
    }
];
