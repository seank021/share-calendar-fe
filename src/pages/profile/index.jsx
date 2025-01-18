import React, { useEffect, useState } from 'react';

/* pages */
import Login from './login';
import My from './my';

const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        setIsLoggedIn(accessToken ? true : false);
    }, []);

    if (!isLoggedIn) {
        return <Login setIsLoggedIn={setIsLoggedIn} />;
    }

    return <My setIsLoggedIn={setIsLoggedIn} />;
};

export default Profile;
