import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../src/styles/globals.css';

/* components */
import BottomTab from './components/bottom-tab';

/* pages */
import MyCalendar from './pages/my-calendar';
import AddEvent from './pages/my-calendar/add-event';
import ShareCalendar from './pages/share-calendar';
import Profile from './pages/profile';
import Login from './pages/profile/login';
import Signup from './pages/profile/signup';

const App = () => {
    return (
        <div className="container-col">
            <BrowserRouter>
                <Routes>
                    <Route path="/my-calendar" element={<MyCalendar />} />
                    <Route path="/add-event" element={<AddEvent />} />
                    <Route path="/" element={<ShareCalendar />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
                <BottomTab />
            </BrowserRouter>
        </div>
    );
};

export default App;
