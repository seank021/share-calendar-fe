import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ColorSelectModal from '../../components/color-select-modal';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { app, db } from '../../firebase';

const EditEvent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedEvent = location.state?.event; // 전달받은 이벤트 데이터

    const formatDateForInput = dateString => {
        const [year, month, day] = dateString.split('-').map(Number);
        const formattedMonth = month.toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');
        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    const reverseFormatDate = dateString => {
        const [year, month, day] = dateString.split('-').map(Number);
        return `${year}-${month}-${day}`;
    };

    // 기존 이벤트 정보 기본 값으로 설정
    const [title, setTitle] = useState(selectedEvent?.title || '');
    const [date, setDate] = useState(selectedEvent?.date ? formatDateForInput(selectedEvent.date) : '');
    const [startTime, setStartTime] = useState(selectedEvent?.time.split(' ~ ')[0] || '08:00');
    const [endTime, setEndTime] = useState(selectedEvent?.time.split(' ~ ')[1] || '09:00');
    const [locationInput, setLocationInput] = useState(selectedEvent?.location || '');
    const [memo, setMemo] = useState(selectedEvent?.memo || '');
    const [color, setColor] = useState(selectedEvent?.color || '#4D96FF');
    const [showColorModal, setShowColorModal] = useState(false);

    // 수정된 이벤트 저장
    const handleSave = async () => {
        if (!title) {
            alert('제목을 입력하세요');
            return;
        }

        if (startTime >= endTime) {
            alert('시작 시간은 종료 시간보다 늦을 수 없습니다');
            return;
        }

        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다');
            navigate('/login');
            return;
        }

        const updatedEvent = {
            date: reverseFormatDate(date),
            title,
            color,
            time: `${startTime} ~ ${endTime}`,
            location: locationInput,
            memo,
        };

        try {
            const eventDocRef = doc(db, 'users', currentUser.uid, 'events', selectedEvent.id);
            await updateDoc(eventDocRef, updatedEvent);
            alert('이벤트가 수정되었습니다.');
            navigate(-1); // 이전 화면으로 이동
        } catch (error) {
            console.error('이벤트 수정 실패:', error);
            alert('이벤트 수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-4rem)] w-full">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">일정 수정</h1>
                <div className="w-6"></div>
            </div>

            {/* 내용 */}
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto mt-2">
                {/* 제목 + 색상 선택 */}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="제목"
                        className="flex-1 text-lg font-semibold border-b focus:outline-none pb-1"
                    />
                    <button
                        onClick={() => setShowColorModal(true)}
                        className="w-6 h-6 ml-3 rounded-full border"
                        style={{ backgroundColor: color }}
                    ></button>
                </div>

                {/* 날짜 */}
                <div className="flex items-center">
                    <label className="w-[100px] text-gray-600 font-medium">날짜</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="border rounded px-2 py-1 focus:outline-none flex-1"
                    />
                </div>

                {/* 시간 */}
                <div className="flex items-center">
                    <img src="/icons/time.svg" alt="시간" className="w-5 h-5 mr-3" />
                    <div className="flex items-center w-full">
                        <input
                            type="time"
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                            className="flex-1 border rounded px-2 py-1 focus:outline-none w-[48%]"
                        />
                        <span className="mx-2 text-gray-500">→</span>
                        <input
                            type="time"
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                            className="flex-1 border rounded px-2 py-1 focus:outline-none w-[48%]"
                        />
                    </div>
                </div>

                {/* 장소 */}
                <div className="flex items-center">
                    <img src="/icons/location.svg" alt="장소" className="w-5 h-5 mr-3" />
                    <input
                        type="text"
                        value={locationInput}
                        onChange={e => setLocationInput(e.target.value)}
                        placeholder="장소를 입력하세요"
                        className="flex-1 border rounded px-2 py-1 focus:outline-none"
                    />
                </div>

                {/* 메모 */}
                <div className="flex items-start">
                    <img src="/icons/memo.svg" alt="메모" className="w-5 h-5 mr-3 mt-1" />
                    <textarea
                        value={memo}
                        onChange={e => setMemo(e.target.value)}
                        className="flex-1 border rounded px-2 py-1 focus:outline-none"
                        placeholder="메모를 입력하세요"
                        rows="4"
                    />
                </div>
            </div>

            {/* 저장 및 취소 버튼 */}
            <div className="flex w-full items-center justify-center px-4 py-3 gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border rounded text-gray-500 hover:bg-gray-100 w-[45%]"
                >
                    취소
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-[45%]"
                >
                    수정하기
                </button>
            </div>

            {/* ColorSelectModal */}
            {showColorModal && (
                <ColorSelectModal
                    selectedColor={color}
                    onSelectColor={selected => {
                        setColor(selected);
                        setShowColorModal(false);
                    }}
                    onClose={() => setShowColorModal(false)}
                />
            )}
        </div>
    );
};

export default EditEvent;
