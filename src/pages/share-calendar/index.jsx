import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends, getUserInfoByEmail } from '../../apis/api';
import Loading from '../loading';

const ShareCalendar = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/profile');
        }
    }, [navigate]);

    const [loading, setLoading] = useState(true);

    const [friends, setFriends] = useState([]);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const rawFriends = await getFriends();

                const friendsWithNames = await Promise.all(
                    rawFriends.map(async request => {
                        const userInfo = await getUserInfoByEmail(request.email);
                        return {
                            ...request,
                            displayName: userInfo?.displayName || '',
                        };
                    })
                );

                setFriends(friendsWithNames);
                setLoading(false);
            } catch (error) {
                alert(error.message);
            }
        };

        fetchFriends();
    }, []);

    const handleFriendClick = friendEmail => {
        navigate(`/share-calendar/${friendEmail}`);
    };

    if (loading) {
        return <Loading message="정보를 불러오는 중..." />;
    }

    return (
        <div>
            <h1>공유 캘린더</h1>
            <ul>
                {friends.map(friend => (
                    <li key={friend.email} onClick={() => handleFriendClick(friend.email)}>
                        {friend.displayName} -{friend.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShareCalendar;
