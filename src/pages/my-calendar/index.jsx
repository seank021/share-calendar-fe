import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/calendar';
import EventModal from '../../components/event-modal';

const MyCalendar = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('Please login first');
            navigate('/profile');
        }
    }, [navigate]);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([
        {
            date: '2025-1-1',
            title: 'Event 1 안녕하세용~',
            color: '#FF6F61',
            time: '10:00 ~ 13:00',
            location: '홍대',
            memo: '메모입니다.',
        },
        {
            date: '2025-1-1',
            title: 'Event 1 안녕하세용~',
            color: '#6BCB77',
            time: '14:00 ~ 15:00',
            location: '홍대',
            memo: '메모입니다.',
        },
        {
            date: '2025-1-1',
            title: 'Event 1',
            color: '#4D96FF',
            time: '16:00 ~ 17:00',
            location: '홍대',
            memo: '메모입니다.',
        },
        {
            date: '2025-1-3',
            title: 'Event 2',
            color: '#14532D',
            time: '10:00 ~ 13:00',
            location: '강남',
            memo: '메모입니다.',
        },
        {
            date: '2025-1-5',
            title: 'Event 3',
            color: '#355C7D',
            time: '10:00 ~ 13:00',
            location: '신촌',
            memo: '메모입니다.',
        },
        {
            date: '2025-1-7',
            title: 'Event 4',
            color: '#D72638',
            time: '10:00 ~ 13:00',
            location: '건대',
            memo: '메모입니다.',
        },
        {
            date: '2025-1-11',
            title: 'Event 6',
            color: '#FFC400',
            time: '10:00 ~ 13:00',
            location: '강남',
            memo: '메모입니다.',
        },
        {
            date: '2025-1-13',
            title: 'Event 7',
            color: '#A29BFE',
            time: '10:00 ~ 13:00',
            location: '신촌',
            memo: '메모입니다.',
        },
        {
            date: '2025-1-19',
            title: 'Event 10 asdfasdfsadf',
            color: '#F9A825',
            time: '10:00 ~ 13:00',
            location: '강남',
            memo: '메모입니다.',
        },
        {
            date: '2025-1-31',
            title: 'Event 10',
            color: '#5F3DC4',
            time: '10:00 ~ 13:00',
            location: '강남',
            memo: '메모입니다.',
        },
    ]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [lastClickTimestamp, setLastClickTimestamp] = useState(0);
    const doubleClickThreshold = 300; // 밀리초 기준

    const handleDateClick = date => {
        // double click인지 확인하기 위한 timestamp
        const currentTimestamp = new Date().getTime();
        const dayEvents = events
            .filter(event => event.date === date)
            .sort(
                (a, b) =>
                    new Date(`2025-01-01 ${a.time.split(' ~ ')[0]}`) - new Date(`2025-01-01 ${b.time.split(' ~ ')[0]}`)
            );

        if (currentTimestamp - lastClickTimestamp < doubleClickThreshold) {
            // 더블 클릭: 이벤트 추가 페이지로 이동
            navigate(`/add-event?date=${date}`);
        } else {
            // 단일 클릭
            if (dayEvents.length > 0) {
                // 일정이 있으면 이벤트 리스트 모달 띄우기
                setSelectedDate({ date, events: dayEvents });
                setShowModal(true);
            } else {
                console.log('더블 클릭으로 이벤트 추가 페이지로 이동 가능');
            }
        }
        setLastClickTimestamp(currentTimestamp); // 클릭 시간 업데이트
    };

    const handleSwipe = direction => {
        const newDate = new Date(currentDate);
        if (direction === 'left') {
            newDate.setMonth(currentDate.getMonth() - 1);
        } else if (direction === 'right') {
            newDate.setMonth(currentDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    return (
        <div
            onTouchStart={e => (e.currentTarget.startX = e.touches[0].clientX)}
            onTouchEnd={e => {
                const deltaX = e.changedTouches[0].clientX - e.currentTarget.startX;
                if (deltaX > 50) handleSwipe('left');
                else if (deltaX < -50) handleSwipe('right');
            }}
        >
            <Calendar events={events} onDateClick={handleDateClick} currentDate={currentDate} />
            {showModal && selectedDate && (
                <EventModal
                    date={selectedDate.date}
                    events={selectedDate.events}
                    onClose={() => setShowModal(false)}
                    onAddEvent={() => (window.location.href = `/add-event?date=${selectedDate.date}`)}
                />
            )}
        </div>
    );
};

export default MyCalendar;
