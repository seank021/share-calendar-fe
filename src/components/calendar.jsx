import dayjs from 'dayjs';

const Calendar = ({ events, onDateClick, currentDate }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const getDaysInMonth = (year, month) => {
        return dayjs(`${year}-${month + 1}-01`).daysInMonth();
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = dayjs(`${year}-${month + 1}-01`).day();

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    const today = dayjs();
    const isToday = (currentYear, currentMonth, day) =>
        today.isSame(dayjs(`${currentYear}-${currentMonth + 1}-${day}`), 'day');

    return (
        <div className="px-1 py-3">
            <div className="text-center mb-4">
                {(year !== today.year() && (
                    <span className="text-xl font-semibold">
                        {year}년 {month + 1}월
                    </span>
                )) || <span className="text-xl font-semibold">{month + 1}월</span>}
            </div>
            <div className="grid grid-cols-7 text-center font-semibold text-sm pb-1 border-b-[1px] mb-1">
                {weekDays.map((day, idx) => (
                    <div key={idx} className={day === '일' ? 'text-red-500' : day === '토' ? 'text-blue-500' : ''}>
                        {day}
                    </div>
                ))}
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
                    const date = dayjs(`${year}-${month + 1}-${day + 1}`).format('YYYY-MM-DD');
                    const dayEvents = events.filter(event => dayjs(event.date).format('YYYY-MM-DD') === date);
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
