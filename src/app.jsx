import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../src/styles/globals.css';

/* components */
import BottomTab from './components/bottom-tab';

/* pages */
import MyCalendar from './pages/my-calendar';
import ShareCalendar from './pages/share-calendar';
import Profile from './pages/profile';

const App = () => {
    return (
        <div className="container-col">
            <BrowserRouter>
                <Routes>
                    <Route path="/my-calendar" element={<MyCalendar />} />
                    <Route path="/" element={<ShareCalendar />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
                <BottomTab />
            </BrowserRouter>
        </div>
    );
};

export default App;
