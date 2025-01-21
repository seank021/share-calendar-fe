import React, { useEffect, useState } from 'react';
import { getUserInfo, searchUsersByEmail } from '../../apis/api';
import Loading from '../loading';
import '../../styles/globals.css';
import { useNavigate } from 'react-router-dom';

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

    const FRIENDS = [
        // 상위 3명만 가져오는 api 필요
        {
            displayName: '세안',
            email: 'aaaaa@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안2',
            email: 'bbbbb@google.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안3',
            email: 'ccccc@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
    ];

    const onClickSearchFriends = async () => {
        try {
            if (!searchEmail) {
                alert('이메일을 입력해주세요.');
                return;
            }

            setIsSearched(true); // 검색 버튼 클릭 상태 업데이트
            const users = await searchUsersByEmail(searchEmail);
            console.log(users);
            setSearchedFriends(users);
        } catch (error) {
            alert(error.message);
        }
    };

    const onClickLogo = () => {
        navigate('/');
    };

    const onClickAlarm = () => {
        navigate('/alarms');
    };

    const onClickMoreFriends = () => {
        navigate('/friends');
    };

    const onClickAddFriend = async (email, uid) => {
        if (window.confirm('친구 요청을 보내시겠습니까?')) {
            console.log('내 정보', userInfo.email, userInfo.uid);
            // 친구 추가 api 필요
            console.log(email, uid);
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
                        <img src="icons/alarm.svg" alt="alarm" className="w-[27px] h-[27px]" onClick={onClickAlarm} />
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
                            <p className="text-gray-500">({FRIENDS.length})</p>
                        </div>
                        <img
                            src="/icons/chevron-right.svg"
                            alt="arrow"
                            className="w-[24px] h-[24px]"
                            onClick={onClickMoreFriends}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        {FRIENDS && FRIENDS.length > 0 ? (
                            FRIENDS.map(
                                (
                                    friend // 상위 3명
                                ) => (
                                    <div key={friend.email} className="flex flex-col items-center gap-1">
                                        <img
                                            src={friend.photoURL}
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
                            className="w-full h-10 px-3 border border-gray-300 rounded-md"
                            value={searchEmail}
                            onChange={e => setSearchEmail(e.target.value)}
                        />
                        <button className="w-20 h-10 bg-blue-500 text-white rounded-md" onClick={onClickSearchFriends}>
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
                                            <p className="text-gray-500 text-sm text-center">{friend.nickname}</p>
                                            <p className="text-gray-500 text-sm text-center">{friend.email}</p>
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
