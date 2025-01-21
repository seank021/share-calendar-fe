import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, searchUsersByEmail, getTop3Friends, requestForFriend, getUserInfoByEmail } from '../../apis/api';
import Loading from '../loading';
import '../../styles/globals.css';

const My = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const [searchEmail, setSearchEmail] = useState('');
    const [searchedFriends, setSearchedFriends] = useState([]);
    const [isSearched, setIsSearched] = useState(false); // 검색 버튼 클릭 여부 상태

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo();
                setUserInfo(user);
            } catch (error) {
                alert(error.message);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [setIsLoggedIn]);

    const onClickSetting = () => {
        navigate('/setting');
    };

    const onEditProfile = () => {
        navigate('/edit-profile');
    };

    const [friends, setFriends] = useState([]);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const rawFriends = await getTop3Friends();

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

    const onClickSearchFriends = async () => {
        try {
            if (!searchEmail) {
                alert('이메일을 입력해주세요.');
                return;
            }

            setIsSearched(true); // 검색 버튼 클릭 상태 업데이트
            const rawUsers = await searchUsersByEmail(searchEmail);
            const usersWithNames = await Promise.all(
                rawUsers.map(async user => {
                    const userInfo = await getUserInfoByEmail(user.email);
                    return {
                        ...user,
                        displayName: userInfo?.displayName || '',
                    };
                })
            );

            setSearchedFriends(usersWithNames);
        } catch (error) {
            alert(error.message);
        }
    };

    const onClickLogo = () => {
        navigate('/');
    };

    const onClickRequests = () => {
        navigate('/requests');
    };

    const onClickMoreFriends = () => {
        navigate('/friends');
    };

    const onClickAddFriend = async (email, uid) => {
        if (window.confirm('친구 요청을 보내시겠습니까?')) {
            try {
                await requestForFriend(email, uid);
                alert('친구 요청을 보냈습니다.');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    if (loading) {
        return <Loading message="사용자 정보를 불러오는 중..." />;
    }

    return (
        userInfo && (
            <div className="container-col w-[90%] py-4 mx-auto gap-6">
                <div className="flex justify-between items-center">
                    <img src="/images/logo-title.png" alt="logo" className="h-[45px]" onClick={onClickLogo} />
                    <div className="flex items-center space-x-3">
                        <img
                            src="icons/request.svg"
                            alt="request"
                            className="w-[27px] h-[27px]"
                            onClick={onClickRequests}
                        />
                        <img
                            src="/icons/setting.svg"
                            alt="setting"
                            className="w-[27px] h-[27px]"
                            onClick={onClickSetting}
                        />
                    </div>
                </div>

                {/* 사용자 정보 */}
                <div className="flex items-center space-x-3">
                    {userInfo.photoURL ? (
                        <img src={userInfo.photoURL} alt="profile" className="w-[80px] h-[80px] rounded-full" />
                    ) : (
                        <img src="/images/no-profile.png" alt="profile" className="w-[80px] h-[80px] rounded-full" />
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-3">
                            <p className="text-2xl font-bold">{userInfo.displayName}</p>
                            <img
                                src="/icons/edit.svg"
                                alt="edit"
                                className="w-[20px] h-[20px]"
                                onClick={onEditProfile}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <p className="text-gray-500">{userInfo.email}</p>
                            {userInfo.emailVerified && (
                                <img src="/icons/check-green.svg" alt="verified" className="w-[20px] h-[20px]" />
                            )}
                        </div>
                    </div>
                </div>

                {/* 친구 */}
                <div className="flex flex-col space-y-4 px-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <p className="text-xl font-bold">친구</p>
                            <p className="text-gray-500">{friends ? `(${friends.length})` : '(0)'}</p>
                        </div>
                        <img
                            src="/icons/chevron-right.svg"
                            alt="arrow"
                            className="w-[24px] h-[24px]"
                            onClick={onClickMoreFriends}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        {friends && friends.length > 0 ? (
                            friends.map(
                                (
                                    friend // 상위 3명
                                ) => (
                                    <div key={friend.email} className="flex flex-col items-center">
                                        <img
                                            src={friend.photoURL || '/images/no-profile.png'}
                                            alt="friend"
                                            className="w-[50px] h-[50px] rounded-full"
                                        />
                                        <p className="text-gray-500 text-sm">{friend.displayName}</p>
                                    </div>
                                )
                            )
                        ) : (
                            <p className="text-gray-400 ml-2 text-sm">친구가 없습니다. 친구를 추가해보세요!</p>
                        )}
                    </div>
                </div>

                {/* 친구 추가 */}
                <div className="flex flex-col space-y-4 px-2 mt-4">
                    <p className="text-xl font-bold">친구 추가</p>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="이메일로 친구를 검색해보세요"
                            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
                            value={searchEmail}
                            onChange={e => setSearchEmail(e.target.value)}
                        />
                        <button
                            className="w-16 h-10 bg-blue-500 text-white rounded-md text-sm"
                            onClick={onClickSearchFriends}
                        >
                            검색
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px]">
                        {isSearched && searchedFriends.length === 0 ? ( // 검색 버튼 클릭 이후에만 결과 표시
                            <p className="text-gray-400 ml-2 text-sm">검색 결과가 없습니다.</p>
                        ) : (
                            searchedFriends.map(friend => (
                                <div key={friend.email} className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center gap-2">
                                        <img
                                            src={friend.photoURL || '/images/no-profile.png'}
                                            alt="friend"
                                            className="w-[50px] h-[50px] rounded-full"
                                        />
                                        <div className="flex flex-col items-start justify-center">
                                            <p className="text-sm text-center">{friend.displayName}</p>
                                            <p className="text-sm text-center">{friend.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        className="text-sm font-bold text-blue-500 mr-1"
                                        onClick={() => onClickAddFriend(friend.email, friend.uid)}
                                    >
                                        추가
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default My;
