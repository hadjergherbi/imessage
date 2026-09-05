
import express from "express";

import { checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Check if the user is authenticated
router.get("/check", protectRoute, checkAuth);

export default router;
