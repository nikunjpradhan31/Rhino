const express = require("express");
const {registerUser, loginUser, findUser , searchUsers, changePassword, changeUserName, deleteAccount} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser)

router.get("/find/:userId", findUser);

// router.get("/findsingle/:username", findSingleUser);

 //router.get("/",getUsers);

router.get("/:searchString", searchUsers);

router.put("/changeUser/:user_id/:newusername", changeUserName);

router.put("/changePass/:user_id/:confirmpassword/:password", changePassword);

router.put("/delete/:user_id/:password", deleteAccount);


module.exports = router;