import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./caseform.css";
import axios from "axios";
import Footer from "./Footer";

const Caseform = () => {
  // const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const {
    register,
    handleSubmit,
    reset, // ✅ for clearing form
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("caseno", data.caseno);
    formData.append("expertise", data.expertise);
    formData.append("description", data.description);
    formData.append('lawyerID', data.lawyerID);
    formData.append("myfile2", data.myfile2[0]);

    try {
      const response = await axios.post(
        "http://localhost:5000/casestudy/postcasestudies",
        formData
      );

      if (response.status === 201) {
        setMessage("✅ Case study posted successfully!");
        reset();
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log("Error while posting case study", error);
      setMessage("❌ Network or server error. Try again later.");
    }

    // Remove message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <>
      <Navbar />
      <div className="lawyer-register-container-cases">
        <div className="textLogoContainer-cases">
          <h1>
            <span className="logoText-cases">HireALawyer.pk</span> Submit recent
            Case study
          </h1>
        </div>

        {message && (
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              color: message.startsWith("✅") ? "green" : "red",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <div className="lawyer-details-container-cases">
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="form-container-registration-cases"
          >
            <div className="lawyer-details-control-cases">
              <label htmlFor="name">Name of the case</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="inputControl-cases"
              />
            </div>

            <div className="lawyer-details-control-cases">
              <label htmlFor="caseno">Case number</label>
              <input
                type="text"
                {...register("caseno", { required: true })}
                className="inputControl-cases"
              />
            </div>

            <div className="lawyer-details-control-cases">
              <label htmlFor="expertise">Area of Expertise</label>
              <select
                {...register("expertise", { required: true })}
                className="inputControl-cases"
              >
                <option value="">Select Expertise</option>
                <option value="Legal notice">Legal notice</option>
                <option value="Criminal matter">Criminal matter</option>
                <option value="Divorce">Divorce</option>
                <option value="family matter">Family matter</option>
                <option value="Mediation">Mediation</option>
                <option value="Company Reg.">Company Reg.</option>
                <option value="Trade mark">Trade mark</option>
                <option value="Tax filling">Tax filling</option>
                <option value="Recovery matter">Recovery matter</option>
                <option value="Immigration">Immigration</option>
                <option value="Service matter">Service matter</option>
                <option value="Civil matter">Civil matter</option>
              </select>
            </div>

            <div className="lawyer-details-control-cases">
              <label htmlFor="myfile2">Picture</label>
              <input
                type="file"
                {...register("myfile2", { required: true })}
                className="inputControl-cases"
              />
            </div>
            <div className="lawyer-details-control">
              <label htmlFor="lawyerID">Lawyer ID</label>
              <input
                type="text"
                {...register("lawyerID", { required: "Lawyer ID is required" })}
                className="inputControl"
              />
              {errors.lawyerID && (
                <p className="error">{errors.lawyerID.message}</p>
              )}
            </div>

            <div className="lawyer-details-control-cases">
              <label htmlFor="description">Description</label>
              <textarea
                rows="5"
                maxLength="420"
                placeholder="Max 420 characters"
                {...register("description", { required: true })}
                className="inputControl-cases"
              />
            </div>

            <button type="submit" className="create-lawyer-account-cases">
              Submit case
            </button>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Caseform;
