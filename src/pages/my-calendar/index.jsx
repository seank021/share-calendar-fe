import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/calendar';

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
        { date: '2025-1-1', title: 'Event 1 안녕하세용~', color: 'red', time: '10:00 ~ 13:00', location: '홍대' },
        { date: '2025-1-1', title: 'Event 1 안녕하세용~', color: 'red', time: '14:00 ~ 15:00', location: '홍대' },
        { date: '2025-1-1', title: 'Event 1', color: 'red', time: '16:00 ~ 17:00', location: '홍대' },
        { date: '2025-1-1', title: 'Event 1 안녕하세용~', color: 'red', time: '18:00 ~ 19:00', location: '홍대' },
        { date: '2025-1-3', title: 'Event 2', color: 'blue', time: '10:00 ~ 13:00', location: '강남' },
        { date: '2025-1-5', title: 'Event 3', color: 'green', time: '10:00 ~ 13:00', location: '신촌' },
        { date: '2025-1-7', title: 'Event 4', color: '#000', time: '10:00 ~ 13:00', location: '건대' },
        { date: '2025-1-9', title: 'Event 5', color: 'purple', time: '10:00 ~ 13:00', location: '홍대' },
        { date: '2025-1-11', title: 'Event 6', color: 'orange', time: '10:00 ~ 13:00', location: '강남' },
        { date: '2025-1-13', title: 'Event 7', color: 'pink', time: '10:00 ~ 13:00', location: '신촌' },
        { date: '2025-1-15', title: 'Event 8', color: 'brown', time: '10:00 ~ 13:00', location: '건대' },
        { date: '2025-1-17', title: 'Event 9', color: 'black', time: '10:00 ~ 13:00', location: '홍대' },
        { date: '2025-1-19', title: 'Event 10 asdfasdfsadf', color: 'gray', time: '10:00 ~ 13:00', location: '강남' },
        { date: '2025-1-19', title: 'Event 10', color: 'gray', time: '10:00 ~ 13:00', location: '강남' },
        { date: '2025-1-19', title: 'Event 10', color: 'gray', time: '10:00 ~ 13:00', location: '강남' },
        { date: '2025-1-30', title: 'Event 10', color: 'gray', time: '10:00 ~ 13:00', location: '강남' },
    ]);

    const handleDateClick = (date) => {
        console.log(date);
        const dayEvents = events.filter((event) => event.date === date);
        if (dayEvents.length > 0) {
            // 일정이 있으면 이벤트 리스트 모달 띄우기
        } else {
            // 일정이 없으면 추가 페이지로 이동
            window.location.href = `/add-event?date=${date}`;
        }
    };

    const handleSwipe = (direction) => {
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
            onTouchStart={(e) => (e.currentTarget.startX = e.touches[0].clientX)}
            onTouchEnd={(e) => {
                const deltaX = e.changedTouches[0].clientX - e.currentTarget.startX;
                if (deltaX > 50) handleSwipe('left');
                else if (deltaX < -50) handleSwipe('right');
            }}
        >
            <Calendar
                events={events}
                onDateClick={handleDateClick}
                currentDate={currentDate}
            />
        </div>
    );
};

export default MyCalendar;