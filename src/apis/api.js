import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    setDoc,
    updateDoc,
    query,
    where,
    getDocs,
    getDoc,
} from 'firebase/firestore';
import { app, db } from '../firebase';
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    sendPasswordResetEmail,
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
        const userDocRef = doc(db, 'users', user.email);
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
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
            return false;
        }

        const eventsRef = collection(db, 'users', currentUser.email, 'events');
        await addDoc(eventsRef, event);
        return true;
    } catch (error) {
        console.error('일정 저장 실패:', error);
        alert('일정 저장에 실패했습니다.');
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
            return false;
        }

        const eventDocRef = doc(db, 'users', currentUser.email, 'events', selectedEventId);
        await updateDoc(eventDocRef, updatedEvent);
        return true;
    } catch (error) {
        console.error('일정 수정 실패:', error);
        alert('일정 수정에 실패했습니다.');
        return false;
    }
};

export const deleteEvent = async event => {
    if (!event.id) {
        alert('삭제할 일정 ID가 없습니다.');
        return false;
    }

    if (window.confirm('삭제하시겠습니까?')) {
        try {
            const auth = getAuth(app);
            const currentUser = auth.currentUser;

            if (!currentUser) {
                alert('로그인이 필요합니다.');
                return false;
            }

            const eventDocRef = doc(db, 'users', currentUser.email, 'events', event.id);
            await deleteDoc(eventDocRef);
            return true;
        } catch (error) {
            console.error('일정 삭제 중 오류 발생:', error);
            alert('일정 삭제에 실패했습니다.');
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
        if (window.confirm('이메일 인증 요청을 보내시겠습니까?')) {
            await sendEmailVerification(currentUser);
            alert('이메일 인증 요청을 보냈습니다. 이메일을 확인하세요.');
        }
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
        const usersRef = collection(db, 'users');

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
                const friendsRef = collection(db, 'users', user.email, 'friends');
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
                const friendsRef = collection(db, 'users', user.email, 'friends');
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
        return false;
    }

    // 이미 친구인 경우 - 친구 요청 불가
    const friends = await getFriends();
    if (friends.some(friend => friend.email === friendEmail)) {
        alert('이미 친구입니다.');
        return false;
    }

    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return false;
        }

        const friendDocRef = doc(db, 'users', friendEmail, 'requests', currentUser.email);
        await setDoc(friendDocRef, {
            email: currentUser.email,
            createdAt: new Date(),
            resolved: false,
        });

        return true;
    } catch (error) {
        console.error('친구 요청 실패:', error);
        alert('친구 요청에 실패했습니다.');
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
                const requestsRef = collection(db, 'users', user.email, 'requests');
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

// 친구 요청 수락 -> friendEmail의 친구 목록에 현재 사용자 추가, 현재 사용자의 친구 목록에 friendEmail 추가, 요청 resolved: true로 업데이트
export const acceptRequest = async (friendUid, friendEmail) => {
    if (!friendUid || !friendEmail) {
        alert('친구 정보가 없습니다.');
        return false;
    }

    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return false;
        }

        // 친구 목록에 추가
        const friendDocRef = doc(db, 'users', currentUser.email, 'friends', friendEmail);
        await setDoc(friendDocRef, {
            uid: friendUid,
            email: friendEmail,
        });

        // 상대방 친구 목록에 추가
        const currentUserDocRef = doc(db, 'users', friendEmail, 'friends', currentUser.email);
        await setDoc(currentUserDocRef, {
            uid: currentUser.uid,
            email: currentUser.email,
        });

        // 요청 resolved로 업데이트
        const requestDocRef = doc(db, 'users', currentUser.email, 'requests', friendEmail);
        await updateDoc(requestDocRef, { resolved: true });

        return true;
    } catch (error) {
        console.error('친구 요청 수락 실패:', error);
        alert('친구 요청 수락에 실패했습니다.');
        return false;
    }
};

// 친구 요청 거절 -> 요청 resolved: true로 업데이트
export const rejectRequest = async friendEmail => {
    if (!friendEmail) {
        alert('친구 정보가 없습니다.');
        return false;
    }

    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return false;
        }

        // 요청 resolved로 업데이트
        const requestDocRef = doc(db, 'users', currentUser.email, 'requests', friendEmail);
        await updateDoc(requestDocRef, { resolved: true });

        return true;
    } catch (error) {
        console.error('친구 요청 거절 실패:', error);
        alert('친구 요청 거절에 실패했습니다.');
        return false;
    }
};

// 친구 삭제 -> 현재 사용자의 친구 목록에서 friendEmail 삭제, 상대방 친구 목록에서 현재 사용자 삭제
export const deleteFriend = async (friendUid, friendEmail) => {
    if (!friendUid || !friendEmail) {
        alert('친구 정보가 없습니다.');
        return false;
    }

    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return false;
        }

        // 현재 사용자의 친구 목록에서 삭제
        const friendDocRef = doc(db, 'users', currentUser.email, 'friends', friendEmail);
        await deleteDoc(friendDocRef);

        // 상대방 친구 목록에서 삭제
        const currentUserDocRef = doc(db, 'users', friendEmail, 'friends', currentUser.email);
        await deleteDoc(currentUserDocRef);

        return true;
    } catch (error) {
        console.error('친구 삭제 실패:', error);
        alert('친구 삭제에 실패했습니다.');
        return false;
    }
};

export const getUserInfoByEmail = async email => {
    if (!email) {
        alert('이메일을 입력해주세요.');
        return;
    }

    try {
        const userDocRef = doc(db, 'users', email);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            alert('사용자 정보가 없습니다.');
            return;
        }

        return userDoc.data();
    } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        return null;
    }
};

// photo, nickname
export const updateProfileInfo = async (photoURL, nickname) => {
    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return false;
        }

        // Firebase Authentication 프로필 업데이트
        await updateProfile(currentUser, {
            displayName: nickname,
            photoURL: photoURL,
        });

        // Firestore에서 사용자 문서 업데이트
        const userDocRef = doc(db, 'users', currentUser.email);
        await updateDoc(userDocRef, {
            displayName: nickname,
            photoURL: photoURL,
        });

        return true;
    } catch (error) {
        console.error('프로필 수정 실패:', error);
        alert('프로필 수정에 실패했습니다.');
        return false;
    }
};

export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return false;
    }

    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return false;
        }

        // 현재 사용자의 이메일로 자격 증명 생성
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);

        // 재인증 수행
        await reauthenticateWithCredential(currentUser, credential);

        // 비밀번호 변경
        await updatePassword(currentUser, newPassword);

        return true;
    } catch (error) {
        if (error.code === 'auth/invalid-credential') {
            alert('현재 비밀번호가 일치하지 않습니다.');
        } else if (error.code === 'auth/weak-password') {
            alert('비밀번호는 6자리 이상이어야 합니다.');
        } else {
            console.error('비밀번호 변경 중 오류:', error);
            alert('비밀번호 변경에 실패했습니다.');
        }

        return false;
    }
};

export const findPassword = async email => {
    if (!email) {
        alert('이메일을 입력해주세요.');
        return false;
    }

    try {
        const auth = getAuth(app);
        await sendPasswordResetEmail(auth, email);
        alert('비밀번호 재설정 이메일을 보냈습니다. 이메일을 확인하세요.');
        return true;
    } catch (error) {
        console.error('비밀번호 찾기 실패:', error);
        alert('비밀번호 찾기에 실패했습니다.');
        return false;
    }
};

export const getUserEvents = async (email, date, includePrivate) => {
    const auth = getAuth(app);

    return new Promise(async (resolve, reject) => {
        onAuthStateChanged(auth, async user => {
            if (!user) {
                alert('로그인이 필요합니다.');
                return reject(new Error('로그인이 필요합니다.'));
            }

            try {
                const targetEmail = email === 'my' ? user.email : email;
                const eventsRef = collection(db, 'users', targetEmail, 'events');
                const eventsSnapshot = await getDocs(eventsRef);

                if (eventsSnapshot.empty) {
                    return resolve([]);
                }

                // date에 해당하는 일정 필터링
                let events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                events = events.filter(event => event.date === date);

                // isPrivate이 false인 경우만 필터링
                if (!includePrivate) {
                    events = events.filter(event => !event.isPrivate);
                }

                resolve(events);
            } catch (error) {
                console.error('일정 조회 실패:', error);
                reject(new Error('일정 조회에 실패했습니다.'));
            }
        });
    });
};

// custom api - app.js에서 필요할 때 사용
export const changeImage = async (email, image) => {
    try {
        // Firestore의 users 컬렉션에 사용자 정보 추가
        const userDocRef = doc(db, 'users', email);
        await updateDoc(userDocRef, {
            photoURL: image,
        });

        // Firebase Authentication 프로필 업데이트
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        await updateProfile(currentUser, {
            photoURL: image,
        });

        return true;
    } catch (error) {
        console.error('이미지 변경 실패:', error);
        alert('이미지 변경에 실패했습니다.');
        return false;
    }
};
