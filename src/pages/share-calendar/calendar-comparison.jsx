import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getUserEvents } from '../../apis/api';
import Loading from '../loading';

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
                const myData = await getUserEvents('my', formattedDate, true);
                setMyEvents(myData);

                // 친구 일정 가져오기
                const friendData = await getUserEvents(friendEmail, formattedDate, true);
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
        if (deltaX > 50) handleSwipe('left');
        else if (deltaX < -50) handleSwipe('right');
    };

    if (loading) {
        return <Loading message="일정을 불러오는 중..." />;
    }

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
                <h1 className="text-lg font-bold">{friendDisplayName} 님과의 일정</h1>
                <div className="w-6"></div>
            </div>
            
            <div className="text-center py-4">
                <h2>
                    {selectedYear}년 {selectedMonth}월 {selectedDay}일
                </h2>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
                <div>
                    <h2>내 일정</h2>
                    {myEvents.length > 0 ? (
                        myEvents.map(event => (
                            <div key={event.id}>
                                <p>{event.title}</p>
                                <p>{event.time}</p>
                            </div>
                        ))
                    ) : (
                        <p>일정이 없습니다.</p>
                    )}
                </div>
                <div>
                    <h2>친구 일정</h2>
                    {friendEvents.length > 0 ? (
                        friendEvents.map(event => (
                            <div key={event.id}>
                                <p>{event.title}</p>
                                <p>{event.time}</p>
                            </div>
                        ))
                    ) : (
                        <p>일정이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarComparison;
