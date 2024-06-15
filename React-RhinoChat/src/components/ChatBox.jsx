import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useFetchOtherUser } from "../hooks/useFetchOtherUser";
import{ Button, Stack} from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import AddUsersToChatModal from "./AddUsersToChat";
const ChatBox = () => {
    const {user} = useContext(AuthContext);
    const {currentChat, messages, isMessagesLoading, messageError, sendMessage} = useContext(ChatContext);
    const {otherUsers} = useFetchOtherUser(currentChat, user);
    const [textMessage, setTextMessage] = useState("");
    if(otherUsers.length === 0){ return(<p style={{ textAlign:"center", width: "100%"}}>No conversation selected yet...</p>);}
    if(isMessagesLoading){ return(<p style={{ textAlign:"center", width: "100%"}}>Retrieving conversation...</p>);}
    return (
    <>
    <Stack gap = {4} className="chat-box">
    <div className="chat-header">
    <>
    {(() => {
        if (Array.isArray(otherUsers) && otherUsers.length > 0) {
            if (currentChat.chatTitle) {
                return <strong style={{ paddingLeft: "5%" }}>{currentChat.chatTitle}</strong>;
            }
            else {
                const usernames = otherUsers.map(user => user.username); // Extracting usernames
                const userListString = usernames.join(", "); // Joining usernames into a string
                return <strong style={{ paddingLeft: "5%" }}>{userListString}</strong>;
            }
        }
        return null;
    })()}
</>

        <><AddUsersToChatModal/></>
    </div>
    <Stack gap ={3} className="messages">
    {messages && messages.map((message, index) => {
const sender = otherUsers.find(user => user._id === message.senderId);
                return (
                    <Stack 
                        key={index} 
                        className={`${message?.senderId === user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}
                    >
                        <span>{message.text}</span>
                        <span className="message-footer">{moment(message.createdAt).calendar()}</span>
                        {currentChat?.is_group && sender && (
                            <span className="message-footer">Sent by: {sender.username}</span>
                        )}
                    </Stack>
                );
            })}
    </Stack>
    <Stack direction="horizontal" gap={4} className="chat-input flex-grow-0">
        <Button className = "send-btn" onClick={()=>sendMessage(textMessage,user,currentChat._id,setTextMessage)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
            </svg>
        </Button>
        <InputEmoji value = {textMessage}  onChange={setTextMessage} borderColor="dark"/>

    </Stack>
    </Stack>
    </>);
};
 
export default ChatBox;