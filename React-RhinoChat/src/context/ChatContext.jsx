import { createContext , useState, useEffect, useCallback} from "react";
import { baseUrl, getRequest, postRequest , getRequestUser, putRequest} from "../utils/services";
import {Container, Stack} from "react-bootstrap";
import { io } from "socket.io-client";
export const ChatContext = createContext();

export const ChatContextProvider = ({children,user}) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatError, setUserChatsError] = useState(null);
    const [newUserError, setNewUserError] = useState(null);
    const [isNewUserLoading, setIsNewUserLoading] = useState(false);
    const [otherUser, setOtherUser] = useState(null);
    const [ currentChat, setCurrentChat] = useState(null);
    const [messages, Setmessages] = useState(null);
    const [isMessagesLoading,setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [isAllUsersLoading, setIsAllUsersLoading] = useState(false);
    const [allUsersError, setAllUsersError] = useState(null);

    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    // console.log("onlineUsers",onlineUsers);
    // useEffect (()=> {
    //     const newSocket = io("http://localhost:3000");
    //     setSocket(newSocket);
    //     return () =>{
    //         newSocket.disconnect();
    //     };
    // },[user]);

    // //online users through socket
    // useEffect(()=>{
    //     if(socket === null) return;
    //     socket.emit("addNewUser",user?._id);
    //     socket.on("getOnlineUsers", (response)=>{
    //         setOnlineUsers(response);
    //     });
    //     return () =>{
    //         socket.off("getOnlineUsers");
    //     };
    // },[socket]);

    // //send a message through socket
    // useEffect(()=>{
    //     if(socket === null) return;

    //     const otherUserId = currentChat?.members?.find((id)=> id!== user?._id);
    //     socket.emit("sendMessage",{...newMessage, otherUserId});

    // },[newMessage]);

    // //receive message through socket

    // useEffect(()=>{
    //     if(socket === null) return;

    //     socket.on("getMessage", response =>{
    //         if(currentChat?._id !== response.chatId) return
    //         Setmessages((prev) =>[...prev, response])
    //     });

    //     return () =>{
    //         socket.off("getMessage");
    //     }

    // },[socket,currentChat]);

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



    
        const fetchAllUsers = useCallback(async () => {
            setIsAllUsersLoading(true);
            setAllUsersError(null);
            const response = await getRequest(`${baseUrl}/users/`);
            setIsAllUsersLoading(false);
            if (response.error) {
                return setAllUsersError(response);
            }
            setAllUsers(response);
        }, []);
    
        useEffect(() => {
            fetchAllUsers();
        }, [fetchAllUsers]);
    



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

      const AddToChat = useCallback(async(chatId, newMemberId)=>{

        if(chatId !== null && newMemberId !==null){
        const response = await putRequest(`${baseUrl}/chats/add/${newMemberId}/${chatId}`);
        if(response.error){
            return console.log(error);
        }
        setUserChats((prevChats) => 
            prevChats.map((chat) =>
                chat._id === chatId ? { ...chat, ...response } : chat
            )
        );
        }
    },[]);
    // const createChat = useCallback(async(members)=>{
    //     if(members !==null){
    //     const response = await postRequest(`${baseUrl}/chats/`,JSON.stringify({members}));
    //     if(response.error){
    //         return console.log("Error");
    //     }
    //     setUserChats((prev) => [...prev, response]);
    // }
    // },[])
    const createChat = useCallback(async(FirstId, SecondId)=>{
        if(FirstId !== null && SecondId !==null){
        const response = await postRequest(`${baseUrl}/chats/`,JSON.stringify({
            FirstId, SecondId,
        }));
        if(response.error){
            return console.log(error);
        }
        setUserChats((prev) => [...prev, response]);
    }
    },[]);



    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChat(chat);
    },[]);

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
        isNewUserLoading,otherUser,findNewUser,createChat, updateCurrentChat,messages, isMessagesLoading, messagesError,currentChat, sendMessage, onlineUsers, AddToChat, allUsers}}>{children}</ChatContext.Provider>);
}