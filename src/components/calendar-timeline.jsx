import React, { useState } from 'react';
import EventDetailModal from './modal';

const CalendarTimeline = ({ events, selectedEvent, setSelectedEvent }) => {
    const [clicked, setClicked] = useState(null); // selectedEvent와 동일한 역할

    const totalHeight = 960; // 960px for 24 hours
    const hourHeight = totalHeight / 24; // Each hour occupies an equal portion of the timeline

    const calculatePosition = time => {
        const [hour, minute] = time.split(':').map(Number);
        return hour * hourHeight + (minute / 60) * hourHeight; // Position in pixels based on hour and minutes
    };

    const calculateHeight = (startTime, endTime) => {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        return ((endTotalMinutes - startTotalMinutes) / 60) * hourHeight; // Height in pixels based on duration
    };

    return (
        <>
            <div className="relative w-full" style={{ height: `${totalHeight}px` }}>
                {events.map(event => {
                    const [startTime, endTime] = event.time.split(' ~ ');

                    return (
                        <div
                            key={event.id}
                            className="absolute w-full flex items-center justify-center text-white text-sm px-2 cursor-pointer rounded-md"
                            style={{
                                top: `${calculatePosition(startTime)}px`,
                                height: `${calculateHeight(startTime, endTime)}px`,
                                backgroundColor: event.color,
                            }}
                            onClick={() => {
                                setSelectedEvent(event);
                                setClicked(event);
                            }} // Open modal with selected event
                        >
                            <h3 className="font-semibold text-center">{event.title}</h3>
                        </div>
                    );
                })}
            </div>

            {/* 일정 상세 모달 */}
            {clicked && <EventDetailModal event={clicked} onClose={() => { setSelectedEvent(null); setClicked(null); }} />}
        </>
    );
};

export default CalendarTimeline;
