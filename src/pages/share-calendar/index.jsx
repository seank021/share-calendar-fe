import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShareCalendar = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('Please login first');
            navigate('/profile');
        }
    }, [navigate]);

    return (
        <div>
            <h1>Share Calendar</h1>
        </div>
    );
};

export default ShareCalendar;
