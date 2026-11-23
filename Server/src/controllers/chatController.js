import Message from "../models/messageModel.js";
import Notification from "../models/notificationModel.js";
import ChatRoom from "../models/chatRoomModel.js";

// Both user models are needed to resolve a display name for a given userId,
// since a chat participant may be either a client or a lawyer.
import { User } from "../models/clientSchema.js";
import { Lawyer } from "../models/lawyerSchema.js";

// Reuses the same Cloudinary uploader already used elsewhere in the project
// (e.g. lawyer registration) so chat image uploads follow the same pattern.
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ─── HELPER: Resolve display name for any userId (client or lawyer) ────────
const resolveDisplayName = async (userId) => {
  if (!userId) return "Unknown";
  try {
    const user = await User.findById(userId).select("name");
    if (user?.name) return user.name;

    const lawyer = await Lawyer.findById(userId).select("name");
    if (lawyer?.name) return lawyer.name;
  } catch (_) {}
  return "Unknown";
};

// ─────────────────────────────────────────────
// GET /chat/history/:roomId
// Load all messages for a chat room
// ─────────────────────────────────────────────
export const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ success: false, message: "roomId is required" });
    }

    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("getChatHistory error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// GET /chat/notifications/:userId
// Get unread notifications for a user (with senderName)
// ─────────────────────────────────────────────
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const notifications = await Notification.find({
      receiverId: userId,
      isRead: false,
    }).sort({ createdAt: -1 });

    // Ensure senderName is always present, resolve if missing
    const enriched = await Promise.all(
      notifications.map(async (n) => {
        const obj = n.toObject();
        if (!obj.senderName || obj.senderName === "Unknown") {
          obj.senderName = await resolveDisplayName(obj.senderId);
        }
        return obj;
      })
    );

    return res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// PATCH /chat/notifications/mark-read/:userId
// Mark all notifications (and messages) as read for a user, optionally
// scoped to a single room.
// ─────────────────────────────────────────────
export const markNotificationsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roomId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const filter = { receiverId: userId, isRead: false };
    if (roomId) filter.roomId = roomId;

    await Notification.updateMany(filter, { $set: { isRead: true } });

    // ✅ FIX: previously this always included `roomId` in the query even
    // when it was undefined. MongoDB drops undefined keys, so an omitted
    // roomId silently widened the update to EVERY room for this user.
    // Now it mirrors the Notification filter above and only scopes by
    // room when a roomId was actually provided.
    if (roomId) {
      await Message.updateMany(
        { roomId, receiverId: userId, isRead: false },
        { $set: { isRead: true } }
      );
    } else {
      await Message.updateMany(
        { receiverId: userId, isRead: false },
        { $set: { isRead: true } }
      );
    }

    return res.status(200).json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    console.error("markNotificationsRead error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// GET /chat/rooms/:userId
// Get all chat rooms for a user, WITH the other party's name and
// unread counts, sorted by most recently active.
// ─────────────────────────────────────────────
export const getChatRooms = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const rooms = await ChatRoom.find({ users: userId }).sort({ updatedAt: -1 });

    const result = await Promise.all(
      rooms.map(async (room) => {
        // Find the other participant (not the requesting user)
        const otherUserId = room.users.find((u) => u !== userId) || null;

        const otherName = otherUserId
          ? await resolveDisplayName(otherUserId)
          : "Unknown";

        const unreadCount = await Notification.countDocuments({
          roomId: room.roomId,
          receiverId: userId,
          isRead: false,
        });

        return {
          roomId: room.roomId,
          users: room.users,
          otherUserId,
          otherName,
          lastMessage: room.lastMessage,
          unreadCount,
          updatedAt: room.updatedAt,
        };
      })
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("getChatRooms error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// GET /chat/unread-count/:userId
// Total unread message count for the navbar badge
// ─────────────────────────────────────────────
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Notification.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("getUnreadCount error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// GET /chat/user-name/:userId
// Resolve display name for any user or lawyer ID.
// Used by ChatPage to show the other person's name in the header.
// ─────────────────────────────────────────────
export const getUserName = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const name = await resolveDisplayName(userId);

    return res.status(200).json({ success: true, name });
  } catch (error) {
    console.error("getUserName error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// POST /chat/upload-image
// Accepts a single image file (field name "image"), uploads it to
// Cloudinary using the same uploadOnCloudinary util used elsewhere, and
// returns the hosted image URL. The actual chat message (with this URL)
// is then sent through the existing Socket.io "sendMessage" event.
// ─────────────────────────────────────────────
export const uploadChatImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const imageLocalPath = req.file.path;

    const uploadedImage = await uploadOnCloudinary(imageLocalPath);

    if (!uploadedImage) {
      return res.status(500).json({ success: false, message: "Failed to upload image" });
    }

    return res.status(200).json({
      success: true,
      imageUrl: uploadedImage.secure_url || uploadedImage.url,
    });
  } catch (error) {
    console.error("uploadChatImage error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};