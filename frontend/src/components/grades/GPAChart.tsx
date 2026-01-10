import React from 'react';

// Simple CSS-based bar chart since we don't have a charting library yet
// In real production, use Recharts or Chart.js

interface GPAChartProps {
    currentGPA: number;
    totalCredits: number;
}

export const GPAChart: React.FC<GPAChartProps> = ({ currentGPA, totalCredits }) => {
    const percentage = Math.min(100, (currentGPA / 4.0) * 100);
    const creditPercentage = Math.min(100, (totalCredits / 140) * 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* GPA Gauge */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
                <div className="relative w-32 h-32 mr-6 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#eee"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={currentGPA >= 3.2 ? "#10B981" : currentGPA >= 2.5 ? "#3B82F6" : "#F59E0B"}
                            strokeWidth="3"
                            strokeDasharray={`${percentage}, 100`}
                        />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-2xl font-bold text-secondary">{currentGPA.toFixed(2)}</span>
                        <span className="block text-[10px] text-gray-400">/ 4.0</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-secondary mb-1">Điểm Trung Bình (GPA)</h3>
                    <p className="text-sm text-gray-500 mb-2">Tích lũy toàn khóa</p>
                    <div className="text-sm">
                        Xếp loại: <strong className={currentGPA >= 3.6 ? "text-green-600" : "text-blue-600"}>
                            {currentGPA >= 3.6 ? 'Xuất sắc' : currentGPA >= 3.2 ? 'Giỏi' : currentGPA >= 2.5 ? 'Khá' : 'Trung bình'}
                        </strong>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="font-bold text-secondary">Tiến độ học tập</h3>
                    <span className="text-sm text-primary font-bold">{Math.round(creditPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
                    <div
                        className="bg-primary h-4 rounded-full transition-all duration-1000"
                        style={{ width: `${creditPercentage}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-500 text-right">
                    Đã tích lũy: <strong>{totalCredits}</strong> / 140 tín chỉ
                </p>
            </div>
        </div>
    );
};
