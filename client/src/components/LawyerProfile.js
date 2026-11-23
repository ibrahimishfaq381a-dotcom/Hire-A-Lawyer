import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function LawyerProfile() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/lawyers/id/"+ id);
        setLawyer(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  if (!lawyer) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{lawyer.name}</h1>
      <p><b>Specialization:</b> {lawyer.specialization}</p>
      <p><b>Location:</b> {lawyer.location}</p>
      <p><b>Experience:</b> {lawyer.experience} years</p>
      <p><b>Email:</b> {lawyer.email}</p>
    </div>
  );
}

export default LawyerProfile;