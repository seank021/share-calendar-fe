import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebase';
import Loading from '../loading';
import { updateProfileInfo } from '../../apis/api';

const EditProfile = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const [nickname, setNickname] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setNickname(user.displayName || '');
                setPhotoURL(user.photoURL || '');
                setEmail(user.email || '');
                setLoading(false);
            } else {
                alert('로그인이 필요합니다.');
                navigate('/login');
            }
        });

        // 컴포넌트 언마운트 시 리스너 해제
        return () => unsubscribe();
    }, [auth, navigate]);

    const editProfilePhoto = () => {
        console.log('프로필 사진 수정');
    };

    const handleSave = async () => {
        try {
            const result = await updateProfileInfo(photoURL, nickname);
            if (result) {
                alert('프로필이 수정되었습니다.');
                navigate(-1);
            } else {
                alert('프로필 수정에 실패했습니다.');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-3.5rem)]">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">프로필 수정</h1>
                <div className="w-6"></div>
            </div>

            {/* 프로필 수정 폼 */}
            <div className="flex flex-col gap-6 px-6 py-4">
                {/* 프로필 사진 */}
                <div className="flex flex-col items-center">
                    <img
                        src={photoURL || '/images/no-profile.png'}
                        alt="profile"
                        className="w-[120px] h-[120px] rounded-full"
                        onClick={editProfilePhoto}
                    />
                </div>
                {/* 닉네임 */}
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">닉네임</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>
                {/* 이메일 */}
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">이메일</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="p-2 border rounded bg-gray-100 cursor-not-allowed"
                    />
                </div>

                {/* 저장 및 취소 버튼 */}
                <div className="flex w-full items-center justify-center py-3 gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-4 py-2 border rounded text-gray-500 hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        수정
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
