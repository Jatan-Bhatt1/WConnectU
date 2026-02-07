import express from "express";
import {
  accessConversation,
  sendMessage,
  sendImageMessage,
  getMessages,
  fetchChats,
  accessGlobalChat,
  deleteConversation,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", fetchChats);
router.get("/global", accessGlobalChat);
router.post("/conversation", accessConversation);
router.post("/message", sendMessage);

// Image upload with error handling
router.post("/message/image", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ message: "Upload failed", error: err.message });
    }
    sendImageMessage(req, res, next);
  });
});

router.get("/message/:id", getMessages);
router.delete("/conversation/:id", deleteConversation);

export default router;
