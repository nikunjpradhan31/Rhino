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
