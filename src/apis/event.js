import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { app, db } from '../firebase';
import { getAuth } from 'firebase/auth';

export const addEvent = async event => {
    try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
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
