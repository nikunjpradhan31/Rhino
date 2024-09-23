import { createContext , useState, useEffect, useCallback} from "react";
import { baseUrl, getRequest, postRequest , postRequestFormData, putRequest, deleteRequest} from "../utils/services";
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
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [FilteredUsersLoading, setFilteredUsersLoading] = useState("");
    const [filteredUsersAdd, setFilteredUsersAdd] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [FilteredUsersAddLoading, setFilteredUsersAddLoading] = useState("");
   // const [allUsers, setAllUsers] = useState([]);
    //const [isAllUsersLoading, setIsAllUsersLoading] = useState(false);
    //const [allUsersError, setAllUsersError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [currentFileToUpload, setCurrentFileToUpload] = useState(null);

    

    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect (()=> {
       const newSocket = io("http://localhost:3000");
       // const newSocket = io("https://b5wj73nk-3000.use2.devtunnels.ms/");

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

    //receive message and notification through socket

    useEffect(() => {
        if (socket === null) return;
    
        const handleGetMessage = (response) => {
            if (currentChat?._id !== response.chatId) return;
            Setmessages((prev) => [...prev, response]);
        };

        const handleGetNotif = (response) => {
            const isChatOpen = currentChat?._id === response.chatId;
            if(isChatOpen){
                setNotifications(prev=>[{...response},...prev]);
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

    const getUserChats = useCallback(async()=>{
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
    },[]);

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


    const SearchForUsers = useCallback(async(SearchString)=>{
            if( SearchString.length > 0){
            setFilteredUsersLoading(true);
                const response = await getRequest(`${baseUrl}/users/${SearchString}`);
                // Check for response error
                if (response.error) {
                    setFilteredUsers([]);
                } else {
                    // Filter users based on selectedUsers
                    const filtered = response.filter(user => 
                        !selectedUsers.some(Suser => Suser._id === user._id)
                    );
                    setFilteredUsers(filtered);
                }
                setFilteredUsersLoading(false);
        }
        else{
            setFilteredUsers([]);
        }
    },[]);

    const SearchForUsersToAdd = useCallback(async(SearchString)=>{
            if( SearchString.length > 0){
                setFilteredUsersAddLoading(true);
                const response = await getRequest(`${baseUrl}/users/${SearchString}`);
                // Check for response error
                if (response.error) {
                    setFilteredUsersAdd([]);
                } else {
                    // Filter users based on selectedUsers
                    const filtered = response.filter(user => 
                        !selectedUser.some(Suser => Suser._id === user._id)
                    );
                    setFilteredUsersAdd(filtered);
                }
                setFilteredUsersAddLoading(false);
        }
        else{
            setFilteredUsersAdd([]);
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

    const downloadFile = useCallback(async (fileId) => {
        if (fileId) {
            try {
                const response = await fetch(`${baseUrl}/messages/file/${fileId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/octet-stream', // Optional header
                    },
                });
    
                if (!response.ok) {
                    console.log("Unable to Download Image");
                    return; // Exit if the response is not OK
                }
    
                const blob = await response.blob(); // Create a blob from the response
                const url = window.URL.createObjectURL(blob); // Create an object URL
    
                const link = document.createElement('a'); // Create a link element
                link.href = url;
                link.download = `file_${fileId}`; // Customize the filename
                document.body.appendChild(link); // Append to body
                link.click(); // Programmatically click the link
                document.body.removeChild(link); // Clean up
    
                window.URL.revokeObjectURL(url); // Free up memory
            } catch (error) {
                console.error("Error downloading file:", error);
            }
        }
    }, [baseUrl]); 


    const handleGetFile = useCallback(async (event) => {
        const file = event.target.files[0];
        const maxFileSize = 8 * 1024 * 1024; // 8 MB in bytes
    
        if (file) {
            if (file.size > maxFileSize) {
                alert("The file is too large. Please select a file smaller than 10 MB.");
                return;
            }
            setCurrentFileToUpload(file);
        }
    }, []);

    const changeChatTitle = useCallback(async (currentChat, chatTitle )=>{
        if(currentChat?.chatOwner === user?._id && currentChat?.is_group){
            const response = await putRequest(`${baseUrl}/chats/changeName/${chatTitle}/${currentChat._id}`);
            if(response.error){
                return console.log("Error");
            }
            updateCurrentChat(response);
            setUserChats((prevChats) => 
                prevChats.map((chat) =>
                    chat._id === response._id ? { ...chat, ...response } : chat
                )
            );

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
        if(chat !== null){
            chat.unreadMessages[user?._id] = 0;
        }
        setCurrentChat(chat);
    },[user]);

    useEffect(()=>{
        if(currentChat !== null && user !==null){
        const getMessages = async()=>{
            setMessagesLoading(true);
            setMessagesError(null);
                const response = await getRequest(`${baseUrl}/messages/getmessages/${currentChat?._id}/${user?._id}`);
                setMessagesLoading(false);
                if(response.error){
                    return setMessagesError(response);
                }
                Setmessages(response);
        }
        getMessages();
    }
    },[currentChat,user]);

    // const sendMessage = useCallback( async (textMessage, sender, currentChatId, setTextMessage, currentFileToUpload)=> {
    //     if(!textMessage) return;

    //     const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
    //         senderId: sender._id,
    //         text: textMessage,
    //         chatId: currentChatId
    //     }))
    //     if(response.error){
    //         return setTextMessageError(response);
    //     }
    //     setNewMessage(response);
    //     Setmessages((prev)=>[...prev, response]);
    //     setTextMessage("");
    //     setCurrentFileToUpload(null);



    // },[]);

    const sendMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return;
    
        const formData = new FormData();
        formData.append('senderId', sender._id);
        formData.append('chatId', currentChatId);
        formData.append('text', textMessage);

        if (currentFileToUpload) {
            formData.append('file', currentFileToUpload);
        }
        const response = await postRequestFormData(`${baseUrl}/messages/`, formData );
    
        if (response.error) {
            return setTextMessageError(response);
        }
        
        setNewMessage(response);
        Setmessages((prev)=>[...prev, response]);
        setTextMessage("");
        setCurrentFileToUpload(null);
        // setUserChats((prevChats) => 
        //     prevChats.map((chat) =>
        //         chat._id === response._id ? { ...chat, ...response } : chat
        //     )
        // );
        }, [currentFileToUpload]);
    

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
            //allUsers,
            notifications,
            markThisUserNotifAsRead,
            changeChatTitle,
            deleteGroupChat,
            leaveGroupChat,
            getUserChats,

            filteredUsers,
            selectedUsers,
            FilteredUsersLoading,
            SearchForUsers,
            setSelectedUsers,
            setFilteredUsers,

            filteredUsersAdd,
            selectedUser,
            FilteredUsersAddLoading,
            SearchForUsersToAdd,
            setSelectedUser,
            setFilteredUsersAdd,

            downloadFile,
            handleGetFile,
            currentFileToUpload,
            setCurrentFileToUpload
        }}>{children}</ChatContext.Provider>);
}