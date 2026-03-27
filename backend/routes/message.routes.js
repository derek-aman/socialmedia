import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getAllMessages, sendMessage, getPrevUserChat } from "../controllers/message.controller.js";

const router = Router();

// send message
router.post("/send/:receiverId", authMiddleware, sendMessage);

// get chat with specific user
router.get("/:receiverId", authMiddleware, getAllMessages);

// get previous chats
router.get("/prev/users", authMiddleware, getPrevUserChat);

export default router;