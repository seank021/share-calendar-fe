import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ColorSelectModal from '../../components/color-select-modal';
import { addEvent } from '../../apis/api';

const AddEvent = () => {
    const navigate = useNavigate();
    const date = new URLSearchParams(location.search).get('date');

    // const titleInputRef = useRef(null); // 제목 input을 참조하는 ref
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('09:00');
    const [locationInput, setLocationInput] = useState('');
    const [memo, setMemo] = useState('');
    const [color, setColor] = useState('#4D96FF'); // Default color
    const [isPrivate, setIsPrivate] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);

    // 컴포넌트가 마운트된 후 제목 input에 포커스
    // useEffect(() => {
    //     titleInputRef.current?.focus();
    // }, []);

    const handleSave = async () => {
        if (!title) {
            alert('제목을 입력하세요');
            return;
        }

        if (startTime >= endTime) {
            alert('시작 시간은 종료 시간보다 늦을 수 없습니다');
            return;
        }

        const event = {
            date,
            title,
            color,
            time: `${startTime} ~ ${endTime}`,
            location: locationInput,
            memo,
            isPrivate,
        };

        const res = await addEvent(event);
        if (res) {
            alert('일정이 추가되었습니다');
            navigate(-1);
        } else {
            alert('일정 추가에 실패했습니다');
        }
    };

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-4rem)] w-full">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">
                    {date.split('-')[1]}월 {date.split('-')[2]}일 일정 추가
                </h1>
                <div className="w-6"></div>
            </div>

            {/* 내용 */}
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto mt-2">
                {/* 제목 + 색상 선택 */}
                <div className="flex items-center">
                    <input
                        // ref={titleInputRef} // 제목 input에 ref 연결
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

                {/* 비공개 여부 */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={e => setIsPrivate(e.target.checked)}
                        className="w-4 h-4 mr-2"
                    />
                    <span>친구에게 비공개</span>
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
                    저장
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

export default AddEvent;
