import React from 'react';
import { useNavigate } from 'react-router-dom';

const Alarms = () => {
    const navigate = useNavigate();

    const ALARMS = [
        {
            title: '세안 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-01T12:00:00.000Z',
        },
        {
            title: '세안2 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-04T12:00:00.000Z',
        },
        {
            title: '세안3 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-05T12:00:00.000Z',
        },
        {
            title: '세안4 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-06T12:00:00.000Z',
        },
        {
            title: '세안5 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-07T12:00:00.000Z',
        },
        {
            title: '세안6 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-08T12:00:00.000Z',
        },
        {
            title: '세안7 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-09T12:00:00.000Z',
        },
        {
            title: '세안8 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-10T12:00:00.000Z',
        },
        {
            title: '세안9 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-11T12:00:00.000Z',
        },
        {
            title: '세안10 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-12T12:00:00.000Z',
        },
        {
            title: '세안11 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-12T12:00:00.000Z',
        },
        {
            title: '세안12 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-12T12:00:00.000Z',
        },
        {
            title: '세안13 님이 친구가 되었어요!',
            contents: '이제 세안 님과 일정이 공유됩니다.',
            createdAt: '2021-10-12T12:00:00.000Z',
        },
    ];

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-3.5rem)]">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">알림</h1>
                <div className="w-6"></div>
            </div>
            {/* 알림 목록 */}
            <div className="flex flex-col gap-3 p-4 overflow-y-auto">
                {ALARMS.map((alarm, index) => (
                    <div key={index} className="flex items-center gap-5 border-b pb-3 mx-1">
                        {/* 아이콘 */}
                        <img src="/icons/alarm.svg" alt="alarm icon" className="w-[27px] h-[27px]" />
                        {/* 알림 내용 */}
                        <div className="flex flex-col gap-[0.2rem] w-full">
                            <div className="flex w-full  items-center justify-between">
                                <p className="text-sm font-bold">{alarm.title}</p>
                                <p className="text-xs text-gray-400 tracking-tight">{alarm.createdAt.slice(0, 10)}</p>
                            </div>
                            <p className="text-xs tracking-tighter">{alarm.contents}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Alarms;
