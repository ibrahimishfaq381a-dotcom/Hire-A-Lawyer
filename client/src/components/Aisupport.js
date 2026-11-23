import React, { useState } from "react";
import axios from "axios";
import "./Aisupport.css";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function AISupport() {
  const [text, setText] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!text) {
      setError("Please enter your case description.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/recommend",
        { text }
      );

      setResult(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="ai-wrapper">
        <div className="ai-container">
          <h1>AI Recommendation</h1>

          <textarea
            className="ai-textarea"
            placeholder="Describe your case..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="ai-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Searching..." : "Find Lawyer"}
          </button>

          {error && <p className="ai-error">{error}</p>}

          {result.length > 0 ? (
            <div className="ai-results">
              {result.map((lawyer, i) => (
                <div
                  key={i}
                  className="ai-card"
                  onClick={() =>
                    navigate(`/profile/${lawyer._id}`)
                  }
                  style={{
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                >
                  <h3>{lawyer.name}</h3>
                  <p>Specialization: {lawyer.specialization}</p>

                  {lawyer.location && (
                    <p>Location: {lawyer.location}</p>
                  )}

                  {lawyer.experience !== undefined && (
                    <p>Experience: {lawyer.experience} years</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !loading &&
            text && <p>No lawyers found for your case.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AISupport;