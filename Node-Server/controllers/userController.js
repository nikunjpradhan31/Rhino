const userModel = require("../models/UserModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const registerUser = async (req, res) => { 
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json("All fields are required");
        }

        if(username.length<5){
            return res.status(400).json("Username is too short");
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json("Email is not valid");
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json("Password must be a strong password");
        }

        let user = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (user) {
            return res.status(400).json("User with given username or email already exists");
        }

        user = new userModel({ username, email, password });

        const salt = await bcrypt.genSalt(10); // Typically a salt rounds of 10 is used, but 20 is very strong
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, username, email, token });
    } catch (error) {
        res.status(500).json(error);
    }
};

const createToken = (_id) => {
    const jwtkey = process.env.JWT_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
}

const loginUser = async(req, res) => {
    const {username,password} = req.body;

    try{
        let user = await userModel.findOne({username});
        if(!user) return res.status(400).json("Invalid username or password");

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if(!isValidPassword) return res.status(400).json("Invalid username or password");


        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, username, email: user.email, token });

    }catch(error){
        res.status(500).json(error);

    }
}

const findUser = async(req,res) => {
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId);
        res.status(200).json(user);
    }
    catch{
        res.status(500).json(error);

    }
};

const getUsers = async(req,res) => {
    try{
        const user = await userModel.find();
        res.status(200).json(user);
    }
    catch{
        res.status(500).json(error);

    }
};
module.exports = { registerUser, loginUser, findUser, getUsers};
