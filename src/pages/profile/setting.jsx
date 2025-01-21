import React from 'react';
import { useNavigate } from 'react-router-dom';

const Setting = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('accessToken');
        navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    };

    return (
        <div>
            <h1>Setting</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Setting;
