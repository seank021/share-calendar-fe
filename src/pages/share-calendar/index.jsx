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

    const handleFriendClick = (friendEmail, friendDisplayName) => {
        navigate(`/share-calendar/${friendEmail}`, { state: { friendDisplayName } });
    };

    if (loading) {
        return <Loading message="정보를 불러오는 중..." />;
    }

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-4rem)] w-full">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-center px-4 py-3 border-b">
                <h1 className="text-lg font-bold">공유 캘린더</h1>
            </div>

            <div className="flex flex-col gap-3 p-4 overflow-y-auto">
                {friends.map((friend, index) => (
                    <div key={index} className="flex items-center px-2 py-3 border rounded-lg justify-between shadow-sm" onClick={() => handleFriendClick(friend.email, friend.displayName)}>
                        <div className="flex items-center gap-4">
                            <img
                                src={friend.photoURL || '/images/no-profile.png'}
                                alt="profile"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="text-md font-semibold">{friend.displayName}</p>
                                <p className="text-sm text-gray-400">{friend.email}</p>
                            </div>
                        </div>
                        <img
                            src="/icons/chevron-right.svg"
                            alt="보기"
                            className="w-7 h-7 mr-1"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShareCalendar;
