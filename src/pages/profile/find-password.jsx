import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findPassword } from '../../apis/auth';

const FindPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const onClickfindPassword = async email => {
        const res = await findPassword(email);
        if (res) {
            navigate(-1);
        }
    };

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-4rem)] w-full">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b w-full">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">비밀번호 찾기</h1>
                <div className="w-6"></div>
            </div>

            {/* 비밀번호 찾기 */}
            <div className="flex flex-col justify-center items-center h-[calc(100vh-8rem)]">
                <img src="/images/logo-bg.png" alt="logo" className="w-[85%] mx-auto" />
                <div className="flex flex-col w-[85%] mx-auto gap-4 mt-10">
                    <input
                        type="email"
                        placeholder="이메일을 입력해주세요"
                        className="border border-gray-300 p-2"
                        onChange={e => setEmail(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white py-2" onClick={() => onClickfindPassword(email)}>
                        비밀번호 찾기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FindPassword;
