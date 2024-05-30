import { createContext , useState, useEffect, useCallback} from "react";
import { baseUrl, getRequest, postRequest , getRequestUser} from "../utils/services";
import {Container, Stack} from "react-bootstrap";
export const ChatContext = createContext();

export const ChatContextProvider = ({children,user}) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatError, setUserChatsError] = useState(null);
    
    useEffect(()=>{
        const getUserChats = async()=>{
            if(user?._id){
                setIsUserChatsLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                setIsUserChatsLoading(false);
                if(response.error){
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        }
        getUserChats();
    },[user]);

    const [newUserError, setNewUserError] = useState(null);
    const [isNewUserLoading, setIsNewUserLoading] = useState(false);
    const [otherUser, setOtherUser] = useState(null);
///fix ERROR with bad request
    const findNewUser = useCallback(async (username) => {
        setIsNewUserLoading(true);
        setNewUserError(null);
    
          const response = await getRequestUser(`${baseUrl}/users/findsingle/${username}`);
          setIsNewUserLoading(false);

         if(response && response.error){
            return setNewUserError(response);
          }
          else {
            setOtherUser(response);
          }

      }, []);

    const createChat = useCallback(async(FirstId, SecondId)=>{
        if(FirstId !== null && SecondId !==null){
        const response = await postRequest(`${baseUrl}/chats/`,JSON.stringify({
            FirstId, SecondId,
        }));
        if(response.error){
            return console.log("Error");
        }
        setUserChats((prev) => [...prev, response]);
    }
    },[])

    const [ currentChat, setCurrentChat] = useState(null);

    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChat(chat);
    },[]);

    const [messages, Setmessages] = useState(null);
    const [isMessagesLoading,setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);

    useEffect(()=>{
        const getMessages = async()=>{
            setMessagesLoading(true);
            setMessagesError(null);
                const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
                setMessagesLoading(false);
                if(response.error){
                    return setMessagesError(response);
                }
                Setmessages(response);
        }
        getMessages();

    },[currentChat]);

    const [sendTextMessageError, setTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);

    const sendMessage = useCallback( async (textMessage, sender, currentChatId, setTextMessage)=> {
        if(!textMessage) return;

        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            senderId: sender._id,
            text: textMessage,
            chatId: currentChatId
        }))
        if(response.error){
            return setTextMessageError(response);
        }
        setNewMessage(response);
        Setmessages((prev)=>[...prev, response]);
        setTextMessage("");



    },[]);

    return (<ChatContext.Provider value = {{userChats, isUserChatsLoading ,userChatError, newUserError,
        isNewUserLoading,otherUser,findNewUser,createChat, updateCurrentChat,messages, isMessagesLoading, messagesError,currentChat, sendMessage}}>{children}</ChatContext.Provider>);
}