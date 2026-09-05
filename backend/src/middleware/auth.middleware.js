
import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

// Protect routes that require an authenticated user
export async function protectRoute(req, res, next) {
  try {
    // Get the Clerk user ID from the authenticated request
    const { userId } = getAuth(req);

    // No Clerk user = not authenticated
    if (!userId) {
      return res.status(401).json({
        message: "unauthorized",
      });
    }

    // Find the corresponding user in MongoDB
    const user = await User.findOne({
      clerkId: userId,
    });

    // Clerk user exists but MongoDB profile doesn't exist yet
    if (!user) {
      return res.status(404).json({
        message: "user profile not synced yet",
      });
    }

    // Make the MongoDB user available to the controllers
    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Error in protectRoute middleware:",
      error.message
    );

    return res.status(500).json({
      message: "internal server error",
    });
  }
}
