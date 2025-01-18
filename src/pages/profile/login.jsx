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
            console.log(user);
            localStorage.setItem('accessToken', user.accessToken);
            navigate('/');
        }
    };

    return (
        <div className="container-col">
            <h1 className="text-3xl font-bold text-center py-4">Login</h1>
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
                <button
                    onClick={onClickLogin}
                    className="bg-blue-500 text-white py-2"
                >
                    Login
                </button>
            </div>
            <h2 className="text-center mt-4" onClick={() => navigate('/signup')}>
                Sign up
            </h2>
        </div>
    );
};

export default Login;
