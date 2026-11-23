import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    // ✅ FIX: Store sender name so notifications show WHO sent the message
    senderName: {
      type: String,
      default: "Unknown",
    },
    receiverId: {
      type: String,
      required: true,
      index: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;