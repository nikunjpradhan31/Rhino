import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import SearchOtherUsers from "../components/chat/FIndUser";
import ChatBox from "../components/ChatBox";


const ChatPage = () => {
    const {user} = useContext(AuthContext);
    const {userChats, isUserChatsLoading, updateCurrentChat} = useContext(ChatContext);

    return ( 
    <Container>
        <Stack direction = "horizontal" gap = {4} className="align-items-start" >
            <Stack className="messages-box flex-grow-0 pe-3" style={{ overflowY: 'auto', maxHeight: '70vh',  overflowX: 'hidden' }} gap={3} role="button">
                <SearchOtherUsers/>
            {isUserChatsLoading && <p>Retrieving Chats...</p>}
            {userChats?.map((chat,index)=>{
                return(
                    <div key={index} onClick={()=> updateCurrentChat(chat)}>
                        <UserChat chat={chat} user={user}/>
                    </div>
                );
            })}
            </Stack>
            <ChatBox/>
        </Stack>
    </Container> 
    );
};
 
export default ChatPage;