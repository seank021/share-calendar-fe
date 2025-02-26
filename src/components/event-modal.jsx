import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEvent } from '../apis/event';
import dayjs from 'dayjs';

const EventModal = ({ date, events, onClose, onAddEvent }) => {
    const navigate = useNavigate();
    const parsedDate = dayjs(date);
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][parsedDate.day()];
    const [longPressedEvent, setLongPressedEvent] = useState(null);
    let pressTimer = null;

    const handleTouchStart = event => {
        pressTimer = setTimeout(() => {
            setLongPressedEvent(event);
        }, 600);
    };

    const handleTouchEnd = () => {
        clearTimeout(pressTimer);
    };

    const handleDeleteEvent = async event => {
        const res = await deleteEvent(event);
        if (res) {
            alert('일정이 삭제되었습니다');
            onClose();
        }
    };

    const handleViewTimeline = () => {
        navigate(`/calendar-timeline/${date}`, { state: { events } });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white w-[90%] max-w-md rounded-xl p-5 relative select-none"
                onClick={e => e.stopPropagation()}
                onContextMenu={e => e.preventDefault()}
            >
                <div className="flex justify-between items-center pb-2 border-b-[1px] border-gray-200 mb-4">
                    <div className="text-left ml-3">
                        <h2 className="text-xl font-bold">
                            {parsedDate.format('MM월 DD일')} {dayOfWeek}요일
                        </h2>
                    </div>
                    <button onClick={handleViewTimeline} aria-label="View Timeline">
                        <img src="/icons/list.svg" alt="List View" className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-5 overflow-y-auto px-3 py-2" style={{ maxHeight: '300px' }}>
                    {events.map((event, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col relative select-none"
                            onTouchStart={() => handleTouchStart(event)}
                            onTouchEnd={handleTouchEnd}
                            onClick={() => {
                                if (!longPressedEvent) {
                                    navigate('/edit-event', { state: { event } });
                                }
                            }}
                        >
                            <div className="flex items-center">
                                <div className="flex w-[75px] items-center gap-4">
                                    <div className="text-sm font-bold text-right">{event.time.split(' ~ ')[0]}</div>
                                    <div
                                        className="w-[5px] h-5 rounded-md"
                                        style={{ backgroundColor: event.color }}
                                    ></div>
                                </div>
                                <div className="text-md font-medium">{event.title}</div>
                            </div>
                            <div className="flex-1">
                                <div className="ml-[75px] text-xs text-gray-400">
                                    {event.time}&nbsp;&nbsp;{event.location ? `| ${event.location}` : ''}
                                </div>
                            </div>
                            {longPressedEvent === event && (
                                <button
                                    className="absolute right-0 top-1 bg-red-500 text-white text-sm px-2 py-1 rounded-md hover:bg-red-600"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDeleteEvent(event);
                                    }}
                                >
                                    삭제하기
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    onClick={onAddEvent}
                >
                    + {parsedDate.format('MM월 DD일')}에 일정 추가
                </button>
            </div>
        </div>
    );
};

export default EventModal;
