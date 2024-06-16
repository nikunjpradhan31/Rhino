// create a chat
// get all chats for each user
// finding a certain chat

const chatModel = require("../models/ChatModel");


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
    const { members } = req.body; // Expecting an array of strings
    if (members.length < 2) {
        return res.status(400).json({ error: 'members must be an array with at least two user IDs' });
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

        const newChat = new chatModel({ members: members, is_group: isgroup });
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

        if(chat.members.length > 2){
            chat.is_group = true;
        }
        await chat.save();

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const LeaveChat = async (req, res) => {
//     const {}
// }


module.exports = {createChat, getUsersChats, findChat, AddToChat};