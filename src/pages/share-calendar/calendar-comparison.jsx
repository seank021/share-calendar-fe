import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getUserEvents } from '../../apis/user';
import Loading from '../loading';
import CalendarTimeline from '../../components/calendar-timeline';

const CalendarComparison = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { friendEmail } = useParams(); // URL 파라미터에서 friendEmail 가져오기
    const friendDisplayName = location.state?.friendDisplayName; // location.state에서 friendDisplayName 가져오기

    const [myEvents, setMyEvents] = useState([]);
    const [friendEvents, setFriendEvents] = useState([]);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1; // 0부터 시작하므로 +1
    const selectedDay = selectedDate.getDate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const formattedDate = `${selectedYear}-${String(selectedMonth)}-${String(selectedDay)}`;

                // 내 일정 가져오기
                const myData = await getUserEvents('my', formattedDate, false);
                setMyEvents(myData);

                // 친구 일정 가져오기
                const friendData = await getUserEvents(friendEmail, formattedDate, false);
                setFriendEvents(friendData);

                setLoading(false);
            } catch (error) {
                alert(error.message);
            }
        };

        fetchEvents();
    }, [selectedDate, friendEmail, selectedYear, selectedMonth, selectedDay]);

    const handleDateChange = direction => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + direction);
        setSelectedDate(newDate);
    };

    const handleSwipe = direction => {
        if (direction === 'left') {
            handleDateChange(-1); // 이전 날짜
        } else if (direction === 'right') {
            handleDateChange(1); // 다음 날짜
        }
    };

    const handleTouchStart = e => {
        e.currentTarget.startX = e.touches[0].clientX;
    };

    const handleTouchEnd = e => {
        const deltaX = e.changedTouches[0].clientX - e.currentTarget.startX;
        if (deltaX > 100) handleSwipe('left');
        else if (deltaX < -100) handleSwipe('right');
    };

    if (loading) {
        return <Loading message="일정을 불러오는 중..." />;
    }

    const renderHourLines = () => {
        return Array.from({ length: 24 }, (_, idx) => (
            <div
                key={idx}
                className="absolute left-0 right-0 h-[1px] bg-gray-200"
                style={{ top: `${(idx / 24) * 960}px` }}
            />
        ));
    };

    return (
        <div
            className="flex flex-col bg-white h-[calc(100vh-4rem)] w-full"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">
                    {selectedYear}년 {selectedMonth}월 {selectedDay}일
                </h1>
                <div className="w-6"></div>
            </div>

            <div className="flex flex-row overflow-y-auto justify-center w-full relative">
                {/* 시간대 */}
                <div className="relative w-auto px-1">
                    <h2 className="text-white text-xs">시간</h2>
                    <div className="flex flex-col gap-[20px] text-sm" style={{ height: '960px' }}>
                        {Array.from({ length: 24 }, (_, idx) => (
                            <p key={idx}>{idx.toString().padStart(2, '0')}:00</p>
                        ))}
                    </div>
                </div>

                {/* 세로선 */}
                <div className="w-[1px] bg-gray-300 h-[980px]"></div>

                {/* 내 일정 */}
                <div className="relative w-[45%]" style={{ height: '960px' }}>
                    <h2 className="text-center text-sm font-semibold mt-1">내 일정</h2>
                    {myEvents.length > 0 ? (
                        <div className="relative w-full h-full">
                            {renderHourLines()} {/* 시간대 라인 */}
                            <CalendarTimeline events={myEvents} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-center text-sm text-gray-500">일정이 없습니다</p>
                        </div>
                    )}
                </div>

                {/* 세로선 */}
                <div className="w-[1px] bg-gray-300 h-[980px]"></div>

                {/* 친구 일정 */}
                <div className="relative w-[45%]" style={{ height: '960px' }}>
                    <h2 className="text-center text-sm font-semibold mt-1">{friendDisplayName}의 일정</h2>
                    {friendEvents.length > 0 ? (
                        <div className="relative w-full h-full">
                            {renderHourLines()} {/* 시간대 라인 */}
                            <CalendarTimeline events={friendEvents} />
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

export default CalendarComparison;
