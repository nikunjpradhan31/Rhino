import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import SearchOtherUsers from "../components/chat/FIndUser";



const ChatPage = () => {
    const {user} = useContext(AuthContext);
    const {userChats, isUserChatsLoading,setUserChatsError} = useContext(ChatContext);

    return ( 
    <Container>
        <Stack direction = "horizontal" gap = {4} className="align-items-start" role="button">
            <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                <SearchOtherUsers/>
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
        </Stack>
    </Container> 
    );
};
 
export default ChatPage;