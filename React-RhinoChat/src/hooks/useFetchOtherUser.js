import {useState, useEffect} from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

// export const useFetchOtherUser = (chat,user) => {
//     const [otherUser, setOtherUser] = useState(null);
//     const [error,setError] = useState(null);

//     const otherUser_Id = chat?.members.find((id) => id !==user?._id);
//     useEffect(()=>{
//         const getUser = async()=>{
//             if(!otherUser_Id)return null;
//             const response = await getRequest(`${baseUrl}/users/find/${otherUser_Id}`);
//             if(response.error){
//                 return setError(response);
//             }
//             setOtherUser(response);

//         };
//         getUser();
//     },[otherUser_Id]);
//     return {otherUser, error};
// };


export const useFetchOtherUser = (chat, user) => {
    const [otherUsers, setOtherUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            if (!chat || !Array.isArray(chat.members) || chat.members.length === 0) {
                return setOtherUsers([]);
            }

            const otherUserIds = chat.members.filter(id => id !== user?._id);

            if (otherUserIds.length === 0) {
                return setOtherUsers([]);
            }

            try {
                // Fetch all other users in parallel
                const userRequests = otherUserIds.map(async userId => {
                    const response = await getRequest(`${baseUrl}/users/find/${userId}`);
                    if (response.error) {
                        return setError(response);
                    }
                    return response;
                });
                const otherUsersData = await Promise.all(userRequests);
                setOtherUsers(otherUsersData);
            } catch (error) {
                setError(error.message);
            }
        };

        getUsers();
    }, [chat, user]);

    return { otherUsers, error };
};
