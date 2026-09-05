
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

// URL allowed to connect to Socket.IO
const allowedOrigin =
  process.env.FRONTED_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: [allowedOrigin],
  },
});

// Stores:
// {
//   userMongoId: socketId
// }
const userSocketMap = {};

// Get the socket ID of a specific user
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// When a user connects
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Send the list of currently online users
  io.emit(
    "getOnlineUsers",
    Object.keys(userSocketMap)
  );

  // When the user disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
    }

    // Update everyone with the new online users
    io.emit(
      "getOnlineUsers",
      Object.keys(userSocketMap)
    );
  });
});

export { app, server, io };

