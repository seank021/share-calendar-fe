import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { app, db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const getFriends = async () => {
    const auth = getAuth(app);

    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            if (!user) {
                console.error('사용자가 로그아웃되었습니다.');
                unsubscribe(); // 리스너 해제
                return reject(new Error('로그인된 사용자가 없습니다.'));
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
            } finally {
                unsubscribe(); // 리스너 해제
            }
        });
    });
};

export const getTop4Friends = async () => {
    const auth = getAuth(app);

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async user => {
            if (!user) {
                console.error('사용자가 로그아웃되었습니다.');
                return reject(new Error('로그인된 사용자가 없습니다.'));
            }

            try {
                const friendsRef = collection(db, 'users', user.email, 'friends');
                const friendsSnapshot = await getDocs(friendsRef);

                if (friendsSnapshot.empty) {
                    return resolve([]);
                }

                const friends = friendsSnapshot.docs.map(doc => doc.data()).sort(() => 0.5 - Math.random()).slice(0, 4); // 상위 4명 랜덤으로 가져오기
                resolve(friends);
            } catch (error) {
                console.error('친구 목록 조회 실패:', error);
                reject(new Error('친구 목록 조회 실패'));
            }
        });
    });
};

export const getFriendsNumber = async () => {
    const auth = getAuth(app);

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async user => {
            if (!user) {
                console.error('사용자가 로그아웃되었습니다.');
                return reject(new Error('로그인된 사용자가 없습니다.'));
            }

            try {
                const friendsRef = collection(db, 'users', user.email, 'friends');
                const friendsSnapshot = await getDocs(friendsRef);

                resolve(friendsSnapshot.size);
            } catch (error) {
                console.error('친구 목록 조회 실패:', error);
                reject(new Error('친구 목록 조회 실패'));
            }
        });
    });
};

// 친구 삭제 -> 현재 사용자의 친구 목록에서 friendEmail 삭제, 상대방 친구 목록에서 현재 사용자 삭제
export const deleteFriend = async (friendUid, friendEmail) => {
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
        await deleteDoc(friendDocRef);

        const currentUserDocRef = doc(db, 'users', friendEmail, 'friends', currentUser.email);
        await deleteDoc(currentUserDocRef);

        return true;
    } catch (error) {
        console.error('친구 삭제 실패:', error);
        alert('친구 삭제에 실패했습니다.');
        return false;
    }
};
