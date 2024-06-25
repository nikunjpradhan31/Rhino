import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);
            if (response && !response.error && Array.isArray(response)) {
                const lastMessage = response[response.length - 1];
                setLatestMessage(lastMessage);
            }
        };

        if (chat?._id) {
            getMessages();
        }
    }, [chat?._id, newMessage, notifications]);

    return { latestMessage };
};
