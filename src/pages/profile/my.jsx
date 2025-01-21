import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../../apis/api';
import Loading from '../loading';
import '../../styles/globals.css';
import { useNavigate } from 'react-router-dom';

const My = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo();
                console.log('user:', user);
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

    const onClickLogo = () => {
        navigate('/');
    };

    const onClickAlarm = () => {
        navigate('/alarms');
    };

    const onClickMoreFriends = () => {
        navigate('/friends');
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
                        {FRIENDS.map(
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
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default My;
