import React from 'react';

const EventModal = ({ date, events, onClose, onAddEvent }) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const parsedDate = new Date(date);
    const dayOfWeek = days[parsedDate.getDay()];

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose} // 배경 클릭 시 모달 닫기
        >
            <div
                className="bg-white w-[90%] max-w-md rounded-xl p-5 relative"
                onClick={e => e.stopPropagation()} // 모달 내용 클릭 시 닫히지 않도록 이벤트 전파 중단
            >
                {/* 제목 */}
                <div className="text-left ml-3 pb-2 border-b-[1px] border-gray-200 mb-4">
                    <h2 className="text-xl font-bold">
                        {parsedDate.getMonth() + 1}월 {parsedDate.getDate()}일 {dayOfWeek}요일
                    </h2>
                </div>

                {/* 이벤트 리스트 */}
                <div
                    className="space-y-5 overflow-y-auto px-3 py-2"
                    style={{
                        maxHeight: '300px', // 최대 높이 설정
                    }}
                >
                    {events.map((event, idx) => (
                        <div key={idx} className="flex flex-col">
                            <div className="flex items-center">
                                <div className="flex w-[75px] items-center gap-4">
                                    {/* 시작 시간 */}
                                    <div className="text-sm font-bold text-right">{event.time.split(' ~ ')[0]}</div>
                                    {/* 색상 막대 */}
                                    <div
                                        className="w-[5px] h-5 rounded-md"
                                        style={{ backgroundColor: event.color }}
                                    ></div>
                                </div>
                                <div className="text-md font-medium">{event.title}</div>
                            </div>
                            <div className="flex-1">
                                <div className="ml-[75px] text-xs text-gray-400">
                                    {event.time}&nbsp;&nbsp;{event.location ? `| ${event.location}` : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 추가 버튼 */}
                <button
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    onClick={onAddEvent}
                >
                    + {parsedDate.getMonth() + 1}월 {parsedDate.getDate()}일에 일정 추가
                </button>
            </div>
        </div>
    );
};

export default EventModal;
