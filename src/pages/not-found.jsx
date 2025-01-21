import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const onClickHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)] gap-4">
            <img src="/images/logo-bg.png" alt="logo" className="w-[85%] mx-auto" />
            <h1 className="text-2xl font-bold text-center text-blue-500">404 - Page Not Found</h1>
            <button className="bg-blue-500 text-white px-4 py-2 mt-5 rounded-md" onClick={onClickHome}>
                홈으로
            </button>
        </div>
    );
};

export default NotFound;
