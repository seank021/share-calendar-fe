import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends, getUserInfoByEmail, isUserLoggedIn } from '../../apis/api';
import Loading from '../loading';

const ShareCalendar = () => {
    const navigate = useNavigate();
    useEffect(() => {
        try {
            const fetchUser = async () => {
                const isUser = await isUserLoggedIn();
                if (!isUser) {
                    alert('로그인이 필요합니다.');
                    navigate('/profile');
                }
            };

            fetchUser();
        } catch (error) {
            alert('로그인이 필요합니다.');
            navigate('/profile'); // 로그인 상태 확인 실패 시 프로필로 이동
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
        <div className="flex flex-col bg-gray-100 h-[calc(100vh-4rem)] w-full">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-center px-4 py-3 bg-white shadow-md sticky top-0 z-10">
                <img
                    src="/images/logo-only.png"
                    alt="뒤로가기"
                    className="w-6 h-6 cursor-pointer mr-2"
                    onClick={() => navigate('/')}
                />
                <h1 className="text-lg font-bold text-gray-800">공유 캘린더</h1>
            </div>

            <div className="flex flex-col gap-4 p-4 overflow-y-auto">
                {friends &&
                    friends.map((friend, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-4 py-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
                            onClick={() => handleFriendClick(friend.email, friend.displayName)}
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={friend.photoURL || '/images/no-profile.png'}
                                    alt="profile"
                                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                                />
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">{friend.displayName}</p>
                                    <p className="text-sm text-gray-500">{friend.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button className="border-[1px] border-black text-white rounded-full p-2 shadow-md hover:bg-blue-600 transition-colors">
                                    <img src="/icons/chevron-right.svg" alt="보기" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                {friends.length === 0 && (
                    <div className="flex items-center text-center text-md justify-center mt-10 text-gray-400">
                        <p>
                            친구가 없습니다.
                            <br />
                            "프로필" 탭에서 친구를 추가해보세요!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareCalendar;
