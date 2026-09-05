import express from "express";

import {
  getUserForSidebar,
  getConversationForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// All message routes require authentication
router.use(protectRoute);

// Get users for the sidebar
router.get("/users", getUserForSidebar);

// Get conversations for the sidebar
router.get("/conversations", getConversationForSidebar);

// Get messages with a specific user
router.get("/:id", getMessages);

// Send text/image/video message
// The frontend must use:
// formData.append("media", file)
router.post(
  "/send/:id",
  upload.single("media"),
  sendMessage
);

export default router;
