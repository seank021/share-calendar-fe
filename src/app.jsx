import React, { useState } from 'react';
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
import My from './pages/profile/my';
import Login from './pages/profile/login';
import Signup from './pages/profile/signup';
import EditProfile from './pages/profile/edit-profile';
import Requests from './pages/profile/requests';
import Setting from './pages/profile/setting';
import Friends from './pages/profile/friends';
import ChangePassword from './pages/profile/change-password';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className="container-col">
            <BrowserRouter>
                <Routes>
                    <Route path="/my-calendar" element={<MyCalendar />} />
                    <Route path="/add-event" element={<AddEvent />} />
                    <Route path="/edit-event" element={<EditEvent />} />

                    <Route path="/" element={<ShareCalendar />} />

                    <Route path="/profile" element={<Profile />} />
                    <Route path="/my" element={<My setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/setting" element={<Setting setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/change-password" element={<ChangePassword />} />

                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
                <BottomTab />
            </BrowserRouter>
        </div>
    );
};

export default App;
