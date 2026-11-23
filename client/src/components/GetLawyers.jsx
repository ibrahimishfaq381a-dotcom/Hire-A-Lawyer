import React, { useEffect, useState } from 'react';
import './profileLawyers.css';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';

const GetLawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const expertise = location.state?.expertise || "";

  useEffect(() => {
  const fetchLawyers = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        'http://localhost:5000/lawyer/getalllawyers'
      );

      // ✅ YAHAN DEBUG LOG ADD KIYA HAI
      console.log("ALL LAWYERS RESPONSE:", response.data);

      const allLawyers = response.data?.lawyer || [];

      console.log("EXTRACTED LAWYERS:", allLawyers);

      const filteredLawyers = allLawyers.filter(
        (lawyer) => lawyer?.expertise === expertise
      );

      console.log("FILTERED LAWYERS:", filteredLawyers);

      setLawyers(filteredLawyers);
      setError(null);

    } catch (error) {
      console.error('Error fetching lawyers data:', error);
      setError('Failed to load lawyers. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  fetchLawyers();
}, [expertise]);

  // ✅ FIXED CLICK HANDLER (NOW ACCEPTS OBJECT)
  const handleLawyerClick = (lawyer) => {
    console.log("CLICK DATA:", lawyer);

    const id = lawyer?._id;

    if (!id) {
      alert("❌ Lawyer ID missing!");
      return;
    }

    navigate(`/profile/${id}`);
  };

  return (
    <>
      <Navbar />

      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{expertise} Lawyers</h1>
          <p className="page-subtitle">
            Find experienced lawyers specializing in {expertise}
          </p>
        </div>
      </div>

      <div className="container" style={{ minHeight: '50vh' }}>
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <div className="no-results">
            <p className="no-results-message">{error}</p>
          </div>
        ) : lawyers.length === 0 ? (
          <div className="no-results">
            <p className="no-results-message">
              No lawyers found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="lawyers-grid">

            {lawyers.map((lawyer) => (

              <div
                className="lawyer-card"
                key={lawyer?._id}
                onClick={() => handleLawyerClick(lawyer)}   // ✅ FIXED HERE
              >
                <div className="lawyer-card-inner">

                  <div className="lawyer-info">
                    <div className="lawyer-image">
                      <img
                        src={lawyer?.image}
                        alt={lawyer?.name}
                      />
                    </div>

                    <div className="lawyer-details">
                      <h3 className="lawyer-name">
                        Adv. {lawyer?.name || 'Unknown'}
                      </h3>
                      <p className="lawyer-specialization">
                        {lawyer?.expertise}
                      </p>
                    </div>
                  </div>

                  <div className="lawyer-stats">
                    <div className="stat-item">
                      <span className="stat-label">Wins</span>
                      <span className="stat-value">
                        {lawyer.statistics?.wins || 0}
                      </span>
                    </div>

                    <div className="stat-item">
                      <span className="stat-label">Cases</span>
                      <span className="stat-value">
                        {lawyer.statistics?.cases || 0}
                      </span>
                    </div>

                    <div className="stat-item">
                      <span className="stat-label">Rating</span>
                      <span className="stat-value">
                        {lawyer.rating || 0}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            ))}

          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default GetLawyers;