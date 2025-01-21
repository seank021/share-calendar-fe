import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/calendar';
import EventModal from '../../components/event-modal';
import Loading from '../loading';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { app, db } from '../../firebase';

const MyCalendar = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/profile');
        }
    }, [navigate]);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            if (user) {
                setCurrentUser(user);
            } else {
                alert('로그인이 필요합니다.');
                navigate('/login');
            }
        });

        return () => unsubscribeAuth(); // 컴포넌트 언마운트 시 리스너 해제
    }, [navigate]);

    useEffect(() => {
        if (!currentUser) return;

        const eventsRef = collection(db, 'users', currentUser.uid, 'events');

        // Firestore에서 데이터 가져오기
        const unsubscribe = onSnapshot(eventsRef, snapshot => {
            const fetchedEvents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // 이벤트를 시간 순서대로 정렬
            const sortedEvents = fetchedEvents.sort((a, b) => {
                const timeA = parseInt(a.time.split(' ~ ')[0].replace(':', ''), 10);
                const timeB = parseInt(b.time.split(' ~ ')[0].replace(':', ''), 10);
                return timeA - timeB;
            });

            setEvents(sortedEvents);
            setLoading(false);
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 리스너 해제
    }, [currentUser]);

    const [lastClickTimestamp, setLastClickTimestamp] = useState(0);
    const doubleClickThreshold = 300; // 밀리초 기준

    const handleDateClick = date => {
        const currentTimestamp = new Date().getTime();
        const dayEvents = events.filter(event => event.date === date);

        if (currentTimestamp - lastClickTimestamp < doubleClickThreshold) {
            navigate(`/add-event?date=${date}`);
        } else {
            if (dayEvents.length > 0) {
                setSelectedDate({ date, events: dayEvents }); // 이미 정렬된 상태
                setShowModal(true);
            } else {
                console.log('더블 클릭으로 이벤트 추가 페이지로 이동 가능');
            }
        }
        setLastClickTimestamp(currentTimestamp);
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

    if (loading) {
        return <Loading message="일정을 불러오는 중..." />;
    }

    return (
        <div
            onTouchStart={e => (e.currentTarget.startX = e.touches[0].clientX)}
            onTouchEnd={e => {
                const deltaX = e.changedTouches[0].clientX - e.currentTarget.startX;
                if (deltaX > 50) handleSwipe('left');
                else if (deltaX < -50) handleSwipe('right');
            }}
            className="select-none"
        >
            <Calendar events={events} onDateClick={handleDateClick} currentDate={currentDate} />
            {showModal && selectedDate && (
                <EventModal
                    date={selectedDate.date}
                    events={selectedDate.events}
                    onClose={() => setShowModal(false)}
                    onAddEvent={() => navigate(`/add-event?date=${selectedDate.date}`)}
                />
            )}
        </div>
    );
};

export default MyCalendar;
