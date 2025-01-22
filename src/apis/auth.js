import { doc, setDoc } from 'firebase/firestore';
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

export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return false;
    }

    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword); // 현재 사용자의 이메일로 자격 증명 생성
        await reauthenticateWithCredential(currentUser, credential); // 재인증 수행
        await updatePassword(currentUser, newPassword); // 비밀번호 변경

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

export const verifyEmail = async () => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;

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

export const isUserLoggedIn = async () => {
    const auth = getAuth(app);

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, user => {
            if (user) {
                resolve(true);
            } else {
                reject(false);
            }
        });
    });
};

export const logout = async () => {
    const auth = getAuth(app);
    try {
        await auth.signOut();
        return true;
    } catch (error) {
        return false;
    }
};
