import express from "express";
import {
  getUsers,
  searchUsers,
  addContact,
  removeContact,
  blockUser,
  updateProfile,
  updatePassword,
  updateSettings,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getUsers);
router.get("/search", searchUsers);
router.post("/add/:id", addContact);
router.delete("/remove/:id", removeContact);
router.post("/block/:id", blockUser);
router.put("/profile", updateProfile);
router.put("/password", updatePassword);
router.put("/settings", updateSettings);

export default router;
