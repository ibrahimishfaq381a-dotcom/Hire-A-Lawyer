// import React, { useState, useEffect } from "react";
// import "./Profile.css";
// import { useParams } from "react-router-dom";
// import HireForm from "./HireForm";
// import Navbar from "./Navbar";
// import axios from "axios";
// // import Chat from "../components/Chat";
// import Footer from "./Footer";

// const Profile = () => {
//   const { id } = useParams();
//   const [data, setData] = useState({});
//   const [showForm, setShowForm] = useState(false);
//   const [selectedProfileEmail, setSelectedProfileEmail] = useState("");

// useEffect(() => {
//   const sentData = async () => {
//     try {

//       const response = await axios.get(
//      `http://localhost:5000/lawyer/id/${id}`
//      );

//       console.log("LAWYER DATA:", response.data.data);

//       setData(response.data.data);

//     } catch (error) {
//       console.log("Something went wrong while getting lawyer", error);
//     }
//   };

//   sentData();
// }, [id]);

//   // const navigate = useNavigate();

//   function onClick() {
//   if (!data || !data.email) {
//     console.log("Email not available");
//     return;
//   }

//   setSelectedProfileEmail(data.email);
//   console.log("Selected lawyer email:", data.email);

//   setShowForm(true);
// }

//   return (
//     <>
//       <Navbar />
//       <div className="mainDiv">
//         <div className="container-profile">
//           <h2 className="h2">Adv.{data.name}</h2>
//           <h4 className="h4">
//             Experience
//             <p>{data.experience}</p>
//           </h4>
//           <h4 className="h5">
//             City
//             <p>{data.city}</p>
//           </h4>

//           <h4 className="h6">
//             Description
//             <p>"{data.description}"</p>
//           </h4>

//           <div>
//             <button className="button-5" onClick={onClick}>
//               Hire Me
//             </button>
//           </div>
//         </div>
//       </div>

//       {showForm && <HireForm selectedProfileEmail={selectedProfileEmail} />}
//       <Footer />
//     </>
//   );
// };

// export default Profile;



import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useParams, useNavigate } from "react-router-dom";
import HireForm from "./HireForm";
import Navbar from "./Navbar";
import axios from "axios";
import Footer from "./Footer";
import socket from "../socket";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [selectedProfileEmail, setSelectedProfileEmail] = useState("");

  // ── Get current logged-in user ─────────────────────────────────────────────
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId =
    currentUser?._id || localStorage.getItem("userId") || "";

  // ── Join socket personal room for notifications ────────────────────────────
  useEffect(() => {
    if (currentUserId) {
      socket.emit("joinUser", currentUserId);
    }
  }, [currentUserId]);

  // ── Fetch lawyer profile ───────────────────────────────────────────────────
  useEffect(() => {
    const sentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/lawyer/id/${id}`
        );
        setData(response.data.data);
      } catch (error) {
        console.log("Error fetching lawyer:", error);
      }
    };
    sentData();
  }, [id]);

  // ── Hire Me button ─────────────────────────────────────────────────────────
  function onClick() {
    if (!data || !data.email) return;
    setSelectedProfileEmail(data.email);
    setShowForm(true);
  }

  // ── Chat button ────────────────────────────────────────────────────────────
  const handleChat = () => {
    if (!currentUserId) {
      alert("Please log in to start a chat.");
      navigate("/");
      return;
    }

    if (!data?._id) {
      alert("Lawyer information not loaded yet. Please wait.");
      return;
    }

    // roomId = clientId_lawyerId (deterministic, consistent)
    const roomId = `${currentUserId}_${data._id}`;

    // Pre-join the room
    socket.emit("joinRoom", roomId);

    navigate(`/chat/${roomId}`);
  };

  return (
    <>
      <Navbar />
      <div className="mainDiv">
        <div className="container-profile">
          <h2 className="h2">Adv. {data.name}</h2>

          <h4 className="h4">
            Experience
            <p>{data.experience}</p>
          </h4>

          <h4 className="h5">
            City
            <p>{data.city}</p>
          </h4>

          <h4 className="h6">
            Description
            <p>"{data.description}"</p>
          </h4>

          {/* ── ACTION BUTTONS ──────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button className="button-5" onClick={onClick}>
              Hire Me
            </button>
            <button className="button-5 chat-btn" onClick={handleChat}>
              💬 Chat Now
            </button>
          </div>
        </div>
      </div>

      {showForm && <HireForm selectedProfileEmail={selectedProfileEmail} />}
      <Footer />
    </>
  );
};

export default Profile;