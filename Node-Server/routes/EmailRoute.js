const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('..//models/UserModels'); // Adjust the path to your user model
const TempUserModel = require('..//models/TempUserModels');

router.get('/:token', async (req, res) => {
    const { token } = req.params;
    jwt.verify(token, 'ourSecretKey', async function(err, decoded) {
        if (err) {
            console.log(err);
            return res.send("Email verification failed, possibly the link is invalid or expired");
        }

        const tempUser = await TempUserModel.findOne({ emailToken: token });

        if (!tempUser) {
            return res.send("Email verification failed, user not found");
        }

        // Move user data to main user collection
        const user = new userModel({
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password
        });

        await user.save();
        await TempUserModel.deleteOne({ _id: tempUser._id });

        res.send("Email verified successfully. You can now log in.");
    });
});

module.exports = router;
