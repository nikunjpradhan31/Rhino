const userModel = require("../models/UserModels");
const TempUserModel = require("../models/TempUserModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const nodemailer = require("nodemailer");
const config = require('./../config')

const registerUser = async (req, res) => { 
    try {
        const { username, email, password, confirmpassword } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json("All fields are required");
        }

        if (confirmpassword !== password) {
            return res.status(400).json("Passwords must be the same");
        }

        if (username.length < 5) {
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

        // Email Verification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Ensure EMAIL and EMAIL_PASSWORD are set in your environment
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const emailToken = jwt.sign(
            { email }, 'ourSecretKey', { expiresIn: '10m' } // 'ourSecretKey' should be securely stored and managed
        );

        const mailConfig = {
            from: process.env.EMAIL, // This is good; pulls sender from environment
            to: email, // Make sure 'email' variable is defined and contains the recipient's email address
            subject: 'RhinoChat Email Verification',
            text: `Hi! There, You have recently visited 
                   our website and entered your email.
                   Please follow the given link to verify your email:
                   http://localhost:5000/verify/${emailToken} 
                   Thanks`
        };

        transporter.sendMail(mailConfig, function(error, info) {
            if (error) {
                console.error('Error sending email:', error); // Log the error for debugging
                return res.status(500).json("Error sending verification email");
            }
            console.log('Email sent:', info.response); // Log more info about the 'info' returned by sendMail
        });
        // Email Verification
        const salt = await bcrypt.genSalt(10); // Typically a salt rounds of 10 is used, but 20 is very strong
        hashedPassword = await bcrypt.hash(password, salt);
        tempUser = new TempUserModel({ username, email, password: hashedPassword, emailToken });

        await tempUser.save();
        console.log(tempUser._id);
        setTimeout(async () => {
            try {
              await TempUserModel.deleteOne({ _id: tempUser._id });
              console.log('Document deleted after one minute');
            } catch (deleteErr) {
              console.error('Error deleting document:', deleteErr);
            }
          }, 600000); // 60000 milliseconds = 1 minute


        res.status(200).json({ message: "Registration successful. Please verify your email.", verificationRequired: true });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: "Internal server error" });
    }
        //user = new userModel({ username, email, password });
    //     user = new TempUserModel({ username, email, password: hashedPassword, emailToken });

    //     await user.save();

    //     const token = createToken(user._id);

    //     res.status(200).json({ _id: user._id, username, email, token });
    // } catch (error) {
    //     console.error('Error registering user:', error); // Log the error for debugging
    //     res.status(500).json("Internal server error");
    // }
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
        const filteredUser = {
            username: user.username,
            _id: user._id,
            email: user.email
        };
        res.status(200).json(filteredUser);
    }
    catch(error){
        res.status(500).json(error);

    }
};

// const findSingleUser = async(req,res) => {
//     const username = req.params.username;
//     try{
//         const user = await userModel.findOne({ username });
//         if(!user){
//            return res.status(400).json("User does not exist");
//         }
//         return res.status(200).json(user);
//     }
//     catch(error){
//         console.log("Error",error);
//         return res.status(500).json(error);

//     }
// };

// const getUsers = async(req,res) => {
//     try{
//         const user = await userModel.find();
//         res.status(200).json(user);
//     }
//     catch(error){
//         res.status(500).json(error);

//     }
// };

const searchUsers = async(req,res) => {
    const searchString = req.params.searchString;
    try{
        const users = await userModel.find();
        let filtered = [];
        if (searchString.trim()) {
            filtered = users.filter(user =>
                user.username.toLowerCase().includes(searchString.toLowerCase()));
        }
        const filteredUsers = filtered.map(user => {
            return {
              username: user.username,
              _id: user._id,
              email: user.email
            };
          });

        res.status(200).json(filteredUsers);
    }catch(error){
        res.status(500).json(error);
    }
};
module.exports = { registerUser, loginUser, findUser, searchUsers };
