import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // users[0] = clientId, users[1] = lawyerId
    users: [
      {
        type: String,
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ChatRoom =
  mongoose.models.ChatRoom || mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;