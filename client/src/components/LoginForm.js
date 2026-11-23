//   // import React, { useState } from 'react'
//   import './loginForm.css'
//   import { Button } from '@mui/material';
//   import { useForm } from 'react-hook-form';
//   import axios from 'axios'
//   import {useNavigate} from 'react-router-dom'

//   const LoginForm = () => {
//     const navigate = useNavigate()

//     const { register, handleSubmit, formState: { errors } } = useForm();
    
//     const onSubmit = async (data) => {
//   try {
//     const response = await axios.post(
//       'http://localhost:5000/client/logininclient',
//       data
//     );

//     console.log(response.data);
//     localStorage.setItem("lawyerId", response.data._id);

//     navigate('/home');

//   } catch (error) {
//     console.log(error);
//   }
// };



//     const lawyer = () => {
//       navigate('/lawyer')
//     }

//     const customer = () => {
//       navigate('/customer')
//     }

//     const lawyerLogin = () => {
//       navigate('/lawyerlogin')
//     }
    


//     return (
//       <>
//         <div className='form-bodyLogin'>
//           <div className="bodyContainerLogin">
//             <div className ="containerLogin">
//               <h1 className='MainTextLogin'>
//                 Login <span className='HireLogin'>HireALawyer.pk</span>
//               </h1>
//               <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className ="form-containerLogin">
                
//                   <div className ="form-controlLogin">
//                     <label className='TextLogin'>Email Address</label>
//                     <div></div>
//                     <input
//                       type="text"
//                       name="email"
//                       {...register('email', { required: 'Email is required' })}
//                       className='FieldLogin'
//                     />
//                     {errors.email && <p className="error">{errors.email.message}</p>}
//                   </div>
                  
//                   <div className ="form-controlLogin">
//                     <label className='TextLogin'>Password</label>
//                     <div></div>
//                     <input
//                       type="password"
//                       name="password"
//                       {...register('password', { required: 'Password is required' })}
//                       className='FieldLogin'
//                     />
//                     {errors.password && <p className="error">{errors.password.message}</p>}
//                   </div>

//                   <div className='container-btn-textLogin'>
//                     {/* Add forgot password link or other actions if needed */}
//                   </div>
                  
//                   <button type="submit" className="submit-btnLogin">Submit</button>
//                   <Button className='Register-btnLogin' onClick={lawyerLogin}>Login as Lawyer</Button>
//                   <div className='registerLogin'>
//                     <h6 className='text-accountLogin'>
//                       Don't have an account?
//                     </h6>
//                     <ul>
//                       <li className='Register-btnLogin-Control'>
//                         <Button className='Register-btnLogin' onClick={lawyer}>Register as Lawyer</Button>
//                         <Button className='Register-btnLogin' onClick={customer}>Register as Customer</Button>
//                       </li>
//                     </ul>
//                   </div>
                  
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </>
//     )
//   }

//   export default LoginForm;

// import React from 'react'
// import './loginForm.css'
// import { Button } from '@mui/material'
// import { useForm } from 'react-hook-form'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'

// const LoginForm = () => {
//   const navigate = useNavigate()
//   const { register, handleSubmit } = useForm()

//   const onSubmit = async (data) => {
//     try {
//       const res = await axios.post(
//         'http://localhost:5000/client/logininclient',
//         data
//       )
//       localStorage.setItem("userId", res.data._id)
//       navigate('/home')
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   return (
//     <div className='form-bodyLogin'>

//       {/* LEFT SIDE */}
//       <div className='left-section'>
//         <h1>Hire Trusted <span>Lawyers</span></h1>
//         <p>Find verified legal experts for your cases quickly and securely.</p>

//         <div className="lawyer-info">
//           <h3>Platform Highlights</h3>
//           <ul>
//             <li>⚖️ Family & Civil Case Support</li>
//             <li>🔐 Secure Communication</li>
//             <li>⚡ Fast Legal Help</li>
//           </ul>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="containerLogin">

//         <h2 className='MainTextLogin'>
//           Client Login <span className='HireLogin'>HireALawyer.pk</span>
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)}>

//           <div className="input-group">
//             <input type="email" placeholder=" " className='FieldLogin'
//               {...register('email', { required: true })}
//             />
//             <label>Email Address</label>
//           </div>

//           <div className="input-group">
//             <input type="password" placeholder=" " className='FieldLogin'
//               {...register('password', { required: true })}
//             />
//             <label>Password</label>
//           </div>

//           <button className="submit-btnLogin">
//             Login as Client
//           </button>

//           <Button
//             className='Register-btnLogin'
//             fullWidth
//             onClick={() => navigate('/lawyerlogin')}
//           >
//             Login as Lawyer
//           </Button>

//           <div className='Register-btnLogin-Control'>
//             <Button fullWidth className='Register-btnLogin' onClick={() => navigate('/lawyer')}>
//               Register as Lawyer
//             </Button>

//             <Button fullWidth className='Register-btnLogin' onClick={() => navigate('/customer')}>
//               Register as Customer
//             </Button>
//           </div>

//         </form>
//       </div>
//     </div>
//   )
// }

// export default LoginForm


import React from 'react'
import './loginForm.css'
import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/client/logininclient',
        data
      )

      console.log("LOGIN RESPONSE:", res.data)

      // 🔥 SAFE FIX FOR CHAT SYSTEM
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data))
      localStorage.setItem("userId", res.data.user?._id || res.data._id)

      // optional token (if backend sends)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
      }

      navigate('/home')

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='form-bodyLogin'>

      {/* LEFT SIDE */}
      <div className='left-section'>
        <h1>Hire Trusted <span>Lawyers</span></h1>
        <p>Find verified legal experts for your cases quickly and securely.</p>

        <div className="lawyer-info">
          <h3>Platform Highlights</h3>
          <ul>
            <li>⚖️ Family & Civil Case Support</li>
            <li>🔐 Secure Communication</li>
            <li>⚡ Fast Legal Help</li>
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="containerLogin">

        <h2 className='MainTextLogin'>
          Client Login <span className='HireLogin'>HireALawyer.pk</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="input-group">
            <input type="email" placeholder=" " className='FieldLogin'
              {...register('email', { required: true })}
            />
            <label>Email Address</label>
          </div>

          <div className="input-group">
            <input type="password" placeholder=" " className='FieldLogin'
              {...register('password', { required: true })}
            />
            <label>Password</label>
          </div>

          <button className="submit-btnLogin">
            Login as Client
          </button>

          <Button
            className='Register-btnLogin'
            fullWidth
            onClick={() => navigate('/lawyerlogin')}
          >
            Login as Lawyer
          </Button>

          <div className='Register-btnLogin-Control'>
            <Button fullWidth className='Register-btnLogin' onClick={() => navigate('/lawyer')}>
              Register as Lawyer
            </Button>

            <Button fullWidth className='Register-btnLogin' onClick={() => navigate('/customer')}>
              Register as Customer
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default LoginForm