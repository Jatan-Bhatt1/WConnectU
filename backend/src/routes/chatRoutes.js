import express from "express";
import {
  accessConversation,
  sendMessage,
  getMessages,
  fetchChats,
  accessGlobalChat,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", fetchChats);
router.get("/global", accessGlobalChat);
router.post("/conversation", accessConversation);
router.post("/message", sendMessage);
router.get("/message/:id", getMessages);

export default router;
