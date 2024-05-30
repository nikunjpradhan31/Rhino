import {useState, useEffect} from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchOtherUser = (chat,user) => {
    const [otherUser, setOtherUser] = useState(null);
    const [error,setError] = useState(null);

    const otherUser_Id = chat?.members.find((id) => id !==user?._id);
    useEffect(()=>{
        const getUser = async()=>{
            if(!otherUser_Id)return null;
            const response = await getRequest(`${baseUrl}/users/find/${otherUser_Id}`);
            if(response.error){
                return setError(response);
            }
            setOtherUser(response);

        };
        getUser();
    },[otherUser_Id]);
    return {otherUser, error};
};