import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/globals.css';

/* icons */
import calendar from '/icons/calendar.svg';
import calendarColor from '/icons/calendar-color.svg';
import shareCalendar from '/icons/share-calendar.svg';
import shareCalendarColor from '/icons/share-calendar-color.svg';
import profile from '/icons/profile.svg';
import profileColor from '/icons/profile-color.svg';

const BottomTab = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = path => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken && (path === '/' || path === '/my-calendar')) {
            alert('You must be logged in to access this page.');
            navigate('/profile');
        } else {
            navigate(path);
        }
    };

    return (
        <div className="bottom-tab">
            <div
                onClick={() => handleNavigation('/my-calendar')}
                style={{
                    textDecoration: 'none',
                    color:
                        location.pathname === '/my-calendar' ||
                        location.pathname === '/add-event' ||
                        location.pathname === '/edit-event'
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
                        location.pathname === '/edit-event'
                            ? calendarColor
                            : calendar
                    }
                    alt="My Calendar"
                    style={{ width: '24px', height: '24px' }}
                />
                <div className="text-sm">내 캘린더</div>
            </div>
            <div
                onClick={() => handleNavigation('/')}
                style={{
                    textDecoration: 'none',
                    color: location.pathname === '/' ? '#007BFF' : '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                <img
                    src={location.pathname === '/' ? shareCalendarColor : shareCalendar}
                    alt="Share Calendar"
                    style={{ width: '24px', height: '24px' }}
                />
                <div className="text-sm">공유 캘린더</div>
            </div>
            <div
                onClick={() => handleNavigation('/profile')}
                style={{
                    textDecoration: 'none',
                    color:
                        location.pathname === '/profile' ||
                        location.pathname === '/login' ||
                        location.pathname === '/signup'
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
                        location.pathname === '/signup'
                            ? profileColor
                            : profile
                    }
                    alt="Profile"
                    style={{ width: '24px', height: '24px' }}
                />
                <div className="text-sm">프로필</div>
            </div>
        </div>
    );
};

export default BottomTab;
