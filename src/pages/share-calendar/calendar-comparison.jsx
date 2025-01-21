import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserEvents } from '../../apis/api';
import Loading from '../loading';

const CalendarComparison = () => {
    const { friendEmail } = useParams(); // URL 파라미터에서 friendEmail 가져오기
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

    if (loading) {
        return <Loading message="일정을 불러오는 중..." />;
    }

    return (
        console.log('friendEmail:', friendEmail),
        console.log('myEvents:', myEvents),
        console.log('friendEvents:', friendEvents),
        (
            <div>
                <div>
                    <button onClick={() => handleDateChange(-1)}>이전 날짜</button>
                    <button onClick={() => handleDateChange(1)}>다음 날짜</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h2>내 일정</h2>
                        {myEvents.map(event => (
                            <div key={event.id}>
                                <p>{event.title}</p>
                                <p>{event.time}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2>친구 일정</h2>
                        {friendEvents.map(event => (
                            <div key={event.id}>
                                <p>{event.title}</p>
                                <p>{event.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    );
};

export default CalendarComparison;
