import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../apis/api';

const ChangePassword = () => {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChange = async (currentPassword, newPassword, confirmPassword) => {
        const result = await changePassword(currentPassword, newPassword, confirmPassword);
        if (result) {
            alert('비밀번호가 성공적으로 변경되었습니다.');
            navigate(-1);
        }
    };

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-4rem)] w-full">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">비밀번호 변경</h1>
                <div className="w-6"></div>
            </div>

            <div className="flex flex-col gap-3 px-6 py-3 mt-4">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="current-password" className="text-md">
                        현재 비밀번호
                    </label>
                    <input
                        type="password"
                        id="current-password"
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label htmlFor="new-password" className="text-md">
                        새 비밀번호
                    </label>
                    <input
                        type="password"
                        id="new-password"
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label htmlFor="confirm-password" className="text-md">
                        새 비밀번호 확인
                    </label>
                    <input
                        type="password"
                        id="confirm-password"
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>

                {/* 변경 및 취소 버튼 */}
                <div className="flex w-full items-center justify-center py-3 gap-3 mt-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-4 py-2 border rounded text-gray-500 hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => handleChange(currentPassword, newPassword, confirmPassword)}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        변경
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
