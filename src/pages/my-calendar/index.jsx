import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/calendar';
import EventModal from '../../components/event-modal';
import Loading from '../loading';
import dayjs from 'dayjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { app, db } from '../../firebase';
import { isUserLoggedIn } from '../../apis/auth';

const MyCalendar = () => {
    const navigate = useNavigate();
    useEffect(() => {
        try {
            const fetchUser = async () => {
                const isUser = await isUserLoggedIn();
                if (!isUser) {
                    alert('로그인이 필요합니다.');
                    navigate('/profile');
                }
            };

            fetchUser();
        } catch (error) {
            alert('로그인이 필요합니다.');
            navigate('/profile'); // 로그인 상태 확인 실패 시 프로필로 이동
        }
    }, [navigate]);

    const [currentDate, setCurrentDate] = useState(dayjs());
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
            }
        });

        return () => unsubscribeAuth(); // 컴포넌트 언마운트 시 리스너 해제
    }, [navigate]);

    useEffect(() => {
        if (!currentUser) return;

        const eventsRef = collection(db, 'users', currentUser.email, 'events');

        // Firestore에서 데이터 가져오기
        const unsubscribe = onSnapshot(eventsRef, snapshot => {
            const fetchedEvents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // 일정을 시간 순서대로 정렬
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
        const currentTimestamp = dayjs().valueOf();
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        const dayEvents = events.filter(event => dayjs(event.date).format('YYYY-MM-DD') === formattedDate);

        if (currentTimestamp - lastClickTimestamp < doubleClickThreshold) {
            navigate(`/add-event?date=${date}`);
        } else {
            if (dayEvents.length > 0) {
                setSelectedDate({ date: formattedDate, events: dayEvents }); // 이미 정렬된 상태
                setShowModal(true);
            } else {
                console.log('더블 클릭으로 일정 추가 페이지로 이동 가능');
            }
        }
        setLastClickTimestamp(currentTimestamp);
    };

    const handleSwipe = direction => {
        if (!showModal) {
            const newDate = direction === 'left' ? currentDate.subtract(1, 'month') : currentDate.add(1, 'month');
            setCurrentDate(newDate);
        }
    };

    if (loading) {
        return <Loading message="일정을 불러오는 중..." />;
    }

    return (
        <div
            onTouchStart={e => (e.currentTarget.startX = e.touches[0].clientX)}
            onTouchEnd={e => {
                const deltaX = e.changedTouches[0].clientX - e.currentTarget.startX;
                if (deltaX > 100) handleSwipe('left');
                else if (deltaX < -100) handleSwipe('right');
            }}
            className="select-none"
        >
            <Calendar events={events} onDateClick={handleDateClick} currentDate={currentDate.toDate()} />
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
