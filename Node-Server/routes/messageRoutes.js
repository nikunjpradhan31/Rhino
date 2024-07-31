const express = require("express");
const { createMessage, getMessages, getLatestMessages } = require("../controllers/messageController");
const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId/:getterId", getMessages);
router.get("/:chatId", getLatestMessages);
module.exports = router;