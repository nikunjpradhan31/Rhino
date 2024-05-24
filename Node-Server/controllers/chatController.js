// create a chat
// get all chats for each user
// finding a certain chat

const chatModel = require("../models/ChatModel");


//creating a new chat between two users
const createChat = async(req, res) => {
    const {FirstId, SecondId} = req.body;
    //find if the chat already exists
    try{
        const chat = await chatModel.findOne({members: {$all: [FirstId, SecondId]}});
        if(chat) return res.status(200).json(chat);

        const newChat = new chatModel({members : [FileListirstId,SecondId]});
        const response = await newChat.save()
        res.status(200).json(response);


    }
    catch(error){
        res.status(500).json(error)
    }
}
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

const findChat = async(req,res) => {
    const {FirstId,SecondId} = req.params;
    try{
        const chat = await chatModel.findOne({
            members: {$all: [FirstId,SecondId]},
        });
    res.status(200).json(chat);
    }catch(error){
        res.status(500).json(error);
    }
}

module.exports = {createChat, getUsersChats, findChat};