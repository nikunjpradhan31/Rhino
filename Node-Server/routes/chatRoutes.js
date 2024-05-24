const express = require("express");
const { getUsersChats, createChat, findChat } = require("../controllers/chatController");
const router = express.Router();

router.post("/", createChat);
router.get("/:userId", getUsersChats);
router.get("/find/:FirstId/:SecondId", findChat);

module.exports = router;