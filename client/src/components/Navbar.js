import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { Button } from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import socket from "../socket";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── Chat list state ────────────────────────────────────────────────────────
  const [showChatList, setShowChatList] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatDropdownRef = useRef(null);

  const currentUserId =
    JSON.parse(localStorage.getItem("user") || "null")?._id ||
    localStorage.getItem("userId") ||
    "";

  // ── Scroll effect ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Close mobile menu on route change ─────────────────────────────────────
  useEffect(() => {
    setShowMediaIcons(false);
    setShowChatList(false);
  }, [location]);

  // ── Close dropdown when clicking outside ──────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        chatDropdownRef.current &&
        !chatDropdownRef.current.contains(e.target)
      ) {
        setShowChatList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fetch chat rooms (with names + unread counts) ─────────────────────────
  const fetchChatRooms = async () => {
    if (!currentUserId) return;
    try {
      const res = await axios.get(`${API}/chat/rooms/${currentUserId}`);
      setChatRooms(res.data.data || []);
      // Sum up total unread
      const total = (res.data.data || []).reduce(
        (acc, r) => acc + (r.unreadCount || 0),
        0
      );
      setUnreadCount(total);
    } catch (err) {
      // Silently fail — not critical
    }
  };

  // ── Initial fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchChatRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  // ── Socket: join personal room & listen for events ────────────────────────
  useEffect(() => {
    if (!currentUserId) return;

    const joinPersonalRoom = () => socket.emit("joinUser", currentUserId);
    joinPersonalRoom();

    // Real-time notification badge increment
    const handleNotification = (notif) => {
      setUnreadCount((prev) => prev + 1);
      // Refresh chat rooms list so last message + unread count update
      fetchChatRooms();
    };

    // chatListUpdated fires when any message is sent in any of our rooms
    const handleChatListUpdate = () => {
      fetchChatRooms();
    };

    // ✅ FIX: rejoin the personal room after a socket reconnect (dropped
    // connection, server restart). Without this, the notification badge
    // and chat-list live-refresh silently stop working until a manual
    // page refresh, even though the socket itself reconnects fine.
    socket.on("connect", joinPersonalRoom);
    socket.on("newNotification", handleNotification);
    socket.on("chatListUpdated", handleChatListUpdate);

    return () => {
      socket.off("connect", joinPersonalRoom);
      socket.off("newNotification", handleNotification);
      socket.off("chatListUpdated", handleChatListUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  // ── Clear badge when inside /chat ──────────────────────────────────────────
  useEffect(() => {
    if (location.pathname.startsWith("/chat")) {
      fetchChatRooms(); // Re-fetch to get updated unread=0 after mark-as-read
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ── Open/close chat dropdown ───────────────────────────────────────────────
  const toggleChatList = (e) => {
    e.stopPropagation();
    if (!showChatList) fetchChatRooms(); // Refresh on open
    setShowChatList((prev) => !prev);
  };

  // ── Navigate to a specific chat room ──────────────────────────────────────
  const openChat = (roomId) => {
    setShowChatList(false);
    navigate(`/chat/${roomId}`);
  };

  // ── Format last message timestamp ─────────────────────────────────────────
  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { day: "2-digit", month: "short" });
  };

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };
  const navigateWithDebounce = debounce(navigate, 300);
  const handleNavigation = (route) => navigateWithDebounce(route);
  const isActive = (path) => location.pathname === path;
  const toggleMenu = () => setShowMediaIcons(!showMediaIcons);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <>
      <nav className={`main-nav ${scrolled ? "scrolled" : ""}`}>
        {/* Logo */}
        <div className="logo">
          <h2 onClick={() => handleNavigation("/")}>
            <span>H</span>ire<span>a</span>Lawyer
          </h2>
        </div>

        {/* Menu Links */}
        <div
          className={`menu-link ${showMediaIcons ? "mobile-menu-link" : ""} ${
            showMediaIcons ? "active" : ""
          }`}
        >
          {showMediaIcons && (
            <button
              className="close-menu-btn"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <IoMdClose />
            </button>
          )}

          <ul>
            <li className={isActive("/home") ? "active" : ""}>
              <Button className="navbtn" onClick={() => handleNavigation("/home")}>
                Home
              </Button>
            </li>
            <li className={isActive("/about") ? "active" : ""}>
              <Button className="navbtn" onClick={() => handleNavigation("/about")}>
                About
              </Button>
            </li>
            <li className={isActive("/service") ? "active" : ""}>
              <Button className="navbtn" onClick={() => handleNavigation("/service")}>
                Services
              </Button>
            </li>
            <li className={isActive("/Casestudy") ? "active" : ""}>
              <Button className="navbtn" onClick={() => handleNavigation("/Casestudy")}>
                Case Study
              </Button>
            </li>
            <li className={isActive("/Aisupport") ? "active" : ""}>
              <Button className="navbtn" onClick={() => handleNavigation("/Aisupport")}>
                AI Support
              </Button>
            </li>
            <li className={isActive("/contact") ? "active" : ""}>
              <Button className="navbtn" onClick={() => handleNavigation("/contact")}>
                Contact
              </Button>
            </li>

            {/* ✅ FIX: WhatsApp-style chat list dropdown */}
            {currentUserId && (
              <li
                className={`chat-nav-item ${
                  location.pathname.startsWith("/chat") ? "active" : ""
                }`}
                ref={chatDropdownRef}
              >
                {/* Chat toggle button with badge */}
                <button
                  className="chat-nav-btn"
                  onClick={toggleChatList}
                  aria-label="Open chat list"
                >
                  <span className="chat-nav-icon">💬</span>
                  <span className="chat-nav-label">Chats</span>
                  {unreadCount > 0 && (
                    <span className="chat-nav-badge">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* ── WhatsApp-style Dropdown Panel ── */}
                {showChatList && (
                  <div className="chat-dropdown">
                    <div className="chat-dropdown-header">
                      <span>💬 Recent Chats</span>
                      <button
                        className="chat-dropdown-close"
                        onClick={() => setShowChatList(false)}
                        aria-label="Close chat list"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="chat-dropdown-body">
                      {chatRooms.length === 0 ? (
                        <div className="chat-dropdown-empty">
                          <p>No conversations yet.</p>
                          <p>Click "Chat Now" on a lawyer's profile to start.</p>
                        </div>
                      ) : (
                        chatRooms.map((room) => (
                          <div
                            key={room.roomId}
                            className={`chat-dropdown-item ${
                              room.unreadCount > 0 ? "unread" : ""
                            }`}
                            onClick={() => openChat(room.roomId)}
                          >
                            {/* Avatar */}
                            <div className="chat-avatar">
                              {room.otherName
                                ? room.otherName.charAt(0).toUpperCase()
                                : "?"}
                            </div>

                            {/* Chat info */}
                            <div className="chat-item-info">
                              <div className="chat-item-top">
                                <span className="chat-item-name">
                                  {room.otherName || "Unknown"}
                                </span>
                                <span className="chat-item-time">
                                  {formatTime(room.updatedAt)}
                                </span>
                              </div>
                              <div className="chat-item-bottom">
                                <span className="chat-item-last-msg">
                                  {room.lastMessage
                                    ? room.lastMessage.length > 35
                                      ? room.lastMessage.slice(0, 35) + "…"
                                      : room.lastMessage
                                    : "No messages yet"}
                                </span>
                                {room.unreadCount > 0 && (
                                  <span className="chat-item-unread">
                                    {room.unreadCount > 9
                                      ? "9+"
                                      : room.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </li>
            )}

            <li>
              <Button
                onClick={handleLogout}
                className="login-button"
                variant="contained"
              >
                LogOut
              </Button>
            </li>
          </ul>
        </div>

        {/* Social icons */}
        <div className="social-media">
          <ul className="social-media-desktop">
            <li>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <FaFacebookSquare className="facebook" />
              </a>
            </li>
            <li>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <FaInstagramSquare className="instagram" />
              </a>
            </li>
            <li>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <FaYoutubeSquare className="youtube" />
              </a>
            </li>
          </ul>

          <div className="hamburger-menu">
            <button
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              <GiHamburgerMenu />
            </button>
          </div>
        </div>

        {showMediaIcons && (
          <div className="menu-overlay" onClick={toggleMenu}></div>
        )}
      </nav>
    </>
  );
};

export default Navbar;