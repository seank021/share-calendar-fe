import React from 'react';

const ColorSelectModal = ({ selectedColor, onSelectColor, onClose }) => {
    const colors = [
        '#FF6F61',
        '#6BCB77',
        '#4D96FF',
        '#14532D',
        '#355C7D',
        '#D72638',
        '#FFC400',
        '#A29BFE',
        '#F9A825',
        '#5F3DC4',
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white w-[90%] max-w-md rounded-lg p-5" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold mb-4">색상 선택</h2>
                <div className="grid grid-cols-5 gap-4">
                    {colors.map(color => (
                        <div
                            key={color}
                            className={`w-10 h-10 rounded-full cursor-pointer border ${
                                selectedColor === color ? 'border-black' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => onSelectColor(color)}
                        ></div>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default ColorSelectModal;
