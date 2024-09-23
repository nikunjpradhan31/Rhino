const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Limit size to 10 MB

const { createMessage, getMessages, getLatestMessages, getFile } = require("../controllers/messageController");

const router = express.Router();

router.post("/", upload.single('file'), createMessage);

router.get("/getmessages/:chatId/:getterId", getMessages);

router.get("/lastmessage/:chatId", getLatestMessages);

router.get("/file/:fileId", getFile);

module.exports = router;
