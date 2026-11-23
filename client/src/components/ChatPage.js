// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import socket from "../socket";
// import Navbar from "./Navbar";
// import "./ChatPage.css";

// const API = "http://localhost:5000";

// const ChatPage = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();

//   // ── State ──────────────────────────────────────────────────────────────────
//   const [messages, setMessages] = useState([]);
//   const [inputMsg, setInputMsg] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   // ✅ FIX: Store the other person's display name
//   const [otherName, setOtherName] = useState("");

//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   // ── Derive IDs from roomId (format: clientId_lawyerId) ────────────────────
//   const currentUser = JSON.parse(localStorage.getItem("user") || "null");
//   const currentUserId =
//     currentUser?._id || localStorage.getItem("userId") || "";

//   const [senderId, receiverId] = roomId ? roomId.split("_") : ["", ""];
//   const myId = currentUserId;
//   const otherId = myId === senderId ? receiverId : senderId;

//   // ── Scroll to bottom ───────────────────────────────────────────────────────
//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, scrollToBottom]);

//   // ✅ FIX: Fetch the other person's name from backend ───────────────────────
//   useEffect(() => {
//     if (!otherId) return;
//     const fetchOtherName = async () => {
//       try {
//         const res = await axios.get(`${API}/chat/user-name/${otherId}`);
//         if (res.data.success) {
//           setOtherName(res.data.name);
//         }
//       } catch (_) {
//         setOtherName("Unknown");
//       }
//     };
//     fetchOtherName();
//   }, [otherId]);

//   // ── Load chat history ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!roomId) return;

//     const fetchHistory = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API}/chat/history/${roomId}`);
//         setMessages(res.data.data || []);

//         // Mark notifications as read when opening chat
//         if (myId) {
//           await axios.patch(
//             `${API}/chat/notifications/mark-read/${myId}`,
//             { roomId }
//           );
//         }
//       } catch (err) {
//         console.error("Error fetching chat history:", err);
//         setError("Failed to load chat history.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [roomId, myId]);

//   // ── Socket setup ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!roomId || !myId) return;

//     socket.emit("joinUser", myId);
//     socket.emit("joinRoom", roomId);

//     const handleReceive = (msg) => {
//       setMessages((prev) => {
//         const exists = prev.some((m) => m._id === msg._id);
//         return exists ? prev : [...prev, msg];
//       });
//     };

//     const handleTyping = () => setIsTyping(true);
//     const handleStopTyping = () => setIsTyping(false);

//     socket.on("receiveMessage", handleReceive);
//     socket.on("userTyping", handleTyping);
//     socket.on("userStoppedTyping", handleStopTyping);

//     return () => {
//       socket.off("receiveMessage", handleReceive);
//       socket.off("userTyping", handleTyping);
//       socket.off("userStoppedTyping", handleStopTyping);
//     };
//   }, [roomId, myId]);

//   // ── Send message ───────────────────────────────────────────────────────────
//   const handleSend = () => {
//     const trimmed = inputMsg.trim();
//     if (!trimmed || !myId || !otherId || !roomId) return;

//     const payload = {
//       roomId,
//       senderId: myId,
//       receiverId: otherId,
//       message: trimmed,
//     };

//     socket.emit("sendMessage", payload);
//     setInputMsg("");
//     socket.emit("stopTyping", { roomId });
//     clearTimeout(typingTimeoutRef.current);
//   };

//   // ── Typing indicator ───────────────────────────────────────────────────────
//   const handleInputChange = (e) => {
//     setInputMsg(e.target.value);
//     socket.emit("typing", { roomId, senderId: myId });
//     clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(() => {
//       socket.emit("stopTyping", { roomId });
//     }, 1500);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // ── Format timestamp ───────────────────────────────────────────────────────
//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     return new Date(timestamp).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // ── Guard ──────────────────────────────────────────────────────────────────
//   if (!currentUserId) {
//     return (
//       <div className="chat-auth-error">
//         <p>Please log in to access chat.</p>
//         <button onClick={() => navigate("/")}>Go to Login</button>
//       </div>
//     );
//   }

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <Navbar />
//       <div className="chat-wrapper">
//         {/* HEADER — ✅ FIX: show the other person's name */}
//         <div className="chat-header">
//           <button className="chat-back-btn" onClick={() => navigate(-1)}>
//             ← Back
//           </button>

//           <div className="chat-header-info">
//             {/* Avatar with initial */}
//             <div className="chat-header-avatar">
//               {otherName ? otherName.charAt(0).toUpperCase() : "?"}
//             </div>
//             <div className="chat-header-text">
//               <span className="chat-header-name">
//                 {otherName || "Loading..."}
//               </span>
//               <span className="chat-header-sub">
//                 {isTyping ? "typing..." : "online"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* MESSAGE AREA */}
//         <div className="chat-body">
//           {loading ? (
//             <div className="chat-loading">Loading messages...</div>
//           ) : error ? (
//             <div className="chat-error">{error}</div>
//           ) : messages.length === 0 ? (
//             <div className="chat-empty">
//               No messages yet. Start the conversation!
//             </div>
//           ) : (
//             messages.map((msg, index) => {
//               const isMine = msg.senderId === myId;
//               return (
//                 <div
//                   key={msg._id || index}
//                   className={`chat-message-row ${isMine ? "mine" : "theirs"}`}
//                 >
//                   <div className={`chat-bubble ${isMine ? "right" : "left"}`}>
//                     <p className="chat-bubble-text">{msg.message}</p>
//                     <span className="chat-bubble-time">
//                       {formatTime(msg.createdAt)}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })
//           )}

//           {/* Typing indicator */}
//           {isTyping && (
//             <div className="chat-typing-indicator">
//               <span></span>
//               <span></span>
//               <span></span>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* INPUT AREA */}
//         <div className="chat-footer">
//           <input
//             type="text"
//             placeholder={`Message ${otherName || ""}...`}
//             value={inputMsg}
//             onChange={handleInputChange}
//             onKeyDown={handleKeyDown}
//             className="chat-input"
//             maxLength={1000}
//           />
//           <button
//             className="chat-send-btn"
//             onClick={handleSend}
//             disabled={!inputMsg.trim()}
//           >
//             Send ➤
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatPage;



import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import Navbar from "./Navbar";
import "./ChatPage.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ─── tiny helpers ──────────────────────────────────────────────────────── */
const formatTime = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDateLabel = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "2-digit", month: "long", year: "numeric" });
};

/* ─── ChatPage ──────────────────────────────────────────────────────────── */
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages]   = useState([]);
  const [inputMsg, setInputMsg]   = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [otherName, setOtherName] = useState("");
  // ✅ FIX: real presence instead of a hardcoded `true`
  const [isOnline, setIsOnline]   = useState(false);
  // ✅ FIX: surfaces "messageError" events from the server instead of
  // silently swallowing failed sends
  const [sendError, setSendError] = useState("");

  // Image sharing state
  const [selectedImage, setSelectedImage]   = useState(null);   // File object
  const [imagePreview, setImagePreview]     = useState(null);   // local preview URL
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError]         = useState("");
  const [fullImageUrl, setFullImageUrl]     = useState(null);   // lightbox

  const messagesEndRef   = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef         = useRef(null);
  const fileInputRef     = useRef(null);

  /* ── IDs ─────────────────────────────────────────────────────────────── */
  const currentUser   = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = currentUser?._id || localStorage.getItem("userId") || "";
  const [senderId, receiverId] = roomId ? roomId.split("_") : ["", ""];
  const myId    = currentUserId;
  const otherId = myId === senderId ? receiverId : senderId;

  /* ── Scroll to bottom ────────────────────────────────────────────────── */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  /* ── Fetch other user's name ─────────────────────────────────────────── */
  useEffect(() => {
    if (!otherId) return;
    axios.get(`${API}/chat/user-name/${otherId}`)
      .then((res) => { if (res.data.success) setOtherName(res.data.name); })
      .catch(() => setOtherName("Unknown"));
  }, [otherId]);

  /* ── Load chat history ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API}/chat/history/${roomId}`);
        if (cancelled) return;
        setMessages(res.data.data || []);
        if (myId) {
          await axios.patch(`${API}/chat/notifications/mark-read/${myId}`, { roomId });
        }
      } catch (err) {
        if (!cancelled) setError("Failed to load chat history.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchHistory();

    return () => { cancelled = true; };
  }, [roomId, myId]);

  /* ── Socket: join/leave room, receive messages, typing, presence ──────── */
  useEffect(() => {
    if (!roomId || !myId) return;

    // ✅ FIX: incoming messages are now filtered by roomId. Combined with
    // leaveRoom below, this stops messages from a previously-open chat
    // room leaking into whichever room is currently on screen.
    const handleReceive = (msg) => {
      if (msg.roomId !== roomId) return;
      setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
    };

    const handleTyping = ({ senderId: typingSenderId }) => {
      if (typingSenderId === otherId) setIsTyping(true);
    };
    const handleStopTyping = () => setIsTyping(false);

    const handleMessageError = ({ error: msg }) => {
      setSendError(msg || "Failed to send message. Please try again.");
    };

    const handleUserOnline = ({ userId }) => {
      if (userId === otherId) setIsOnline(true);
    };
    const handleUserOffline = ({ userId }) => {
      if (userId === otherId) setIsOnline(false);
    };

    const joinChat = () => {
      socket.emit("joinUser", myId);
      socket.emit("joinRoom", roomId);
      // Ask the server for the other participant's current presence
      // (covers the case where they were already online before we opened
      // the chat, and re-syncs presence after a reconnect).
      if (otherId) {
        socket.emit("checkOnline", otherId, ({ isOnline: online } = {}) => {
          setIsOnline(!!online);
        });
      }
    };

    joinChat();

    // ✅ FIX: rejoin the room after any reconnect (dropped wifi, server
    // restart, etc.) — without this, messages silently stop arriving
    // until the page is manually refreshed.
    socket.on("connect", joinChat);
    socket.on("receiveMessage", handleReceive);
    socket.on("userTyping", handleTyping);
    socket.on("userStoppedTyping", handleStopTyping);
    socket.on("messageError", handleMessageError);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      // ✅ FIX: leave the room on unmount / room switch so this socket
      // stops receiving events for a chat that's no longer open.
      socket.emit("leaveRoom", roomId);
      socket.off("connect", joinChat);
      socket.off("receiveMessage", handleReceive);
      socket.off("userTyping", handleTyping);
      socket.off("userStoppedTyping", handleStopTyping);
      socket.off("messageError", handleMessageError);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [roomId, myId, otherId]);

  /* ── Image selection ────────────────────────────────────────────────── */
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = (e) => {
    const file = e.target.files?.[0];
    // reset input so selecting the same file again still fires onChange
    e.target.value = "";
    if (!file) return;

    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPG, JPEG, PNG, or WEBP images are allowed.");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB, matches server-side limit
    if (file.size > MAX_SIZE) {
      setImageError("Image is too large. Max size is 5MB.");
      return;
    }

    // ✅ FIX: revoke any previously created preview URL before making a
    // new one, so selecting several images in a row doesn't leak blob URLs.
    setImagePreview((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return URL.createObjectURL(file);
    });
    setSelectedImage(file);
  };

  const handleRemoveSelectedImage = () => {
    setImagePreview((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    setSelectedImage(null);
    setImageError("");
  };

  // ✅ FIX: revoke the preview blob URL on unmount too (e.g. user navigates
  // away with an image still selected but unsent).
  useEffect(() => {
    return () => {
      setImagePreview((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return prevUrl;
      });
    };
  }, []);

  /* ── Send ────────────────────────────────────────────────────────────── */
  const handleSend = async () => {
    const trimmed = inputMsg.trim();
    if (!myId || !otherId || !roomId) return;
    if (!trimmed && !selectedImage) return;

    setSendError("");

    // Image message flow — upload first, then send through the same
    // "sendMessage" socket event used for text.
    if (selectedImage) {
      try {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("image", selectedImage);

        const res = await axios.post(`${API}/chat/upload-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.data.success) {
          setImageError(res.data.message || "Failed to upload image.");
          setUploadingImage(false);
          return;
        }

        socket.emit("sendMessage", {
          roomId,
          senderId: myId,
          receiverId: otherId,
          message: trimmed,
          imageUrl: res.data.imageUrl,
          messageType: "image",
        });

        handleRemoveSelectedImage();
        setInputMsg("");
      } catch (err) {
        setImageError(
          err?.response?.data?.message || "Failed to upload image. Please try again."
        );
      } finally {
        setUploadingImage(false);
      }
      socket.emit("stopTyping", { roomId });
      clearTimeout(typingTimeoutRef.current);
      inputRef.current?.focus();
      return;
    }

    // Text-only flow
    socket.emit("sendMessage", { roomId, senderId: myId, receiverId: otherId, message: trimmed });
    setInputMsg("");
    socket.emit("stopTyping", { roomId });
    clearTimeout(typingTimeoutRef.current);
    inputRef.current?.focus();
  };

  /* ── Typing ──────────────────────────────────────────────────────────── */
  const handleInputChange = (e) => {
    setInputMsg(e.target.value);
    socket.emit("typing", { roomId, senderId: myId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => socket.emit("stopTyping", { roomId }), 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* ── Auth guard ──────────────────────────────────────────────────────── */
  if (!currentUserId) {
    return (
      <div className="cp-auth-error">
        <div className="cp-auth-card">
          <div className="cp-auth-icon">🔒</div>
          <h3>Authentication Required</h3>
          <p>Please log in to access your conversations.</p>
          <button onClick={() => navigate("/")}>Go to Login</button>
        </div>
      </div>
    );
  }

  /* ── Group messages by date ──────────────────────────────────────────── */
  const groupedMessages = messages.reduce((groups, msg) => {
    const label = formatDateLabel(msg.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(msg);
    return groups;
  }, {});

  const avatarLetter = otherName ? otherName.charAt(0).toUpperCase() : "?";

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <>
      <Navbar />
      <div className="cp-root">

        {/* ── HEADER ───────────────────────────────────────────────────── */}
        <div className="cp-header">
          <button className="cp-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div className="cp-header-avatar">
            <span className="cp-avatar-letter">{avatarLetter}</span>
            {isOnline && <span className="cp-online-dot" />}
          </div>

          <div className="cp-header-info">
            <span className="cp-header-name">{otherName || "Loading…"}</span>
            <span className={`cp-header-status ${isTyping ? "typing" : ""}`}>
              {isTyping ? (
                <>
                  <span className="cp-typing-dots">
                    <span/><span/><span/>
                  </span>
                  typing…
                </>
              ) : (
                isOnline ? "● Online" : "○ Offline"
              )}
            </span>
          </div>
        </div>

        {/* ── MESSAGES BODY ────────────────────────────────────────────── */}
        <div className="cp-body">
          {loading ? (
            <div className="cp-state-wrapper">
              <div className="cp-spinner">
                <div/><div/><div/><div/>
              </div>
              <p>Loading messages…</p>
            </div>
          ) : error ? (
            <div className="cp-state-wrapper cp-error-state">
              <div className="cp-state-icon">⚠️</div>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : messages.length === 0 ? (
            <div className="cp-state-wrapper cp-empty-state">
              <div className="cp-empty-avatar">{avatarLetter}</div>
              <h4>{otherName || "Your contact"}</h4>
              <p>No messages yet. Say hello! 👋</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
              <div key={dateLabel} className="cp-date-group">
                {/* Date separator */}
                <div className="cp-date-separator">
                  <span>{dateLabel}</span>
                </div>

                {msgs.map((msg, idx) => {
                  const isMine = msg.senderId === myId;
                  const prevMsg = msgs[idx - 1];
                  const showAvatar = !isMine && (!prevMsg || prevMsg.senderId !== msg.senderId);

                  return (
                    <div key={msg._id || idx} className={`cp-msg-row ${isMine ? "mine" : "theirs"}`}>
                      {/* Other person's avatar (shown once per group) */}
                      {!isMine && (
                        <div className={`cp-msg-avatar ${showAvatar ? "" : "invisible"}`}>
                          {avatarLetter}
                        </div>
                      )}

                      <div className={`cp-bubble-wrap ${isMine ? "right" : "left"}`}>
                        <div className={`cp-bubble ${isMine ? "cp-bubble-mine" : "cp-bubble-theirs"} ${msg.messageType === "image" ? "cp-bubble-image-wrap" : ""}`}>
                          {msg.messageType === "image" && msg.imageUrl ? (
                            <img
                              src={msg.imageUrl}
                              alt="Shared"
                              className="cp-chat-image"
                              onClick={() => setFullImageUrl(msg.imageUrl)}
                            />
                          ) : null}
                          {msg.message ? (
                            <p className={msg.messageType === "image" ? "cp-bubble-text cp-image-caption" : "cp-bubble-text"}>
                              {msg.message}
                            </p>
                          ) : null}
                          <div className="cp-bubble-meta">
                            <span className="cp-bubble-time">{formatTime(msg.createdAt)}</span>
                            {isMine && (
                              <span className="cp-read-tick" title="Sent">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}

          {/* Typing indicator bubble */}
          {isTyping && !loading && (
            <div className="cp-msg-row theirs">
              <div className="cp-msg-avatar">{avatarLetter}</div>
              <div className="cp-bubble-wrap left">
                <div className="cp-bubble cp-bubble-theirs cp-typing-bubble">
                  <span/><span/><span/>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── IMAGE PREVIEW / ERROR BAR ───────────────────────────────── */}
        {(imagePreview || imageError || sendError) && (
          <div className="cp-image-preview-bar">
            {imagePreview && (
              <div className="cp-image-preview-thumb-wrap">
                <img src={imagePreview} alt="Selected" className="cp-image-preview-thumb" />
                <button
                  type="button"
                  className="cp-image-remove-btn"
                  onClick={handleRemoveSelectedImage}
                  aria-label="Remove selected image"
                >
                  ✕
                </button>
              </div>
            )}
            {imageError && <span className="cp-image-error">{imageError}</span>}
            {/* ✅ FIX: previously failed sends (messageError from the server)
                were never shown to the user at all */}
            {sendError && <span className="cp-image-error">{sendError}</span>}
          </div>
        )}

        {/* ── INPUT AREA ───────────────────────────────────────────────── */}
        <div className="cp-footer">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleImageSelected}
          />
          <button
            type="button"
            className="cp-attach-btn"
            onClick={handleAttachClick}
            disabled={uploadingImage}
            aria-label="Attach image"
            title="Send an image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          <div className="cp-input-wrapper">
            <textarea
              ref={inputRef}
              className="cp-input"
              placeholder={selectedImage ? "Add a caption…" : `Message ${otherName || ""}…`}
              value={inputMsg}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              maxLength={1000}
              rows={1}
            />
          </div>
          <button
            className={`cp-send-btn ${(inputMsg.trim() || selectedImage) && !uploadingImage ? "active" : ""}`}
            onClick={handleSend}
            disabled={(!inputMsg.trim() && !selectedImage) || uploadingImage}
            aria-label="Send message"
          >
            {uploadingImage ? (
              <span className="cp-send-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* ── FULL-SIZE IMAGE LIGHTBOX ───────────────────────────────────── */}
      {fullImageUrl && (
        <div className="cp-image-modal-overlay" onClick={() => setFullImageUrl(null)}>
          <button
            className="cp-image-modal-close"
            onClick={() => setFullImageUrl(null)}
            aria-label="Close image"
          >
            ✕
          </button>
          <img
            src={fullImageUrl}
            alt="Full size"
            className="cp-image-modal-content"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ChatPage;