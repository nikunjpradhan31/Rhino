const express = require("express");
const { getUsersChats, createChat, findChat,AddToChat ,ChangeGroupChatName, DeleteChat, LeaveChat} = require("../controllers/chatController");
const router = express.Router();

router.post("/", createChat);
router.get("/:userId", getUsersChats);
// router.get("/find/:FirstId/:SecondId", findChat);
router.post("/find",findChat);
router.put("/add/:newMemberId/:chatId",AddToChat);
router.put("/changeName/:chatTitle/:chatId", ChangeGroupChatName);
router.delete("/delete/:chatId/:userId", DeleteChat);
router.put("/leave/:chatId/:userId", LeaveChat);
module.exports = router;