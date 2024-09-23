const mongoose = require("mongoose");


const fileSchema = new mongoose.Schema({
    file : {type: Buffer, required: true },
    fileName : {type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    },
    {
    timestamps: true,
    });

const FileModel = mongoose.model("Files", fileSchema);

module.exports = FileModel;