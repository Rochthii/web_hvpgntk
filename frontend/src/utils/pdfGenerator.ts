import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { educationData, YearCurriculum } from '../data/EducationData';

// Helper to load font
const loadFont = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

export const generateCurriculumPDF = async () => {
    const doc = new jsPDF();

    // Add metadata
    doc.setProperties({
        title: 'Chuong_trinh_dao_tao_Cu_nhan_Phat_hoc',
        subject: 'Curriculum',
        author: 'Hoc vien Phat giao Nam tong Khmer',
        creator: 'HVPGNTK Web Portal'
    });

    // Load Vietnamese Font (Noto Serif)
    // We use a CDN link for Noto Serif to ensure Vietnamese, Khmer characters render correctly
    // Fallback to standard if fetch fails (risk of garbage text, but better than crash)
    try {
        const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoserif/NotoSerif-Regular.ttf';
        const fontBase64 = await loadFont(fontUrl);

        doc.addFileToVFS('NotoSerif-Regular.ttf', fontBase64);
        doc.addFont('NotoSerif-Regular.ttf', 'NotoSerif', 'normal');
        doc.setFont('NotoSerif');
    } catch (error) {
        console.error("Failed to load font:", error);
        // If font fails, we just proceed with default, might have encoding issues
    }

    // Header
    doc.setFontSize(18);
    doc.setTextColor(139, 69, 19); // #8B4513 Brown
    doc.text('HỌC VIỆN PHẬT GIÁO NAM TÔNG KHMER', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(218, 165, 32); // #DAA520 Gold
    doc.text('CHƯƠNG TRÌNH CỬ NHÂN PHẬT HỌC', 105, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('(Hệ Chính quy - 04 Năm)', 105, 36, { align: 'center' });

    let finalY = 45;

    // Loop through years
    educationData.forEach((yearData: YearCurriculum) => { // Type explicitly
        // Year Header
        doc.setFontSize(12);
        doc.setTextColor(44, 24, 16); // Dark
        doc.text(`NĂM THỨ ${decimalToRoman(yearData.year)}`, 14, finalY + 10);

        // Table
        autoTable(doc, {
            startY: finalY + 15,
            head: [['STT', 'Mã Môn', 'Tên Môn Học', 'Tín Chỉ']],
            body: yearData.subjects.map((sub, index) => [
                index + 1,
                sub.code,
                sub.name,
                sub.credits
            ]),
            styles: {
                font: 'NotoSerif',
                fontSize: 10,
                cellPadding: 4,
                valign: 'middle'
            },
            headStyles: {
                fillColor: [107, 44, 44], // #6B2C2C Secondary
                textColor: [255, 248, 225], // #FFF8E1
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [255, 251, 245] // Light Cream
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center' },
                1: { cellWidth: 25, halign: 'center' },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 20, halign: 'center' }
            },
            theme: 'grid'
        });

        // Update finalY for next table
        finalY = (doc as any).lastAutoTable.finalY + 10;

        // Check if we need a new page
        if (finalY > 250) {
            doc.addPage();
            finalY = 20;
        }
    });

    // Footer / Signature
    const today = new Date();
    const dateStr = `Cần Thơ, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

    if (finalY > 220) doc.addPage();

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(dateStr, 140, finalY + 20);
    doc.text('HỘI ĐỒNG ĐIỀU HÀNH', 140, finalY + 28);

    // Save
    doc.save('Chuong_trinh_Cu_nhan_Phat_hoc_HVPGNTK.pdf');
};

const decimalToRoman = (num: number) => {
    const roman = ["I", "II", "III", "IV"];
    return roman[num - 1] || num;
};
