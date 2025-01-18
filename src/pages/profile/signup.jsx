import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/globals.css';
import { signup } from '../../apis/api';

const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_, setPassword_] = useState('');
    const [nickname, setNickname] = useState('');

    const onClickSignup = async () => {
        const user = await signup(email, password, password_, nickname);
        if (user) {
            console.log(user);
            localStorage.setItem('accessToken', user.accessToken);
            navigate('/');
        }
    };

    return (
        <div className="container-col justify-center items-center h-[calc(100vh-4rem)]">
            <img src="/images/logo-bg.png" alt="logo" className="w-[85%] mx-auto" />
            <div className="flex flex-col w-[85%] mx-auto gap-4 mt-10">
                <input
                    type="email"
                    placeholder="이메일을 입력해주세요"
                    className="border border-gray-300 p-2"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    className="border border-gray-300 p-2"
                    onChange={e => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    className="border border-gray-300 p-2"
                    onChange={e => setPassword_(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="사용하실 닉네임을 입력해주세요"
                    className="border border-gray-300 p-2"
                    onChange={e => setNickname(e.target.value)}
                />
                <button onClick={onClickSignup} className="bg-blue-500 text-white py-2">
                    회원가입
                </button>
            </div>
            <h2 className="text-center mt-4 underline text-gray-400 text-sm" onClick={() => navigate('/login')}>
                로그인 화면으로
            </h2>
        </div>
    );
};

export default Signup;
