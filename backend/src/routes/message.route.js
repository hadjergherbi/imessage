import express from "express";

import {
  getUserForSidebar,
  getConversationForSidebar,
  getMessages,
  sendMessage
} from "../controllers/message.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/users", getUserForSidebar);

router.get("/converstations", getConversationForSidebar);

router.get("/:id", getMessages);

router.post("/send/:id", upload.single("media"), sendMessage);

export default router;