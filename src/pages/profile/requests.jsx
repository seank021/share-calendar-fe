import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests, acceptRequest, rejectRequest, getUserInfoByEmail } from '../../apis/api';

const Requests = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const rawRequests = await getRequests();

                const requestsWithNames = await Promise.all(
                    rawRequests.map(async request => {
                        const userInfo = await getUserInfoByEmail(request.email);
                        return {
                            ...request,
                            displayName: userInfo?.displayName || '',
                            uid: userInfo?.uid || '',
                        };
                    })
                );
                
                // 친구 요청을 시간 순서대로 정렬
                requestsWithNames.sort((a, b) => b.createdAt - a.createdAt);

                setRequests(requestsWithNames);
            } catch (error) {
                alert(error.message);
            }
        };

        fetchRequests();
    }, []);

    const onClickAccept = async (uid, email) => {
        if (window.confirm('친구 요청을 수락하시겠습니까?')) {
            const result = await acceptRequest(uid, email);
            if (result) {
                alert('친구 요청을 수락했습니다.');
                window.location.reload();
            }
        }
    };

    const onClickReject = async email => {
        if (window.confirm('친구 요청을 거절하시겠습니까?')) {
            const result = await rejectRequest(email);
            if (result) {
                alert('친구 요청을 거절했습니다.');
                window.location.reload();
            }
        }
    };

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-3.5rem)]">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">친구 요청</h1>
                <div className="w-6"></div>
            </div>
            {/* 알림 목록 */}
            <div className="flex flex-col gap-3 p-4 overflow-y-auto">
                {requests.map((request, index) => (
                    <div key={index} className="flex items-center gap-4 border-b pb-3 mx-1">
                        {/* 아이콘 */}
                        <img src="/icons/request.svg" alt="request icon" className="w-[27px] h-[27px]" />
                        {/* 알림 내용 */}
                        <div className="flex w-full justify-between">
                            <div className="flex flex-col gap-[0.2rem]">
                                <p className="text-sm font-bold tracking-tighter">
                                    {request.displayName} ({request.email})
                                </p>
                                <p className="text-xs text-gray-400 tracking-tighter">
                                    {request.createdAt.toDate().toLocaleDateString()}
                                </p>
                                <p className="text-xs tracking-tighter text-gray-400">
                                    수락 시 서로의 일정이 공유됩니다.
                                </p>
                            </div>

                            {!request.resolved && (
                                <div className="flex flex-col gap-1 items-center">
                                    <button
                                        className="px-3 py-1 h-7 bg-blue-500 text-white rounded-md text-sm"
                                        onClick={() => onClickAccept(request.uid, request.email)}
                                    >
                                        수락
                                    </button>
                                    <button
                                        className="px-3 py-1 h-7 bg-red-500 text-white rounded-md text-sm"
                                        onClick={() => onClickReject(request.email)}
                                    >
                                        거절
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Requests;
