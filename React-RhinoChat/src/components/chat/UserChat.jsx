import React, { useContext } from "react";
import { useFetchOtherUser } from "../../hooks/useFetchOtherUser";
import { Stack } from "react-bootstrap";
import { ChatContext } from "../../context/ChatContext";

const UserChat = ({ chat, user }) => {
    const { otherUsers } = useFetchOtherUser(chat, user);
    const { onlineUsers } = useContext(ChatContext);

    const isUserOnline = (userId) => onlineUsers?.some(onlineUser => onlineUser.userId === userId);

    const renderUsernames = () => {
        if (Array.isArray(otherUsers) && otherUsers.length > 0) {
            if (chat.is_group) {
                return chat.chatTitle || otherUsers.map((user, index) => (
                    <span key={user._id}>
                        {user.username}
                        {index < otherUsers.length - 1 && ", "}
                    </span>
                ));
            }
            return otherUsers.map(user => <span key={user._id}>{user.username}</span>);
        }
        return null;
    };

    return ( 
        <Stack 
            direction="horizontal" 
            className=" user-card align-items-center p-2 justify-content-between mt-2" 
            role="button" 
            tabIndex={0}
        >
            <div className="text-content">
                <div className="name">
                    {renderUsernames()}
                </div>
                <div className="text">Hello. How are you?</div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">5/24/2024</div>
                <div className="this-user-notifications">4</div>
                {!chat.is_group && otherUsers.some(user => isUserOnline(user._id)) && (
                    <span className="user-online"></span>
                )}
            </div>
        </Stack>
    );
};
 
export default UserChat;
