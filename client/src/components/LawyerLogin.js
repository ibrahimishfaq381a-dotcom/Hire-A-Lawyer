// import './loginForm.css'
// import { Button } from '@mui/material';
// import { useForm } from 'react-hook-form';
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'

// const LawyerLogin = () => {
//   const navigate = useNavigate()

//   const { register, handleSubmit, formState: { errors } } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/lawyer/logininlawyer',
//         data
//       )

//       const id = response.data.data._id
//       navigate(`/profile/${id}`)

//     } catch (error) {
//       console.log(error);
//     }
//   }

//   return (
//     <div className='form-bodyLogin'>

//       {/* 🔥 LEFT SIDE (LAWYER CONTENT) */}
//       <div className='left-section'>
//         <h1>
//           Welcome Back <span>Lawyer</span>
//         </h1>

//         <p>
//           Access your dashboard, manage your clients,
//           and grow your legal practice with confidence.
//         </p>

//         <div className="lawyer-info">
//           <h3>Why Join Us?</h3>
//           <ul>
//             <li>⚖️ Get Verified Clients</li>
//             <li>📁 Manage Cases Easily</li>
//             <li>📈 Grow Your Legal Career</li>
//             <li>🔐 Secure & Private Platform</li>
//           </ul>
//         </div>
//       </div>

//       {/* 🔥 RIGHT SIDE (FORM) */}
//       <div className="containerLogin">

//         <h2 className='MainTextLogin'>
//           Lawyer Login <span className='HireLogin'>HireALawyer.pk</span>
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)}>

//           {/* EMAIL */}
//           <div className="input-group">
//             <input
//               type="email"
//               placeholder=" "
//               className='FieldLogin'
//               {...register('email', { required: 'Email is required' })}
//             />
//             <label>Email Address</label>
//             {errors.email && <p className="error">{errors.email.message}</p>}
//           </div>

//           {/* PASSWORD */}
//           <div className="input-group">
//             <input
//               type="password"
//               placeholder=" "
//               className='FieldLogin'
//               {...register('password', { required: 'Password is required' })}
//             />
//             <label>Password</label>
//             {errors.password && <p className="error">{errors.password.message}</p>}
//           </div>

//           {/* LOGIN BUTTON */}
//           <button type="submit" className="submit-btnLogin">
//             Login as Lawyer
//           </button>

//           {/* SWITCH TO CLIENT */}
//           <Button
//             className='Register-btnLogin'
//             fullWidth
//             onClick={() => navigate('/')}
//           >
//             Login as Client
//           </Button>

//           {/* REGISTER */}
//           <div className='Register-btnLogin-Control'>

//             <Button
//               className='Register-btnLogin'
//               fullWidth
//               onClick={() => navigate('/lawyer')}
//             >
//               Register as Lawyer
//             </Button>

//             <Button
//               className='Register-btnLogin'
//               fullWidth
//               onClick={() => navigate('/customer')}
//             >
//               Register as Customer
//             </Button>

//           </div>

//         </form>
//       </div>

//     </div>
//   )
// }

// export default LawyerLogin;

import "./loginForm.css";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LawyerLogin = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setErrorMsg("");

      const response = await axios.post(
        "http://localhost:5000/lawyer/logininlawyer",
        data
      );

      const lawyerData = response.data.data?.loggedInLawyer;
      const id = lawyerData?._id;

      if (!id) {
        setErrorMsg("Login failed! Please try again.");
        return;
      }

      // ✅ Save lawyer as user for chat system (same structure as client)
      localStorage.setItem("user", JSON.stringify(lawyerData));
      localStorage.setItem("userId", id);
      localStorage.setItem("userRole", "lawyer");

      if (response.data.data?.accessToken) {
        localStorage.setItem("token", response.data.data.accessToken);
      }

      navigate(`/profile/${id}`);
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message || "Invalid credentials");
      } else {
        setErrorMsg("Network error! Please try again.");
      }
    }
  };

  return (
    <div className="form-bodyLogin">

      {/* LEFT SIDE */}
      <div className="left-section">
        <h1>
          Welcome Back <span>Lawyer</span>
        </h1>
        <p>Access your dashboard, manage your clients, and grow your legal practice.</p>
        <div className="lawyer-info">
          <h3>Why Join Us?</h3>
          <ul>
            <li>⚖️ Get Verified Clients</li>
            <li>📁 Manage Cases Easily</li>
            <li>💬 Real-time Chat</li>
            <li>🔐 Secure & Private Platform</li>
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="containerLogin">
        <h2 className="MainTextLogin">
          Lawyer Login <span className="HireLogin">HireALawyer.pk</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {errorMsg && <p className="error">{errorMsg}</p>}

          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              className="FieldLogin"
              {...register("email", { required: "Email is required" })}
            />
            <label>Email Address</label>
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              className="FieldLogin"
              {...register("password", { required: "Password is required" })}
            />
            <label>Password</label>
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="submit-btnLogin">
            Login as Lawyer
          </button>

          <Button className="Register-btnLogin" fullWidth onClick={() => navigate("/")}>
            Login as Client
          </Button>

          <div className="Register-btnLogin-Control">
            <Button className="Register-btnLogin" fullWidth onClick={() => navigate("/lawyer")}>
              Register as Lawyer
            </Button>
            <Button className="Register-btnLogin" fullWidth onClick={() => navigate("/customer")}>
              Register as Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LawyerLogin;