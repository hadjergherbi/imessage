import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import {
  hasImageKitConfig,
  uploadChatMedia,
} from "../lib/imagekit.js";

import {
  io,
  getReceiverSocketId,
} from "../lib/socket.js";

// ======================================================
// GET USERS FOR SIDEBAR
// ======================================================

export async function getUserForSidebar(req, res) {
  try {
    // MongoDB ID of the currently logged-in user
    const loggedInUserId = req.user._id;

    // Get all users except the currently logged-in user
    const users = await User.find({
      _id: {
        $ne: loggedInUserId,
      },
    }).select("-clerkId");

    res.status(200).json(users);
  } catch (error) {
    console.error(
      "Error in getUserForSidebar:",
      error.message
    );

    return res.status(500).json({
      message: "internal server error",
    });
  }
}

// ======================================================
// GET CONVERSATIONS FOR SIDEBAR
// ======================================================

export async function getConversationForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;

    const conversations = await Message.aggregate([
      // Find messages involving the logged-in user
      {
        $match: {
          $or: [
            {
              senderId: loggedInUserId,
            },
            {
              receiverId: loggedInUserId,
            },
          ],
        },
      },

      // Find the other person in each conversation
      {
        $group: {
          _id: {
            $cond: [
              {
                $eq: [
                  "$senderId",
                  loggedInUserId,
                ],
              },
              "$receiverId",
              "$senderId",
            ],
          },

          // Find the latest message date
          lastMessageAt: {
            $max: "$createdAt",
          },
        },
      },

      // Most recent conversations first
      {
        $sort: {
          lastMessageAt: -1,
        },
      },

      // Get the user document
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      // Convert user array into one object
      {
        $unwind: "$user",
      },

      // Only return the fields we need
      {
        $project: {
          _id: "$user._id",
          fullName: "$user.fullName",
          profilePic: "$user.profilePic",
          lastMessageAt: 1,
        },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error(
      "Error in getConversationForSidebar:",
      error.message
    );

    return res.status(500).json({
      message: "internal server error",
    });
  }
}

// ======================================================
// GET MESSAGES BETWEEN TWO USERS
// ======================================================

export async function getMessages(req, res) {
  try {
    // ID of the user we want to chat with
    const { id: userToChatId } = req.params;

    // ID of the currently authenticated user
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    }).sort({
      createdAt: 1,
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(
      "Error in getMessages:",
      error.message
    );

    return res.status(500).json({
      message: "internal server error",
    });
  }
}

// ======================================================
// SEND MESSAGE
// ======================================================

export async function sendMessage(req, res) {
  try {
    const { text } = req.body;

    // ID of the person receiving the message
    const { id: receiverId } = req.params;

    // ID of the authenticated sender
    const senderId = req.user._id;

    let imageUrl;
    let videoUrl;

    // ==================================================
    // HANDLE IMAGE / VIDEO
    // ==================================================

    if (req.file) {
      // Make sure ImageKit is configured
      if (!hasImageKitConfig()) {
        return res.status(500).json({
          message: "media upload is not configured",
        });
      }

      // Upload the file to ImageKit
      const url = await uploadChatMedia(req.file);

      // Check if the file is a video
      if (req.file.mimetype.startsWith("video/")) {
        videoUrl = url;
      } else {
        imageUrl = url;
      }
    }

    // ==================================================
    // CREATE MESSAGE
    // ==================================================

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      video: videoUrl,
    });

    await newMessage.save();

    // ==================================================
    // SOCKET.IO
    // ==================================================

    const receiverSocketId =
      getReceiverSocketId(receiverId);

    // If receiver is online, send message immediately
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "newMessage",
        newMessage
      );
    }

    // Return saved message to sender
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(
      "Error in sendMessage:",
      error
    );

    return res.status(500).json({
      message: "internal server error",
    });
  }
}
