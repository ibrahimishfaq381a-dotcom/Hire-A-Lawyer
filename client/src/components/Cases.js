import React, { useEffect, useState } from "react";
import "./Cases.css";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate, useLocation } from "react-router-dom";
// import { GiLog } from "react-icons/gi";
import Footer from "./Footer";

const Cases = () => {
  const navigate = useNavigate();
  const [dataLawyer, setDataLawyer] = useState([]);
  const location = useLocation();
  const expertise = location.state?.expertise;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(expertise);
        const response = await axios.get(
          "http://localhost:5000/casestudy/getallcasestudies"
        );
        const caseStudies = response.data.data;
        console.log(caseStudies);

        const filteredCaseStudies = caseStudies.filter((caseStudy) => {
          return caseStudy.expertise === expertise;
        });
        setDataLawyer(filteredCaseStudies);
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };

    fetchData();
  }, [expertise]);

  const handleCaseForm = () => {
    navigate("/caseform");
  };

  return (
    <>
      <Navbar />

      <div className="grid_filter_cases">
        <div className="h1-notice">
          <h1>
            Notice: All lawyers please submit your case study that is a detailed
            decision of court after every case. Our team will verify your win
            and update it in 24 hours to reflect on your profile.
          </h1>
        </div>
        <button className="btn_cases" onClick={handleCaseForm}>
          Submit
        </button>
      </div>

      <div className="case-cards-grid">
        {dataLawyer.map((post) => (
          <div
            className="case-card"
            key={post._id}
          >
            <img src={post.image} alt={post.name} className="case-card-image" />
            <div className="case-card-body">
              <h3 className="case-card-title">Case Name: {post.name}</h3>
              <p className="case-card-description">Case Description: {post.description}</p>
              <p className="case-card-description">Lawyer ID: {post.lawyerID}</p>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </>
  );
};

export default Cases;
