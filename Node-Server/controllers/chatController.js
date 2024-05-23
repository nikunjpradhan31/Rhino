// create a chat
// get all chats for each user
// finding a certain chat

const chatModel = require("../models/ChatModel");


//creating a new chat between two users
const createChat = async(req, res) => {
    const {FirstId, SecondId} = req.body;
    //find if the chat already exists
    try{
        const chat = await chatModel.findOne({members: {$all: [firstId, secondId]}});
        if(chat) return res.status(200).json(chat);

        const newChat = new chatModel({members : [firstId,SecondId]});
        const response = await newChat.save()
        res.status(200).json(response);


    }
    catch(error){
        res.status(500).json(error)
    }
}
//return all the chats of a user
const getUsersChats = async(req, res) => {
    const userID = req.params.userID;
    try{
        const chats = await chatModel.find({
            members: {$in: [userID]}
        })
    res.status(200).json(chats);
    }catch(error){
        res.status(500).json(error);
    }


}

const findChat = async(req,res) => {
    const {FirstId,SecondId} = req.params;
    try{
        const chats = await chatModel.find({
            members: {$all: [FirstId,SecondId]},
        });
    res.status(200).json(chats);
    }catch(error){
        res.status(500).json(error);
    }
}

module.exports = {createChat, getUsersChats};