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


    return (<ChatContext.Provider value = {{userChats, isUserChatsLoading,setUserChatsError,userChatError, newUserError,
        isNewUserLoading,otherUser,findNewUser,createChat}}>{children}</ChatContext.Provider>);
}