import { collection, doc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import { app, db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFriends } from './friend';
import dayjs from 'dayjs';

export const requestForFriend = async (friendEmail, friendUid) => {
    if (!friendEmail || !friendUid) {
        alert('친구 정보가 없습니다.');
        return false;
    }

    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return false;
    }

    // 이미 친구인지 확인
    const friends = await getFriends();
    if (friends.some(friend => friend.email === friendEmail)) {
        alert('이미 친구입니다.');
        return false;
    }

    try {
        const friendDocRef = doc(db, 'users', friendEmail, 'requests', currentUser.email);
        await setDoc(friendDocRef, {
            email: currentUser.email,
            createdAt: dayjs().toISOString(),
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
                console.error('사용자가 로그아웃되었습니다.');
                return reject(new Error('로그인된 사용자가 없습니다.'));
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

    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return false;
    }

    try {
        const friendDocRef = doc(db, 'users', currentUser.email, 'friends', friendEmail);
        await setDoc(friendDocRef, { uid: friendUid, email: friendEmail });

        const currentUserDocRef = doc(db, 'users', friendEmail, 'friends', currentUser.email);
        await setDoc(currentUserDocRef, { uid: currentUser.uid, email: currentUser.email });

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

    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return false;
    }

    try {
        const requestDocRef = doc(db, 'users', currentUser.email, 'requests', friendEmail);
        await updateDoc(requestDocRef, { resolved: true });

        return true;
    } catch (error) {
        console.error('친구 요청 거절 실패:', error);
        alert('친구 요청 거절에 실패했습니다.');
        return false;
    }
};
