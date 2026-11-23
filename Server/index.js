import app from "./app.js";
import { ConnectDB } from "./src/db/index.js";
import http from "http";
import { Server } from "socket.io";
import Message from "./src/models/messageModel.js";
import Notification from "./src/models/notificationModel.js";
import ChatRoom from "./src/models/chatRoomModel.js";
import { User } from "./src/models/clientSchema.js";
import { Lawyer } from "./src/models/lawyerSchema.js";

const PORT = process.env.PORT || 5000;

// ─── HTTP SERVER ────────────────────────────────────────────────────────────
const server = http.createServer(app);

// ─── SOCKET.IO SERVER ───────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Helper to resolve a user's display name from either collection
const resolveSenderName = async (senderId) => {
  try {
    const user = await User.findById(senderId).select("name");
    if (user?.name) return user.name;

    const lawyer = await Lawyer.findById(senderId).select("name");
    if (lawyer?.name) return lawyer.name;
  } catch (_) {
    // Silently fall through
  }
  return "Unknown";
};

// ─── ONLINE PRESENCE TRACKING ───────────────────────────────────────────────
// Maps userId -> Set of socket.ids currently connected for that user.
// A user can have multiple tabs/devices open, so we only consider them
// "offline" once ALL of their sockets have disconnected.
const onlineUsers = new Map();

const markUserOnline = (userId, socketId) => {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
};

const markUserOffline = (userId, socketId) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return false;
  sockets.delete(socketId);
  if (sockets.size === 0) {
    onlineUsers.delete(userId);
    return true; // fully offline now
  }
  return false; // still has other active sockets
};

// ─── SOCKET EVENTS ──────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // Tracks which userId this socket belongs to, so disconnect can clean up
  // presence + notify the right people without the client having to tell us.
  let boundUserId = null;

  // ── JOIN PERSONAL ROOM (for notifications + presence) ─────────────────────
  socket.on("joinUser", (userId) => {
    if (!userId) return;
    socket.join(userId);
    boundUserId = userId;

    const wasOffline = !onlineUsers.has(userId);
    markUserOnline(userId, socket.id);

    if (wasOffline) {
      // Let everyone who has a room with this user know they're online.
      socket.broadcast.emit("userOnline", { userId });
    }
  });

  // ── JOIN CHAT ROOM ──────────────────────────────────────────────────────
  socket.on("joinRoom", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
  });

  // ── LEAVE CHAT ROOM ──────────────────────────────────────────────────────
  // Fixes cross-room message leakage: without this, a socket stays joined
  // to every room it has ever opened, and keeps receiving "receiveMessage"
  // events for old rooms even after the user navigates away from them.
  socket.on("leaveRoom", (roomId) => {
    if (!roomId) return;
    socket.leave(roomId);
  });

  // ── CHECK ONLINE STATUS ──────────────────────────────────────────────────
  socket.on("checkOnline", (userId, callback) => {
    const isOnline = onlineUsers.has(userId);
    if (typeof callback === "function") callback({ userId, isOnline });
  });

  // ── SEND MESSAGE ──────────────────────────────────────────────────────────
  socket.on("sendMessage", async (data) => {
    try {
      const { roomId, senderId, receiverId, message, imageUrl, messageType } = data;

      // An image message is one that explicitly carries an imageUrl
      const isImageMessage = messageType === "image" && !!imageUrl;

      if (!roomId || !senderId || !receiverId) {
        socket.emit("messageError", { error: "Missing required fields" });
        return;
      }
      if (!isImageMessage && !message?.trim()) {
        socket.emit("messageError", { error: "Missing required fields" });
        return;
      }

      // 1️⃣ Save message to DB
      const newMessage = await Message.create({
        roomId,
        senderId,
        receiverId,
        message: message?.trim() || "",
        imageUrl: isImageMessage ? imageUrl : null,
        messageType: isImageMessage ? "image" : "text",
        isRead: false,
      });

      // 2️⃣ Emit message to everyone in the room
      io.to(roomId).emit("receiveMessage", newMessage);

      // 3️⃣ Resolve sender name for the notification
      const senderName = await resolveSenderName(senderId);
      const previewText = isImageMessage ? "📷 Photo" : message.trim();

      // 4️⃣ Create notification for the receiver
      const notification = await Notification.create({
        senderId,
        senderName,
        receiverId,
        roomId,
        message: previewText,
        isRead: false,
      });

      // 5️⃣ Push notification to receiver's personal room
      io.to(receiverId).emit("newNotification", {
        ...notification.toObject(),
        senderName,
      });

      // 6️⃣ Upsert ChatRoom (used for the chat list / last message preview)
      await ChatRoom.findOneAndUpdate(
        { roomId },
        {
          roomId,
          users: [senderId, receiverId],
          lastMessage: previewText,
        },
        { upsert: true, new: true }
      );

      // 7️⃣ Tell both participants' navbars to refresh their chat list
      io.to(senderId).emit("chatListUpdated");
      io.to(receiverId).emit("chatListUpdated");

    } catch (err) {
      console.error("❌ sendMessage socket error:", err);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  // ── TYPING INDICATOR ─────────────────────────────────────────────────────
  socket.on("typing", ({ roomId, senderId }) => {
    if (!roomId || !senderId) return;
    socket.to(roomId).emit("userTyping", { senderId });
  });

  socket.on("stopTyping", ({ roomId }) => {
    if (!roomId) return;
    socket.to(roomId).emit("userStoppedTyping");
  });

  // ── DISCONNECT ────────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    if (boundUserId) {
      const nowFullyOffline = markUserOffline(boundUserId, socket.id);
      if (nowFullyOffline) {
        socket.broadcast.emit("userOffline", { userId: boundUserId });
      }
    }
  });
});

// ─── START SERVER ───────────────────────────────────────────────────────────
(async () => {
  try {
    await ConnectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server running on PORT: ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();