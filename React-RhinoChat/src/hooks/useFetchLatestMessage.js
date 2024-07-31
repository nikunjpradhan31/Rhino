import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";
import { AuthContext } from "../context/AuthContext";
export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);
    const {user} = useContext(AuthContext);

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);
            if (response && !response.error) {
                setLatestMessage(response);
            }
        };

        if (chat?._id) {
            getMessages();
        }
    }, [chat?._id, newMessage, notifications, user]);

    return { latestMessage };
};
