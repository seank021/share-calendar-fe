import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEvent } from '../apis/api';

const EventModal = ({ date, events, onClose, onAddEvent }) => {
    const navigate = useNavigate();

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const parsedDate = new Date(date);
    const dayOfWeek = days[parsedDate.getDay()];
    const [longPressedEvent, setLongPressedEvent] = useState(null);
    let pressTimer = null;

    const handleTouchStart = event => {
        pressTimer = setTimeout(() => {
            setLongPressedEvent(event);
        }, 600);
    };

    const handleTouchEnd = () => {
        clearTimeout(pressTimer); // 손을 뗄 때 타이머 해제
    };

    const handleDeleteEvent = async event => {
        const res = await deleteEvent(event);
        if (res) {
            alert('일정이 삭제되었습니다');
            window.location.reload(); // 페이지 새로고침
        } else {
            alert('일정 삭제에 실패했습니다');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white w-[90%] max-w-md rounded-xl p-5 relative select-none" // 텍스트 선택 방지
                onClick={e => e.stopPropagation()}
                onContextMenu={e => e.preventDefault()} // 꾹 눌렀을 때 기본 메뉴 방지
            >
                <div className="text-left ml-3 pb-2 border-b-[1px] border-gray-200 mb-4">
                    <h2 className="text-xl font-bold">
                        {parsedDate.getMonth() + 1}월 {parsedDate.getDate()}일 {dayOfWeek}요일
                    </h2>
                </div>
                <div className="space-y-5 overflow-y-auto px-3 py-2" style={{ maxHeight: '300px' }}>
                    {events.map((event, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col relative select-none" // 텍스트 선택 방지
                            onTouchStart={() => handleTouchStart(event)}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchEnd}
                            onContextMenu={e => e.preventDefault()} // 꾹 눌렀을 때 기본 메뉴 방지
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
                                        e.stopPropagation(); // 이벤트 전파 중단
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
                    + {parsedDate.getMonth() + 1}월 {parsedDate.getDate()}일에 일정 추가
                </button>
            </div>
        </div>
    );
};

export default EventModal;
