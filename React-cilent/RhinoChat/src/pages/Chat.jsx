import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";


const ChatPage = () => {
    const {user} = useContext(AuthContext);
    const {userChats, isUserChatsLoading,setUserChatsError} = useContext(ChatContext);

    return ( 
    <Container>
        {userChats?.length < 1 ? null : ( 
        <Stack direction = "horizontal" gap = {4} className="align-items-start" role="button">
            <Stack className="messages-box flex-grow-0 pe-3" gap={4}>
            {isUserChatsLoading && <p>Retrieving Chats...</p>}
            {userChats?.map((chat,index)=>{
                return(
                    <div key={index}>
                        <UserChat chat={chat} user={user}/>
                    </div>
                );
            })}
            </Stack>
            ChatBox
        </Stack>)}
    </Container> 
    );
};
 
export default ChatPage;