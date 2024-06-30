const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String ,required: true, minlength: 5, maxlength:25, unique: true},
    email:{type: String ,required: true, minlength: 7, maxlength:100, unique: true},
    password: {type: String, required: true, minlength: 10, maxlength:400},
    },
    {
    timestamps:true,
});

const userModel = mongoose.model("User", userSchema);

module.exports =userModel;