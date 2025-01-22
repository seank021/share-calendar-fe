import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/globals.css';

/* icons */
import calendar from '/icons/calendar.svg';
import calendarColor from '/icons/calendar-color.svg';
import shareCalendar from '/icons/share-calendar.svg';
import shareCalendarColor from '/icons/share-calendar-color.svg';
import profile from '/icons/profile.svg';
import profileColor from '/icons/profile-color.svg';
import { isUserLoggedIn } from '../apis/api';

const BottomTab = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = async path => {
        try {
            const isUser = await isUserLoggedIn();
            if (!isUser && (path === '/' || path === '/my-calendar')) {
                alert('로그인이 필요합니다.');
                navigate('/profile');
            } else {
                navigate(path);
            }
        } catch (error) {
            alert('로그인이 필요합니다.');
            navigate('/profile'); // 로그인 상태 확인 실패 시 프로필로 이동
        }
    };

    return (
        <div className="bottom-tab select-none">
            <div
                onClick={() => handleNavigation('/my-calendar')}
                style={{
                    textDecoration: 'none',
                    color:
                        location.pathname === '/my-calendar' ||
                        location.pathname === '/add-event' ||
                        location.pathname === '/edit-event' ||
                        location.pathname.includes('/calendar-timeline')
                            ? '#007BFF'
                            : '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                <img
                    src={
                        location.pathname === '/my-calendar' ||
                        location.pathname === '/add-event' ||
                        location.pathname === '/edit-event' ||
                        location.pathname.includes('/calendar-timeline')
                            ? calendarColor
                            : calendar
                    }
                    alt="My Calendar"
                    style={{ width: '24px', height: '24px' }}
                    className="select-none"
                />
                <div className="text-sm select-none">내 캘린더</div>
            </div>
            <div
                onClick={() => handleNavigation('/')}
                style={{
                    textDecoration: 'none',
                    color:
                        location.pathname === '/' || location.pathname.includes('/share-calendar') ? '#007BFF' : '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                <img
                    src={
                        location.pathname === '/' || location.pathname.includes('/share-calendar')
                            ? shareCalendarColor
                            : shareCalendar
                    }
                    alt="Share Calendar"
                    style={{ width: '24px', height: '24px' }}
                    className="select-none"
                />
                <div className="text-sm select-none">공유 캘린더</div>
            </div>
            <div
                onClick={() => handleNavigation('/profile')}
                style={{
                    textDecoration: 'none',
                    color:
                        location.pathname === '/profile' ||
                        location.pathname === '/login' ||
                        location.pathname === '/signup' ||
                        location.pathname === '/edit-profile' ||
                        location.pathname === '/friends' ||
                        location.pathname === '/setting' ||
                        location.pathname === '/my' ||
                        location.pathname === '/requests' ||
                        location.pathname === '/change-password' ||
                        location.pathname === '/find-password'
                            ? '#007BFF'
                            : '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                <img
                    src={
                        location.pathname === '/profile' ||
                        location.pathname === '/login' ||
                        location.pathname === '/signup' ||
                        location.pathname === '/edit-profile' ||
                        location.pathname === '/friends' ||
                        location.pathname === '/setting' ||
                        location.pathname === '/my' ||
                        location.pathname === '/requests' ||
                        location.pathname === '/change-password' ||
                        location.pathname === '/find-password'
                            ? profileColor
                            : profile
                    }
                    alt="Profile"
                    style={{ width: '24px', height: '24px' }}
                    className="select-none"
                />
                <div className="text-sm select-none">프로필</div>
            </div>
        </div>
    );
};

export default BottomTab;
