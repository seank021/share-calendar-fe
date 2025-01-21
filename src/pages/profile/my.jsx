import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../../apis/api';
import Loading from '../loading';
import '../../styles/globals.css';

const My = ({ setIsLoggedIn }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo();
                setUserInfo({
                    email: user.email,
                    displayName: user.displayName,
                });
            } catch (error) {
                alert(error.message);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [setIsLoggedIn]);

    const onClickLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('accessToken');
    };

    if (loading) {
        return <Loading message="사용자 정보를 불러오는 중..." />;
    }

    return (
        <div className="container-col">
            <h1>My</h1>
            {userInfo ? (
                <div>
                    <p>Email: {userInfo.email}</p>
                    <p>Nickname: {userInfo.displayName}</p>
                </div>
            ) : (
                <p>No user information available</p>
            )}
            <button onClick={onClickLogout}>Logout</button>
        </div>
    );
};

export default My;
