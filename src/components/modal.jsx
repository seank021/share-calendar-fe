import React from 'react';

const EventDetailModal = ({ event, onClose }) => {
    const handleBackgroundClick = e => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackgroundClick}
        >
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                <h2 className="text-lg font-bold mb-2">{event.title}</h2>
                <p className="text-sm text-gray-500 mb-4">
                    {event.date} | {event.time}
                </p>
                <p className="text-sm text-gray-500 mb-3">장소: {event.location || '장소가 없습니다'}</p>
                <p className="text-sm text-gray-500">메모: {event.memo || '메모가 없습니다'}</p>

                {event.photoUrls && (
                    <div className="mt-4 overflow-x-auto flex gap-4" style={{ width: '100%' }}>
                        {event.photoUrls.map((url, index) => (
                            <img key={index} src={url} alt="event" className="w-24 h-24 object-cover rounded-lg" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetailModal;
