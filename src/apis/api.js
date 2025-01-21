import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { app, db } from '../firebase';
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
} from 'firebase/auth';

export const signup = async (email, password, password_, nickname) => {
    if (password !== password_) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    if (!email || !password || !nickname) {
        alert('모든 항목을 입력해주세요.');
        return;
    }

    try {
        const auth = getAuth(app);
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, { displayName: nickname });

        // Firestore의 users 컬렉션에 사용자 정보 추가
        const userDocRef = doc(db, 'users-by-email', user.email);
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            nickname: nickname,
            photoURL: '',
        });

        return user;
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            alert('이미 사용 중인 이메일입니다.');
        } else if (error.code === 'auth/weak-password') {
            alert('비밀번호는 6자리 이상이어야 합니다.');
        } else {
            alert('회원가입에 실패했습니다.');
        }
    }
};

export const login = async (email, password) => {
    try {
        const auth = getAuth(app);
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        return user;
    } catch (error) {
        alert('입력한 정보를 다시 확인해주세요.');
    }
};

export const addEvent = async event => {
    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert('로그인이 필요합니다');
            navigate('/login');
            return;
        }

        const eventsRef = collection(db, 'users', currentUser.uid, 'events');
        await addDoc(eventsRef, event);
        return true;
    } catch (error) {
        console.error('이벤트 저장 실패:', error);
        return false;
    }
};

export const updateEvent = async (selectedEventId, updatedEvent) => {
    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert('로그인이 필요합니다');
            navigate('/login');
            return;
        }

        const eventDocRef = doc(db, 'users', currentUser.uid, 'events', selectedEventId);
        await updateDoc(eventDocRef, updatedEvent);
        return true;
    } catch (error) {
        console.error('이벤트 수정 실패:', error);
        return false;
    }
};

export const deleteEvent = async event => {
    if (!event.id) {
        alert('삭제할 이벤트 ID가 없습니다.');
        return;
    }

    if (window.confirm('삭제하시겠습니까?')) {
        try {
            const auth = getAuth(app);
            const currentUser = auth.currentUser;

            if (!currentUser) {
                alert('로그인이 필요합니다.');
                return;
            }

            const eventDocRef = doc(db, 'users', currentUser.uid, 'events', event.id);
            await deleteDoc(eventDocRef);
            return true;
        } catch (error) {
            console.error('이벤트 삭제 중 오류 발생:', error);
            return false;
        }
    }
};

export const getUserInfo = async () => {
    const auth = getAuth(app);

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, user => {
            if (user) {
                resolve(user);
            } else {
                reject(new Error('로그인이 필요합니다'));
            }
        });
    });
};

export const verifyEmail = async () => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    if (currentUser.emailVerified) {
        alert('이미 이메일이 인증되었습니다.');
        return;
    }

    try {
        await sendEmailVerification(currentUser);
        alert('이메일 인증 요청을 보냈습니다. 이메일을 확인하세요.');
    } catch (error) {
        console.error('이메일 인증 요청 실패:', error);
        alert('이메일 인증 요청에 실패했습니다.');
    }
};

export const searchUsersByEmail = async email => {
    if (!email) {
        throw new Error('이메일을 입력해주세요.');
    }

    try {
        const usersRef = collection(db, 'users-by-email');

        // Firestore에서 이메일 검색
        const q = query(usersRef, where('email', '>=', email), where('email', '<=', email + '\uf8ff'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return [];
        }

        // 검색된 사용자 중 현재 사용자 제외
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        const users = querySnapshot.docs.map(doc => doc.data()).filter(user => user.email !== currentUser.email);

        return users;
    } catch (error) {
        throw new Error('사용자 검색에 실패했습니다.');
    }
};

export const getFriends = async () => {
    const auth = getAuth(app);

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async user => {
            if (!user) {
                alert('로그인이 필요합니다.');
                return reject(new Error('로그인이 필요합니다.'));
            }

            try {
                const friendsRef = collection(db, 'users', user.uid, 'friends');
                const friendsSnapshot = await getDocs(friendsRef);

                if (friendsSnapshot.empty) {
                    return resolve([]);
                }

                const friends = friendsSnapshot.docs.map(doc => doc.data());
                resolve(friends);
            } catch (error) {
                console.error('친구 목록 조회 실패:', error);
                reject(new Error('친구 목록 조회 실패'));
            }
        });
    });
};

export const getTop3Friends = async () => {
    const auth = getAuth(app);

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async user => {
            if (!user) {
                alert('로그인이 필요합니다.');
                return reject(new Error('로그인이 필요합니다.'));
            }

            try {
                const friendsRef = collection(db, 'users', user.uid, 'friends');
                const friendsSnapshot = await getDocs(friendsRef);

                if (friendsSnapshot.empty) {
                    return resolve([]);
                }

                const friends = friendsSnapshot.docs.map(doc => doc.data()).slice(0, 3);
                resolve(friends);
            } catch (error) {
                console.error('친구 목록 조회 실패:', error);
                reject(new Error('친구 목록 조회 실패'));
            }
        });
    });
};

export const requestForFriend = async (friendEmail, friendUid) => {
    if (!friendEmail || !friendUid) {
        alert('친구 정보가 없습니다.');
        return;
    }

    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        const friendDocRef = doc(db, 'users', friendUid, 'requests', currentUser.uid);
        await setDoc(friendDocRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            createdAt: new Date(),
            resolved: false,
        });

        return true;
    } catch (error) {
        console.error('친구 요청 실패:', error);
        return false;
    }
};

export const getRequests = async () => {
    const auth = getAuth(app);

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async user => {
            if (!user) {
                alert('로그인이 필요합니다.');
                return reject(new Error('로그인이 필요합니다.'));
            }

            try {
                const requestsRef = collection(db, 'users', user.uid, 'requests');
                const requestsSnapshot = await getDocs(requestsRef);

                if (requestsSnapshot.empty) {
                    return resolve([]);
                }

                const requests = requestsSnapshot.docs.map(doc => doc.data());
                resolve(requests);
            } catch (error) {
                console.error('친구 요청 조회 실패:', error);
                reject(new Error('친구 요청 조회 실패'));
            }
        });
    });
};

// 친구 요청 수락 -> friendUid의 친구 목록에 현재 사용자 추가, 현재 사용자의 친구 목록에 friendUid 추가, 요청 resolved: true로 업데이트
export const acceptRequest = async (friendUid, friendEmail, friendDisplayName) => {
    if (!friendUid || !friendEmail || !friendDisplayName) {
        alert('친구 정보가 없습니다.');
        return;
    }

    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        // 친구 목록에 추가
        const friendDocRef = doc(db, 'users', currentUser.uid, 'friends', friendUid);
        await setDoc(friendDocRef, {
            uid: friendUid,
            email: friendEmail,
            displayName: friendDisplayName
        });

        // 상대방 친구 목록에 추가
        const currentUserDocRef = doc(db, 'users', friendUid, 'friends', currentUser.uid);
        await setDoc(currentUserDocRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName
        });

        // 요청 resolved로 업데이트
        const requestDocRef = doc(db, 'users', currentUser.uid, 'requests', friendUid);
        await updateDoc(requestDocRef, { resolved: true });

        return true;
    } catch (error) {
        console.error('친구 요청 수락 실패:', error);
        return false;
    }
}

// 친구 요청 거절 -> 요청 resolved: true로 업데이트
export const rejectRequest = async (friendUid) => {
    if (!friendUid) {
        alert('친구 정보가 없습니다.');
        return;
    }

    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        // 요청 resolved로 업데이트
        const requestDocRef = doc(db, 'users', currentUser.uid, 'requests', friendUid);
        await updateDoc(requestDocRef, { resolved: true });

        return true;
    } catch (error) {
        console.error('친구 요청 거절 실패:', error);
        return false;
    }
}

// 친구 삭제 -> 현재 사용자의 친구 목록에서 friendUid 삭제, 상대방 친구 목록에서 현재 사용자 삭제
export const deleteFriend = async (friendUid, friendEmail) => {
    if (!friendUid || !friendEmail) {
        alert('친구 정보가 없습니다.');
        return;
    }

    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        // 현재 사용자의 친구 목록에서 삭제
        const friendDocRef = doc(db, 'users', currentUser.uid, 'friends', friendUid);
        await deleteDoc(friendDocRef);

        // 상대방 친구 목록에서 삭제
        const currentUserDocRef = doc(db, 'users', friendUid, 'friends', currentUser.uid);
        await deleteDoc(currentUserDocRef);

        return true;
    } catch (error) {
        console.error('친구 삭제 실패:', error);
        return false;
    }
}