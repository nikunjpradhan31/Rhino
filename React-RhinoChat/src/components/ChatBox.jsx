import { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useFetchOtherUser } from "../hooks/useFetchOtherUser";
import{ Button, Stack} from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import ChatSettings from "./ChatSettings";
const ChatBox = () => {
    const {user} = useContext(AuthContext);
    const {currentChat, messages, isMessagesLoading, messageError, sendMessage,downloadFile, handleGetFile,currentFileToUpload, setCurrentFileToUpload} = useContext(ChatContext);
    const {otherUsers} = useFetchOtherUser(currentChat, user);
    const [textMessage, setTextMessage] = useState("");
    const scroll = useRef();



    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior: "smooth", block: "end"});
    },[messages]);
    if(otherUsers.length === 0){ return(<p style={{ textAlign:"center", width: "100%"}}>No conversation selected yet...</p>);}
    if(isMessagesLoading){ return(<p style={{ textAlign:"center", width: "100%"}}>Retrieving conversation...</p>);}
    return (
    <>
    <Stack  className="chat-box">
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

        <><ChatSettings/></>
    </div>
    <Stack gap ={3} className="messages">
    {messages && messages.map((message, index) => {
const sender = otherUsers.find(user => user._id === message.senderId);
                return (
                    <Stack 
                        key={index} 
                        className={`${message?.senderId === user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}
                        ref = {scroll}
                    >
                           <span>
                            {message.hasFile ? (
                                <>
                                    {message.text}
                                    <button 
                                        onClick={() => downloadFile(message.fileId)} // Adjust the path based on your API
                                        className=" text-gray"
                                    >
                                    <svg className="w-10 h-10 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                    </svg>

                                    </button>
                                </>
                            ) : (
                                <span>{message.text}</span>
                            )}
                        </span>



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
        <label className="flex items-center cursor-pointer">
            <input 
                type="file" 
                onChange={handleGetFile} 
                hidden={true}
            />
            <svg 
                className="w-6 h-6 text-gray-800 dark:text-white" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                fill="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    fillRule="evenodd" 
                    d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" 
                    clipRule="evenodd"
                />
            </svg>
            {/* <span className="ml-2">Upload File</span> */}
        </label>
        <InputEmoji 
            value={textMessage}  
            onChange={setTextMessage} 
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Prevents the default action, like adding a newline in the input
                    sendMessage(textMessage, user, currentChat._id, setTextMessage);
                }
            }}
            borderColor="dark"
        />
    </Stack>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
    {currentFileToUpload && (
        <a 
            href="#" 
            onClick={(e) => {
                e.preventDefault(); // Prevent the default anchor behavior
                setCurrentFileToUpload(null); // Reset the file
            }} 
            style={{ textDecoration: 'none', color: 'inherit' }} // Customize the link style
        >
            File uploaded: {currentFileToUpload.name}
        </a>
    )}
</div>

    </Stack>
    </>);
};
 
export default ChatBox;