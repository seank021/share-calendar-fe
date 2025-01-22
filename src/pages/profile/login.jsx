import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/globals.css';
import { login } from '../../apis/api';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onClickLogin = async () => {
        const user = await login(email, password);
        if (user) {
            navigate('/');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
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
                <button onClick={onClickLogin} className="bg-blue-500 text-white py-2">
                    로그인
                </button>
            </div>
            <h2 className="text-center mt-6 underline text-gray-400 text-sm" onClick={() => navigate('/find-password')}>
                비밀번호를 잊으셨나요?
            </h2>
            <h2 className="text-center mt-2 underline text-gray-400 text-sm" onClick={() => navigate('/signup')}>
                계정이 없다면?
            </h2>
        </div>
    );
};

export default Login;
