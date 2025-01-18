const My = ({ setIsLoggedIn }) => {
    const onClickLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('accessToken');
    };

    return (
        <div>
            <h1>My</h1>
            <button onClick={onClickLogout}>Logout</button>
        </div>
    );
};

export default My;
