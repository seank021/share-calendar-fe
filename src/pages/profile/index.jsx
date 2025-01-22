import React, { useEffect, useState } from 'react';
import { isUserLoggedIn } from '../../apis/auth';

/* pages */
import Login from './login';
import My from './my';
import Loading from '../loading';

const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const isUser = await isUserLoggedIn();
                setIsLoggedIn(isUser);
            } catch {
                setIsLoggedIn(false); // 로그인 상태 확인 실패 시 로그아웃 상태로 설정
            } finally {
                setLoading(false); // 비동기 작업 완료 후 로딩 상태 해제
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <Loading message="정보를 불러오는 중..." />;
    }

    return isLoggedIn ? <My /> : <Login />;
};

export default Profile;
