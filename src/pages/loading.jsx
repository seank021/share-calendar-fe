import React from 'react';
import '../styles/loading.css'; // 스타일 파일 추가

const Loading = ({ message = 'Loading...' }) => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-message">{message}</p>
        </div>
    );
};

export default Loading;
