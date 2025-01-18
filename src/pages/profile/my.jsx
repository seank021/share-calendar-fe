const My = ({ setIsLoggedIn }) => {
    const onClickLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('accessToken');
    };

    return (
        <div className="container-col min-h-screen bg-gray-100">
            <h1>My</h1>
            <button onClick={onClickLogout}>Logout</button>
        </div>
    );
};

export default My;
