const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    members: {type: Array, required: true},
    chatTitle: {type: String, required: false},
    is_group: { type: Boolean, default: false },
    chatOwner: {type:String, required: true},
    unreadMessages: { type: Map, of: Number, default: {} }

},
{
    timestamps: true,
}
);

const chatModel = mongoose.model("Chat",chatSchema);

module.exports = chatModel;