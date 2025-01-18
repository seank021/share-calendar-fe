import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyCalendar = () => {
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
            <h1>My Calendar</h1>
        </div>
    );
};

export default MyCalendar;
