import { collection, doc, updateDoc, query, where, getDocs, getDoc } from 'firebase/firestore';
import { app, db } from '../firebase';
import { getAuth, updateProfile, onAuthStateChanged } from 'firebase/auth';
import dayjs from 'dayjs';

export const getUserInfo = async () => {
    const auth = getAuth(app);

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, user => {
            if (!user) {
                console.error('사용자가 로그아웃되었습니다.');
                return reject(new Error('로그인된 사용자가 없습니다.'));
            }
            resolve(user);
        });
    });
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

export const getUserEvents = async (email, date, includePrivate) => {
    const auth = getAuth(app);

    return new Promise(async (resolve, reject) => {
        onAuthStateChanged(auth, async user => {
            if (!user) {
                console.error('사용자가 로그아웃되었습니다.');
                return reject(new Error('로그인된 사용자가 없습니다.'));
            }

            try {
                const targetEmail = email === 'my' ? user.email : email;
                const eventsRef = collection(db, 'users', targetEmail, 'events');
                const eventsSnapshot = await getDocs(eventsRef);

                if (eventsSnapshot.empty) {
                    return resolve([]);
                }

                let events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                events = events.filter(event => dayjs(event.date).format('YYYY-MM-DD') === date);

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

// photo, nickname
export const updateProfileInfo = async (photoURL, nickname) => {
    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        // Firebase Authentication 프로필 업데이트 (photoURL 제외)
        await updateProfile(currentUser, {
            displayName: nickname,
        });

        // Firestore에서 사용자 문서 업데이트
        const userDocRef = doc(db, 'users', currentUser.email);
        await updateDoc(userDocRef, {
            displayName: nickname,
            photoURL: photoURL, // Firestore에 저장
        });

        return true;
    } catch (error) {
        console.error('프로필 수정 실패:', error);
        alert('프로필 수정에 실패했습니다.');
        return false;
    }
};
