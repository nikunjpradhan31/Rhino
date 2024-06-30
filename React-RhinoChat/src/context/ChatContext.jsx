import { createContext , useState, useEffect, useCallback} from "react";
import { baseUrl, getRequest, postRequest , getRequestUser, putRequest, deleteRequest} from "../utils/services";
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
    const [notifications, setNotifications] = useState([]);

    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect (()=> {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);
        return () =>{
            newSocket.disconnect();
        };
    },[user]);
    //online users through socket
    useEffect(()=>{
        if(socket === null) return;
        socket.emit("addNewUser",user?._id);
        socket.on("getOnlineUsers", (response)=>{
            setOnlineUsers(response);
        });
        return () =>{
            socket.off("getOnlineUsers");
        };
    },[socket]);

    //send a message through socket
    useEffect(()=>{
        if(socket === null) return;

        const otherUserId = currentChat?.members?.filter(value => value !== user?._id);
        socket.emit("sendMessage",{...newMessage, otherUserId});

    },[newMessage]);

    // //receive message and notification through socket

    useEffect(() => {
        if (socket === null) return;
    
        const handleGetMessage = (response) => {
            if (currentChat?._id !== response.chatId) return;
            Setmessages((prev) => [...prev, response]);
        };

        const handleGetNotif = (response) => {
            const isChatOpen = currentChat?._id === response.chatId;
            if(isChatOpen){
                setNotifications(prev=>[{...response, isRead:true},...prev]);
            }else{
                setNotifications(prev => [response, ...prev]);
            }
        };
        socket.on("getMessage", handleGetMessage);
        socket.on("getNotification", handleGetNotif);
    
        return () => {
            socket.off("getMessage", handleGetMessage);
            socket.off("getNotification", handleGetNotif);

        };
    }, [socket, currentChat]);

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
    },[user,notifications]);

        const fetchAllUsers = useCallback(async () => {
            setIsAllUsersLoading(true);
            setAllUsersError(null);
            const response = await getRequest(`${baseUrl}/users/`);
            setIsAllUsersLoading(false);
            if (response.error) {
                return setAllUsersError(response);
            }
            const filteredUsers = response.filter(u => u._id !== user?._id);

            setAllUsers(filteredUsers);
        }, [user]);
        useEffect(() => {
            fetchAllUsers();
        }, [fetchAllUsers]);
    

    // const findNewUser = useCallback(async (username) => {
    //     setIsNewUserLoading(true);
    //     setNewUserError(null);
    
    //       const response = await getRequestUser(`${baseUrl}/users/findsingle/${username}`);
    //       setIsNewUserLoading(false);

    //      if(response && response.error){
    //         return setNewUserError(response);
    //       }
    //       else {
    //         setOtherUser(response);
    //       }

    //   }, []);

    // const findNewUsers = useCallback(async (usernames) => {
    //     setIsNewUserLoading(true);
    //     setNewUserError(null);
    
    //     const users = [];
    //     for (const username of usernames) {
    //         const response = await getRequestUser(`${baseUrl}/users/findsingle/${username.trim()}`);
    //         if (response && response.error) {
    //             setNewUserError(response);
    //             setIsNewUserLoading(false);
    //             return;
    //         } else {
    //             users.push(response);
    //         }
    //     }
    
    //     setIsNewUserLoading(false);
    //     setOtherUser(users);
    // }, []);

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

    const createChat = useCallback(async(members)=>{
        if(members !==null){
        const chatOwner = user?._id;

        const response = await postRequest(`${baseUrl}/chats/`,JSON.stringify({members,chatOwner}));
        if(response.error){
            return console.log("Error");
        }
        setUserChats((prev) => [...prev, response]);
        updateCurrentChat(response);
    }
    },[user]);

    
    // const createChat = useCallback(async(FirstId, SecondId)=>{
    //     if(FirstId !== null && SecondId !==null){
    //     const response = await postRequest(`${baseUrl}/chats/`,JSON.stringify({
    //         FirstId, SecondId,
    //     }));
    //     if(response.error){
    //         return console.log(error);
    //     }
    //     setUserChats((prev) => [...prev, response]);
    // }
    // },[]);


    const changeChatTitle = useCallback(async (currentChat, chatTitle )=>{
        if(currentChat?.chatOwner === user?._id && currentChat?.is_group){
            const response = await putRequest(`${baseUrl}/chats/changeName/${chatTitle}/${currentChat._id}`);
            if(response.error){
                return console.log("Error");
            }
            updateCurrentChat(response);
        }
    },[user]);

    const deleteGroupChat = useCallback(async (currentChat)=>{
        if (currentChat?.is_group && user?._id === currentChat?.chatOwner) {
            const response = await deleteRequest(`${baseUrl}/chats/delete/${currentChat._id}/${user?._id}`);
            if(response.error){
                return console.log("Error");
            }
            updateCurrentChat([]);
        }
    },[user]);

    const leaveGroupChat = useCallback(async (currentChat)=>{
        if (currentChat?.is_group && user?._id !== currentChat?.chatOwner) {
            const response = await putRequest(`${baseUrl}/chats/leave/${currentChat._id}/${user?._id}`);
            if(response.error){
                return console.log("Error");
            }
            updateCurrentChat([]);
        }
    },[user]);

    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChat(chat);
    },[user]);

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

    const markThisUserNotifAsRead = useCallback((thisUserNotifications, notifications)=>{
        const mNotifications = notifications.map(el=> {
            let notification;
            thisUserNotifications.forEach(n=>{
                if(n.chatId === el.chatId){
                    notification = {...n,isRead: true}
                }else{
                    notification = el;
                }
            })
            return notification;
        })
        setNotifications(mNotifications);
    },[]);

    return (<ChatContext.Provider 
        value = {{
            userChats, 
            isUserChatsLoading,
            userChatError,
            newUserError,
            isNewUserLoading,
            otherUser,
            createChat, 
            updateCurrentChat,
            messages, 
            isMessagesLoading, 
            messagesError,
            currentChat, 
            sendMessage, 
            onlineUsers,
            AddToChat, 
            allUsers,
            notifications,
            markThisUserNotifAsRead,
            changeChatTitle,
            deleteGroupChat,
            leaveGroupChat,
        }}>{children}</ChatContext.Provider>);
}