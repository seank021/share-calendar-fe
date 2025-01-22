import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebase';
import Loading from '../loading';
import { getUserInfoByEmail, updateProfileInfo } from '../../apis/user';

const EditProfile = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const [nickname, setNickname] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setNickname(user.displayName || '');
                setEmail(user.email || '');
                try {
                    // Firestore에서 photoURL 가져오기
                    const userInfo = await getUserInfoByEmail(user.email);
                    if (userInfo?.photoURL) {
                        setPhotoURL(userInfo.photoURL);
                    }
                } catch (error) {
                    console.error('프로필 사진 가져오기 실패:', error);
                }
                setLoading(false);
            }
        });

        // 컴포넌트 언마운트 시 리스너 해제
        return () => unsubscribe();
    }, [auth]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_WIDTH = 300; // 최대 너비
                    const MAX_HEIGHT = 300; // 최대 높이
    
                    let width = img.width;
                    let height = img.height;
    
                    // 크기 조정
                    if (width > height && width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    } else if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
    
                    canvas.width = width;
                    canvas.height = height;
    
                    ctx.drawImage(img, 0, 0, width, height);
    
                    // 압축된 base64 데이터 생성
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8); // 품질 80%
                    setPhotoURL(compressedDataUrl);
                };
            };
            reader.readAsDataURL(file);
        }
    };    

    const handleSave = async () => {
        const result = await updateProfileInfo(photoURL, nickname);
        if (result) {
            alert('프로필이 수정되었습니다.');
            navigate(-1);
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
                        className="w-[120px] h-[120px] rounded-full cursor-pointer"
                        onClick={() => document.getElementById('profileImageInput').click()}
                    />
                    <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
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
