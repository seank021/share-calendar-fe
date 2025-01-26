import React from 'react';
import CalendarTimeline from '../../components/calendar-timeline';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const CalendarTimelinePage = () => {
    const navigate = useNavigate();
    const { date } = useParams();
    const location = useLocation();
    const events = location.state.events;

    const totalHeight = 960; // 960px for 24 hours

    const renderHourLines = () => {
        return Array.from({ length: 24 }, (_, idx) => (
            <div
                key={idx}
                className="absolute left-0 right-0 h-[1px] bg-gray-200"
                style={{ top: `${(idx / 24) * totalHeight}px` }}
            />
        ));
    };

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-4rem)] w-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">
                    나의 {date.split('-')[0]}년 {date.split('-')[1]}월 {date.split('-')[2]}일
                </h1>
                <div className="w-6"></div>
            </div>

            <div className="flex flex-row overflow-y-auto justify-center w-full relative">
                {/* 시간대 */}
                <div className="relative w-auto px-1">
                    <div className="flex flex-col gap-[20px] text-sm" style={{ height: '960px' }}>
                        {Array.from({ length: 24 }, (_, idx) => (
                            <p key={idx}>{idx.toString().padStart(2, '0')}:00</p>
                        ))}
                    </div>
                </div>

                {/* 세로선 */}
                <div className="w-[1px] bg-gray-300 h-[960px]"></div>

                {/* 내 일정 */}
                <div className="relative w-[85%]" style={{ height: '960px' }}>
                    {events.length > 0 ? (
                        <div className="relative w-full h-full">
                            {renderHourLines()} {/* 시간대 라인 */}
                            <CalendarTimeline events={events} selectedEvent={null} setSelectedEvent={() => {}} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-center text-sm text-gray-500">일정이 없습니다</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarTimelinePage;
