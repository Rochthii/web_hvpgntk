import React, { useMemo } from 'react';
import { RegistrationClass } from '../../types/registration';

interface SchedulePreviewProps {
    enrolledClasses: RegistrationClass[];
}

const DAYS = [
    { value: 2, label: 'T2' },
    { value: 3, label: 'T3' },
    { value: 4, label: 'T4' },
    { value: 5, label: 'T5' },
    { value: 6, label: 'T6' },
    { value: 7, label: 'T7' },
    { value: 8, label: 'CN' },
];

export const SchedulePreview: React.FC<SchedulePreviewProps> = ({ enrolledClasses }) => {

    // Convert enrolled classes to schedule slots
    const slots = useMemo(() => {
        const allSlots: any[] = [];
        enrolledClasses.forEach(cls => {
            // Parse schedule JSON
            let schedule = cls.schedule;
            if (!schedule) return;
            if (!Array.isArray(schedule)) schedule = [schedule];

            schedule.forEach((s: any) => {
                allSlots.push({
                    ...s,
                    course_name: cls.course_code, // Use code for compact view
                    color: 'bg-green-100 border-green-500 text-green-700'
                });
            });
        });
        return allSlots;
    }, [enrolledClasses]);

    const getSlotStyle = (start: string, end: string) => {
        const startHour = parseInt(start.split(':')[0]);
        const startMic = parseInt(start.split(':')[1] || '0');
        const endHour = parseInt(end.split(':')[0]);
        const endMin = parseInt(end.split(':')[1] || '0');

        const startMinutes = (startHour - 7) * 60 + startMic;
        const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMic);

        return {
            top: `${(startMinutes / 60) * 40}px`, // 40px per hour for compact view
            height: `${(durationMinutes / 60) * 40}px`
        };
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            <div className="p-3 border-b border-gray-100 bg-gray-50 font-bold text-gray-700 text-center">
                Lịch Học Dự Kiếm
            </div>

            <div className="grid grid-cols-8 border-b border-gray-200 text-xs">
                <div className="p-2 border-r border-gray-100 bg-gray-50 text-center text-gray-400">
                    Gio
                </div>
                {DAYS.map(day => (
                    <div key={day.value} className="p-2 border-r border-gray-100 bg-gray-50 text-center font-bold text-gray-600 last:border-r-0">
                        {day.label}
                    </div>
                ))}
            </div>

            <div className="relative bg-white" style={{ height: '440px' }}> {/* 11 hours * 40px */}
                {/* Grid lines */}
                {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour, i) => (
                    <div key={hour} className="absolute w-full border-b border-gray-50 flex items-start" style={{ top: `${i * 40}px` }}>
                        <div className="w-[12.5%] text-right pr-1 text-[10px] text-gray-300 -mt-2">
                            {hour}h
                        </div>
                    </div>
                ))}

                {/* Slots */}
                {slots.map((slot, idx) => {
                    const dayIndex = DAYS.findIndex(d => d.value === slot.day);
                    if (dayIndex === -1) return null;

                    const style = getSlotStyle(slot.start || '7:00', slot.end || '9:00');

                    return (
                        <div
                            key={idx}
                            className="absolute px-0.5 z-10"
                            style={{
                                ...style,
                                left: `${(dayIndex + 1) * 12.5}%`,
                                width: '12.5%'
                            }}
                        >
                            <div className={`h-full w-full rounded text-[9px] p-0.5 leading-tight overflow-hidden border-l-2 ${slot.color}`}>
                                <strong>{slot.course_name}</strong>
                                <div className="hidden xl:block">{slot.room}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-3 bg-gray-50 text-xs text-gray-500 text-center border-t border-gray-200">
                * Các ô màu xanh là môn đã chọn
            </div>
        </div>
    );
};
