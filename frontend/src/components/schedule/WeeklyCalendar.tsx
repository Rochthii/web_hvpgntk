import React from 'react';

interface ScheduleSlot {
    class_id: string;
    course_code: string;
    course_name: string;
    lecturer: string;
    day_of_week: number; // 2=Mon, 8=Sun
    start_time: string; // "07:00"
    end_time: string;   // "09:00"
    room: string;
}

interface WeeklyCalendarProps {
    schedule: ScheduleSlot[];
    isLoading?: boolean;
}

const DAYS = [
    { value: 2, label: 'Thứ 2' },
    { value: 3, label: 'Thứ 3' },
    { value: 4, label: 'Thứ 4' },
    { value: 5, label: 'Thứ 5' },
    { value: 6, label: 'Thứ 6' },
    { value: 7, label: 'Thứ 7' },
    { value: 8, label: 'C.Nhật' },
];

const TIME_SLOTS = [
    '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ schedule, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Calculate position and height based on time
    const getSlotStyle = (start: string, end: string) => {
        const startHour = parseInt(start.split(':')[0]);
        const startMin = parseInt(start.split(':')[1]);
        const endHour = parseInt(end.split(':')[0]);
        const endMin = parseInt(end.split(':')[1]);

        const startMinutes = (startHour - 7) * 60 + startMin; // Start from 7:00
        const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);

        return {
            top: `${(startMinutes / 60) * 60}px`, // 60px per hour
            height: `${(durationMinutes / 60) * 60}px`
        };
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-4 border-r border-gray-100 bg-gray-50 text-center text-sm font-bold text-gray-500">
                    Giờ
                </div>
                {DAYS.map(day => (
                    <div key={day.value} className="p-4 border-r border-gray-100 bg-gray-50 text-center text-sm font-bold text-gray-700 last:border-r-0">
                        {day.label}
                    </div>
                ))}
            </div>

            <div className="relative" style={{ height: '660px' }}> {/* 11 hours * 60px */}
                {/* Time grid lines */}
                {TIME_SLOTS.map((time, index) => (
                    <div key={time} className="absolute w-full border-b border-gray-50 flex items-start" style={{ top: `${index * 60}px` }}>
                        <div className="w-[12.5%] text-right pr-2 text-xs text-gray-400 -mt-2.5">
                            {time}
                        </div>
                    </div>
                ))}

                {/* Schedule Slots */}
                {schedule.map((slot, index) => {
                    const dayIndex = DAYS.findIndex(d => d.value === slot.day_of_week);
                    if (dayIndex === -1) return null;

                    const style = getSlotStyle(slot.start_time, slot.end_time);

                    return (
                        <div
                            key={`${slot.class_id}-${index}`}
                            className="absolute px-1"
                            style={{
                                ...style,
                                left: `${(dayIndex + 1) * 12.5}%`, // +1 for time column
                                width: '12.5%'
                            }}
                        >
                            <div className="h-full bg-blue-50 border-l-4 border-blue-500 rounded p-2 text-xs overflow-hidden hover:bg-blue-100 transition-colors cursor-pointer group shadow-sm">
                                <div className="font-bold text-blue-700 truncate">{slot.course_name}</div>
                                <div className="text-blue-600 truncate">{slot.room}</div>
                                <div className="text-gray-500 mt-1 truncate group-hover:block hidden md:block">
                                    {slot.lecturer}
                                </div>
                                <div className="text-gray-400 text-[10px] mt-1">
                                    {slot.start_time} - {slot.end_time}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Current Time Indicator (mocked for visual) */}
                {/* In production would use real Date() */}
            </div>
        </div>
    );
};
