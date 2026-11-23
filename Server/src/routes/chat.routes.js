// import { Router } from "express";
// import {
//   getChatHistory,
//   getNotifications,
//   markNotificationsRead,
//   getChatRooms,
//   getUnreadCount,
//   getUserName,   // ✅ NEW
// } from "../controllers/chatController.js";

// const chatRouter = Router();

// // Get all messages in a room
// chatRouter.get("/history/:roomId", getChatHistory);

// // Get all chat rooms for a user (with names + unread counts)
// chatRouter.get("/rooms/:userId", getChatRooms);

// // Get unread notifications (with senderName)
// chatRouter.get("/notifications/:userId", getNotifications);

// // Total unread count (for navbar badge)
// chatRouter.get("/unread-count/:userId", getUnreadCount);

// // ✅ NEW: Resolve display name for a user or lawyer by ID (used by ChatPage header)
// chatRouter.get("/user-name/:userId", getUserName);

// // Mark notifications as read
// chatRouter.patch("/notifications/mark-read/:userId", markNotificationsRead);

// export default chatRouter;


import { Router } from "express";
import {
  getChatHistory,
  getNotifications,
  markNotificationsRead,
  getChatRooms,
  getUnreadCount,
  getUserName,
  uploadChatImage,
} from "../controllers/chatController.js";
import { chatImageUpload } from "../middlewares/chatImageMulter.js";

const chatRouter = Router();

// Wraps multer so unsupported file types return a clean JSON error
// instead of crashing/throwing an unhandled Express error.
const handleChatImageUpload = (req, res, next) => {
  chatImageUpload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Invalid image file",
      });
    }
    next();
  });
};

// Get all messages in a room
chatRouter.get("/history/:roomId", getChatHistory);

// Get all chat rooms for a user (with names + unread counts)
chatRouter.get("/rooms/:userId", getChatRooms);

// Get unread notifications (with senderName)
chatRouter.get("/notifications/:userId", getNotifications);

// Total unread count (for navbar badge)
chatRouter.get("/unread-count/:userId", getUnreadCount);

// Resolve display name for a user or lawyer by ID (used by ChatPage header)
chatRouter.get("/user-name/:userId", getUserName);

// Upload a chat image (jpg/jpeg/png/webp only), returns hosted image URL
chatRouter.post("/upload-image", handleChatImageUpload, uploadChatImage);

// Mark notifications as read
chatRouter.patch("/notifications/mark-read/:userId", markNotificationsRead);

export default chatRouter;