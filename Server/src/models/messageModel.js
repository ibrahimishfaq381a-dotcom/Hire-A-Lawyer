// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     roomId: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     senderId: {
//       type: String,
//       required: true,
//     },
//     receiverId: {
//       type: String,
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     isRead: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

// export default Message;


import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      // Message text is only required for text messages; image messages
      // can be sent with no caption (imageUrl carries the content).
      required: function () {
        return this.messageType !== "image";
      },
      trim: true,
      default: "",
    },
    // URL of the uploaded image (Cloudinary secure_url), null for text messages
    imageUrl: {
      type: String,
      default: null,
    },
    // Distinguishes text messages from image messages
    messageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;