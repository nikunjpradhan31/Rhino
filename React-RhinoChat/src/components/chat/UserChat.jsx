import { useContext } from "react";
import { useFetchOtherUser } from "../../hooks/useFetchOtherUser";
import { Stack } from "react-bootstrap";
import { ChatContext } from "../../context/ChatContext";

const UserChat = ({chat,user}) => {
    const {otherUsers} = useFetchOtherUser(chat,user);
    const {onlineUsers} = useContext(ChatContext);
    const isOnline = onlineUsers?.some((user) => user?.userId === otherUsers?._id);
    return ( 
    <Stack direction="horizontal" className =" d-flex user-card align-items-center p-2 justify-content-between "role="button" tabIndex={0}>
            <div className="text-content ">
            <div className="name">
                {Array.isArray(otherUsers) && otherUsers.length > 0 && !chat.is_group 
                    ? otherUsers.map(user => <span key={user._id}>{user.username}</span>)
                    : chat.is_group && chat.chatTitle 
                        ? chat.chatTitle 
                        : Array.isArray(otherUsers) && otherUsers.length > 0
                            ? otherUsers.map((user, index) => (
                                <span key={user._id}>
                                    {user.username}
                                    {index < otherUsers.length - 1 && ", "}
                                </span>
                            ))
                            : null
                }
            </div>
            <div className="text">Hello. How are you?</div>
            </div>
            <div className="d-flex flex-column align-items-end ">
                <div className="date">
                    5/24/2024
                </div>
                <div className="this-user-notifications">4</div>
                <span className={isOnline ? "user-online" : ""}></span>
            </div>
    </Stack> );
};
 
export default UserChat;