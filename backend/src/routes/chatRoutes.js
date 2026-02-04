import express from "express";
import {
  accessConversation,
  sendMessage,
  getMessages,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/conversation", accessConversation);
router.post("/message", sendMessage);
router.get("/message/:id", getMessages);

export default router;
