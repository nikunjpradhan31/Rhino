const messageModel = require("../models/messageModel");
const chatModel = require("../models/ChatModel");

// creating a new message

const createMessage = async (req,res) => {
    const {chatId, senderId, text} = req.body;

    const message = new messageModel({
        chatId,senderId,text
    });
    try{

    const chat = await chatModel.findOne({
        _id: chatId
    });
    console.log(chat);
    chat.members.forEach(member => {
        if(member !== senderId){
        chat.unreadMessages.set(member, (chat.unreadMessages.get(member || 0)+1));
        }
    });

        await chat.save();
        const response = await message.save();
        res.status(200).json(response);
    }catch(error){
        res.status(500).json(error);

    }
};

//retrieving messages for a conversation
const getMessages = async (req, res) => {
    const {chatId,getterId} = req.params;
    try{
        const chat = await chatModel.findOne({
            _id: chatId
        });
        chat.unreadMessages.set(getterId,0);
        await chat.save();
        const messages = await messageModel.find({chatId});
    res.status(200).json(messages);
    }catch(error){
        res.status(500).json(error);
    }

};


const getLatestMessages = async (req, res) => {
    const {chatId} = req.params;
    try{
        const messages = await messageModel.find({ chatId });
        const message = messages.length > 0 ?  messages[messages.length-1]: null;
    res.status(200).json(message);
    }catch(error){
        res.status(500).json(error);
    }

};

module.exports = {createMessage, getMessages, getLatestMessages};