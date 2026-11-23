import { io } from "socket.io-client";

// Singleton socket instance — imported everywhere it's needed.
// Falls back to the same localhost:5000 used across the rest of this
// project when REACT_APP_API_URL isn't set, so behavior is unchanged.
const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("🔌 Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

export default socket;  