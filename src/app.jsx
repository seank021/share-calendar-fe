import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../src/styles/globals.css';

/* components */
import BottomTab from './components/bottom-tab';

/* pages */
import MyCalendar from './pages/my-calendar';
import AddEvent from './pages/my-calendar/add-event';
import EditEvent from './pages/my-calendar/edit-event';
import ShareCalendar from './pages/share-calendar';
import Profile from './pages/profile';
import Login from './pages/profile/login';
import Signup from './pages/profile/signup';
import EditProfile from './pages/profile/edit-profile';
import Alarms from './pages/profile/alarms';
import Setting from './pages/profile/setting';
import Friends from './pages/profile/friends';

const App = () => {
    return (
        <div className="container-col">
            <BrowserRouter>
                <Routes>
                    <Route path="/my-calendar" element={<MyCalendar />} />
                    <Route path="/add-event" element={<AddEvent />} />
                    <Route path="/edit-event" element={<EditEvent />} />

                    <Route path="/" element={<ShareCalendar />} />

                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/alarms" element={<Alarms />} />
                    <Route path="/setting" element={<Setting />} />
                    <Route path="/friends" element={<Friends />} />

                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
                <BottomTab />
            </BrowserRouter>
        </div>
    );
};

export default App;
