// create a chat
// get all chats for each user
// finding a certain chat

const chatModel = require("../models/ChatModel");
const messageModel = require("../models/messageModel");
const fileModel = require("../models/FileModel");

//creating a new chat between two users
// const createChat = async(req, res) => {
//     const {FirstId, SecondId} = req.body;
//     //find if the chat already exists
//     try{
//         const chat = await chatModel.findOne({
//             members: { $all: [FirstId, SecondId], $size: 2 }, is_group: false
//         });
//         if(chat) return res.status(200).json(chat);
//         console.log("newchat");
//         const newChat = new chatModel({members : [FirstId,SecondId]});
//         const response = await newChat.save()
//         res.status(200).json(response);


//     }
//     catch(error){
//         res.status(500).json(error)
//     }
// }

const createChat = async (req, res) => {
    const { members, chatOwner} = req.body; // Expecting an array of strings
    if (members.length < 2) {
        return res.status(400).json({ error: 'There must be two users to create a chat' });
    }
    let isgroup = false;
    if(members.length > 2){
        isgroup = true;
    }

    try {
        // Find if the chat already exists with the same set of members
        const chat = await chatModel.findOne({ members: { $all: members, $size: members.length } });
        if (chat) return res.status(200).json(chat);

        // Create a new chat with the given members

        let unreadMessages = new Map();
        members.forEach(member => {
            unreadMessages.set(member, 0);
        });

        const newChat = new chatModel({ members: members, is_group: isgroup, chatOwner: chatOwner, unreadMessages: unreadMessages});

        const response = await newChat.save();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//return all the chats of a user
const getUsersChats = async(req, res) => {
    const userId = req.params.userId;
    try{
        const chats = await chatModel.find({
            members: {$in: [userId]}
        })
    res.status(200).json(chats);
    }catch(error){
        res.status(500).json(error);
    }


}

// const findChat = async(req,res) => {
//     const {FirstId,SecondId} = req.params;
//     try{
//         const chat = await chatModel.findOne({
//             members: {$all: [FirstId,SecondId]},
//         });
//     res.status(200).json(chat);
//     }catch(error){
//         res.status(500).json(error);
//     }
// }
const findChat = async(req, res) => {
    const  {members}  = req.body;
    console.log(members);
    if (!members|| !Array.isArray(members) || members.length < 2) {
        return res.status(400).json({ error: "Invalid Chat Search" });
    }
    try {
        const chat = await chatModel.findOne({
            members: { $all: members },
        });
        if(!chat){
            return res.status(404).json({error: "Chat Not Found"})
        }
        console.log("chat");
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
};

const AddToChat = async (req, res) => {
    const { newMemberId, chatId } = req.params;

    if (!newMemberId) { 
        return res.status(400).json({ error: "Please input a User" });
    }
    try {
        const chat = await chatModel.findById(chatId);

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        if(chat.members.includes(newMemberId)){
            return res.status(400).json({error: "User is already in Chat"});
        }
        chat.members.push(newMemberId);

        chat.unreadMessages.set(newMemberId, 0);
        if(chat.members.length > 2){
            chat.is_group = true;
        }
        await chat.save();

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const ChangeGroupChatName = async (req, res) => {
    const { chatTitle, chatId } = req.params;

    if (!chatTitle || chatTitle === "") { 
        return res.status(400).json({ error: "Please input a valid chat title" });
    }
    try {
        const chat = await chatModel.findById(chatId);

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        if(chat.is_group === false){
            return res.status(404).json({ error: "This chat is not a groupchat" });
        }

        chat.chatTitle = chatTitle;
        await chat.save();

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const DeleteChat = async (req, res) => {
    const { chatId, userId } = req.params;

    if (!chatId) {
        return res.status(400).json({ error: "No chat given to delete" });
    }
    if (!userId) {
        return res.status(400).json({ error: "No user present to delete chat" });
    }

    try {
        const chat = await chatModel.findById(chatId);

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        if (chat.chatOwner !== userId) {
            return res.status(403).json({ error: "You are not the chat owner, you cannot delete this chat" });
        }

        await chatModel.findByIdAndDelete(chatId);
        await messageModel.deleteMany({chatId: chatId});
        await fileModel.deleteMany({chatId: chatId});
        return res.status(200).json({ message: "Chat successfully deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const LeaveChat = async (req, res) => {
    const {chatId, userId} = req.params;
    if(!chatId || !userId){
        return res.status(400).json({ error: "No chat was selected or no user was selected" });
    }
    try{
        const chat = await chatModel.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        if(chat.chatOwner === userId){
            return res.status(400).json({ error: "Cannot leave chat you are owner of" });
        }
        if(!chat.members.includes(userId)){
            return res.status(400).json({ error: "Cannot leave chat you are not part of" });

        }
        if(chat.members.length <= 2){
            return res.status(400).json({ error: "Chat cannot have less than 2 users, please message chat owner to delete chat" });
        }
        chat.unreadMessages.delete(userId);
        chat.members = chat.members.filter(id => id !== userId);
        await chat.save();
        res.status(200).json(chat);

    }catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {createChat, getUsersChats, findChat, AddToChat,ChangeGroupChatName, DeleteChat, LeaveChat};