const express = require("express");
const { getUsersChats, createChat, findChat,AddToChat } = require("../controllers/chatController");
const router = express.Router();

router.post("/", createChat);
router.get("/:userId", getUsersChats);
// router.get("/find/:FirstId/:SecondId", findChat);
router.post("/find",findChat);
router.put("/add/:newMemberId/:chatId",AddToChat);
module.exports = router;