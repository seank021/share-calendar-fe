const Login = ({ setIsLoggedIn }) => {
    const onClickLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('accessToken', 'true');
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={onClickLogin}>Login</button>
        </div>
    );
};

export default Login;
