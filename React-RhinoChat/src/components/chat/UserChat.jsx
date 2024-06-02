import { useContext } from "react";
import { useFetchOtherUser } from "../../hooks/useFetchOtherUser";
import { Stack } from "react-bootstrap";
import { ChatContext } from "../../context/ChatContext";

const UserChat = ({chat,user}) => {
    const {otherUser} = useFetchOtherUser(chat,user);
    const {onlineUsers} = useContext(ChatContext);
    const isOnline = onlineUsers?.some((user) => user?.userId === otherUser?._id);
    return ( 
    <Stack direction="horizontal" className =" d-flex user-card align-items-center p-2 justify-content-between "role="button" tabIndex={0}>
            <div className="text-content ">
                <div className="name">{otherUser?.username}</div>
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