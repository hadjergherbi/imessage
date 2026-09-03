import express from 'express';
import { checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router =express.Router();
router.get("/check",protectRoute,checkAuth)
//before sending the message we must check that the user is authenticated or not 
export default router