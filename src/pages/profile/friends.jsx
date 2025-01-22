import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends, deleteFriend } from '../../apis/friend';
import { getUserInfoByEmail } from '../../apis/user';

const Friends = () => {
    const navigate = useNavigate();
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
            } catch (error) {
                alert(error.message);
            }
        };

        fetchFriends();
    }, []);

    const onClickDeleteFriend = async (uid, email) => {
        if (window.confirm('친구를 삭제하시겠습니까?')) {
            const result = await deleteFriend(uid, email);
            if (result) {
                alert('친구를 삭제했습니다.');
                window.location.reload();
            }
        }
    };

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-4rem)] w-full">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">친구</h1>
                <div className="w-6"></div>
            </div>

            <p className="px-5 mt-4 text-sm text-gray-400">
                친구가 되면 서로의 일정이 자동으로 공유됩니다.
                <br />
                한쪽에서 친구를 삭제하면 일정 공유도 함께 해제돼요.
            </p>

            {/* 친구 목록 */}
            <div className="flex flex-col gap-2 p-4 overflow-y-auto">
                {friends.map((friend, index) => (
                    <div key={index} className="flex items-center px-2 py-3 border rounded-lg justify-between">
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
                        <button
                            className="text-sm font-bold text-red-500 mr-1"
                            onClick={() => onClickDeleteFriend(friend.uid, friend.email)}
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Friends;
