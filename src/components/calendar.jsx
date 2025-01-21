import React from 'react';

const Calendar = ({ events, onDateClick, currentDate }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    // 오늘 날짜 정보
    const today = new Date();
    const isToday = (currentYear, currentMonth, day) =>
        today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;

    return (
        <div className="px-2 py-3">
            <div className="text-center mb-4">
                {(year !== new Date().getFullYear() && (
                    <span className="text-xl font-semibold">
                        {year}년 {month + 1}월
                    </span>
                )) || <span className="text-xl font-semibold">{month + 1}월</span>}
            </div>
            <div className="grid grid-cols-7 text-center font-semibold text-sm pb-1 border-b-[1px] mb-1">
                {weekDays.map(
                    (day, idx) =>
                        (day === '일' && (
                            <div key={idx} className="text-red-500">
                                {day}
                            </div>
                        )) ||
                        (day === '토' && (
                            <div key={idx} className="text-blue-500">
                                {day}
                            </div>
                        )) || <div key={idx}>{day}</div>
                )}
            </div>
            <div
                className="grid grid-cols-7 gap-[0.7px]"
                style={{
                    height: 'calc(100vh - 150px)',
                    gridAutoRows: '1fr', // 균일한 높이 유지
                }}
            >
                {Array.from({ length: firstDay }).map((_, idx) => (
                    <div key={idx}></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const date = `${year}-${month + 1}-${day + 1}`;
                    const dayEvents = events.filter(event => event.date === date);
                    const isCurrentDay = isToday(year, month, day + 1); // 오늘인지 확인

                    return (
                        <div
                            key={day}
                            className="bg-white cursor-pointer flex flex-col justify-start overflow-hidden"
                            onClick={() => onDateClick(date)}
                        >
                            <div className="flex justify-center items-center">
                                {isCurrentDay ? (
                                    <div className="text-[#FF0000] text-center">{day + 1}</div>
                                ) : (
                                    <span className="text-center">{day + 1}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-[1px]" style={{ flex: 1 }}>
                                {dayEvents.slice(0, 3).map((event, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs rounded-sm text-white line-clamp-2 tracking-tighter"
                                        style={{
                                            backgroundColor: event.color,
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            WebkitLineClamp: 2,
                                        }}
                                    >
                                        {event.title}
                                    </span>
                                ))}
                                {dayEvents.length > 3 && (
                                    <span className="text-xs text-gray-500">+{dayEvents.length - 3}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
