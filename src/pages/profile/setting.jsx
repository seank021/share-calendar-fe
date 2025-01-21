import React from 'react';
import { useNavigate } from 'react-router-dom';

const Setting = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            setIsLoggedIn(false);
            localStorage.removeItem('accessToken');
            navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
        }
    };

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-4rem)] w-full">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">
                    환경설정
                </h1>
                <div className="w-6"></div>
            </div>
            {/* 로그아웃 버튼 */}
            <div className="flex items-center justify-between px-4 py-3 border-b" onClick={handleLogout}>
                <p className="text-md">로그아웃</p>
                <img src="/icons/chevron-right.svg" alt="로그아웃" className="w-6 h-6" />
            </div>
        </div>
    );
};

export default Setting;
