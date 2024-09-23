const messageModel = require("../models/messageModel");
const chatModel = require("../models/ChatModel");
const FileModel = require("../models/FileModel");

// creating a new message

const createMessage = async (req,res) => {
    const {chatId, senderId, text} = req.body;
    const file = req.file;
    let fileEntry;
    const message = new messageModel({
        chatId,senderId,text, hasFile: false,
    });

    if (file){
        fileEntry = new FileModel({
            file: file.buffer,
            fileName: file.originalname,
            mimeType: file.mimetype,
            size: file.size, 
        });
    }

    try{

        if (file){
            try{
            const fileresponse = await fileEntry.save();
            message.fileId = fileresponse._id;
            message.hasFile = true;
            }
            catch(error){
                return res.status(500).json({ message: 'File upload failed', error: error.message });
            }
        }

        const chat = await chatModel.findOne({
            _id: chatId
        });

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

const getFile = async (req, res) => {
    const { fileId } = req.params; // Correct way to extract fileId
    
    try {
        const fileEntry = await FileModel.findById(fileId);
        
        if (!fileEntry) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.set('Content-Type', 'application/octet-stream'); // Set appropriate content type
        res.set('Content-Disposition', `attachment; filename="${fileEntry.fileName}"`); // Suggest a filename for download
        res.send(fileEntry.file); // Send the file buffer in the response
    } catch (error) {
        console.error("File retrieval error:", error); // Log the error for debugging
        res.status(500).json({ message: 'Error retrieving file', error: error.message });
    }
 };

module.exports = {createMessage, getMessages, getLatestMessages,getFile};