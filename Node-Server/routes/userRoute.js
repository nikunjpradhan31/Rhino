const express = require("express");
const {registerUser, loginUser, findUser,getUsers, findSingleUser, searchUsers} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser)

router.get("/find/:userId", findUser);

router.get("/findsingle/:username", findSingleUser);

router.get("/",getUsers);

router.get("/:searchString", searchUsers);

module.exports = router;