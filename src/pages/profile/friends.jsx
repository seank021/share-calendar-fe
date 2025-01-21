import { useNavigate } from 'react-router-dom';

const Friends = () => {
    const navigate = useNavigate();

    const FRIENDS = [
        // 친구 다 가져오는 api 필요
        {
            displayName: '세안',
            email: 'aaaaa@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안2',
            email: 'bbbbb@google.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안3',
            email: 'ccccc@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안4',
            email: 'ddddd@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안5',
            email: 'eeeee@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안2',
            email: 'bbbbb@google.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안3',
            email: 'ccccc@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안4',
            email: 'ddddd@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안5',
            email: 'eeeee@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안2',
            email: 'bbbbb@google.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안3',
            email: 'ccccc@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안4',
            email: 'ddddd@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안5',
            email: 'eeeee@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안2',
            email: 'bbbbb@google.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안3',
            email: 'ccccc@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안4',
            email: 'ddddd@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
        {
            displayName: '세안5',
            email: 'eeeee@naver.com',
            photoURL: 'https://avatars.githubusercontent.com/u/77464076?v=4',
        },
    ];

    const deleteFriend = email => {
        if (window.confirm('친구를 삭제하시겠습니까?')) {
            // 친구 삭제 api 필요
            console.log(email);
        }
    };

    return (
        <div className="flex flex-col bg-white h-[calc(100vh-4rem)] w-full">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <button onClick={() => navigate(-1)}>
                    <img src="/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">친구</h1>
                <div className="w-6"></div>
            </div>

            <p className="px-5 mt-4 text-sm text-gray-400">
                친구가 되면 서로의 일정이 자동으로 공유됩니다.
                <br />
                한쪽에서 친구를 삭제하면 일정 공유도 함께 해제돼요.
            </p>

            {/* 친구 목록 */}
            <div className="flex flex-col gap-2 p-4 overflow-y-auto">
                {FRIENDS.map((friend, index) => (
                    <div key={index} className="flex items-center px-4 py-3 border rounded-lg justify-between">
                        <div className="flex items-center gap-4">
                            <img src={friend.photoURL} alt="profile" className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="text-md font-semibold">{friend.displayName}</p>
                                <p className="text-sm text-gray-400">{friend.email}</p>
                            </div>
                        </div>
                        <button
                            className="text-sm font-bold text-red-500 justify-self-end"
                            onClick={() => deleteFriend(friend.email)}
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Friends;
