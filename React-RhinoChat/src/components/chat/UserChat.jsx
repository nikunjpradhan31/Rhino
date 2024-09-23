import React, { useContext } from "react";
import { useFetchOtherUser } from "../../hooks/useFetchOtherUser";
import { Stack } from "react-bootstrap";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
    const { otherUsers } = useFetchOtherUser(chat, user);
    const { onlineUsers, notifications, markThisUserNotifAsRead } = useContext(ChatContext);
    const {latestMessage} = useFetchLatestMessage(chat);
    const isUserOnline = (userId) => onlineUsers?.some(onlineUser => onlineUser.userId === userId);
    const unreadNotifications = unreadNotificationsFunc(notifications);
    const thisUserNotifications = unreadNotifications?.filter(not=>not.chatId ==chat?._id);
    const truncateText = (text) => {
        let shortText = text.substring(0, 20);
        if(text.length>20){
            shortText = shortText + "...";
        }
        return shortText;
    };

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
            gap={3}
            onClick = {()=>{
                if(thisUserNotifications?.length !== 0){
                    markThisUserNotifAsRead(
                        thisUserNotifications,
                        notifications
                    );
                }
            }}
            tabIndex={0}
        >
            {!chat.is_group ? 
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="8vh" height="8vh" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clipRule="evenodd"/>
                </svg>
                :
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="8vh" height="8vh" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clipRule="evenodd"/>
                </svg>
            }               

            <div className="text-content">
                <div className="name">
                    {renderUsernames()}
                </div>
                <div className="text">{
                    latestMessage?.text && (
                        <span>{truncateText(latestMessage?.text)}</span>
                    )
                    }</div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
                <div className={chat?.unreadMessages[user?._id] > 0 ? "this-user-notifications" : ""}>
                    {chat?.unreadMessages[user?._id] > 0 ? chat?.unreadMessages[user?._id] : ""}
                </div>
                {!chat.is_group && otherUsers.some(user => isUserOnline(user._id)) && (
                    <span className="user-online"></span>
                )}
            </div>
        </Stack>
    );
};
 
export default UserChat;
