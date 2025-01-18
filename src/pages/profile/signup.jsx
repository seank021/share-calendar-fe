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
        <div className="container-col min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-center py-4">Sign Up</h1>
            <div className="flex flex-col w-[85%] mx-auto gap-4">
                <input
                    type="email"
                    placeholder="email"
                    className="border border-gray-300 p-2"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    className="border border-gray-300 p-2"
                    onChange={e => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password_"
                    className="border border-gray-300 p-2"
                    onChange={e => setPassword_(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="nickname"
                    className="border border-gray-300 p-2"
                    onChange={e => setNickname(e.target.value)}
                />
                <button
                    onClick={onClickSignup}
                    className="bg-blue-500 text-white py-2"
                >
                    Signup
                </button>
            </div>
            <h2 className="text-center mt-4" onClick={() => navigate('/login')}>
                Login
            </h2>
        </div>
    );
};

export default Signup;
