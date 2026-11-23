// // import React, {useState} from "react";
// // import Navbar from "./components/Navbar";
// import Home from "./components/Home";
// import About from "./components/About";
// import Contact from "./components/Contact";
// import Services from "./components/Services";
// import Profile from "./components/Profile";
// import { Routes, Route } from "react-router-dom";
// import LoginForm from "./components/LoginForm";
// import LawyerRegistration from "./components/LawyerRegistration.js"
// // import ProfileLawyers from "./components/ProfileLawyers";
// // import LegalNoticeLawyer from './components/LegalNoticeLawyer.js'
// import "./App.css";
// import CustomerRegistration from "./components/CustomerRegistration";
// // import Footer from "./components/Footer.js";
// import HireForm from "./components/HireForm";
// import Caseform from "./components/Caseform"
// import Casedescription from "./components/Casedescription";
// import Casestudy from "./components/Casestudy";
// import Cases from "./components/Cases";
// import LawyerLogin from "./components/LawyerLogin.js";
// // import CriminalMatterLawyer from "./components/CriminalMatterLawyer.js";
// // import DivorceLawyers from "./components/DivorceLawyers.js";
// // import FamilyMatterLawyers from "./components/FamilyMatterLawyers.js";
// // import MediationLawyers from "./components/MediationLawyers.js";
// // import CompanyRegLawyers from "./components/CompanyRegLawyers.js";
// // import TradeMarkLawyers from "./components/TradeMarkLawyers.js";
// // import TaxFilingLawyers from "./components/TaxFilingLawyers.js";
// // import RecoveryMatterLawyers from "./components/RecoveryMatterLawyers.js";
// // import ImmigrationLawyers from "./components/ImmigrationLawyers.js";
// // import ServiceMatterLawyers from "./components/ServiceMatterLawyers.js";
// // import CivilMatterLawyers from "./components/CivilMatterLawyers.js";
// import GetLawyers from "./components/GetLawyers.jsx";
// // import socket from "./socket";
// import LawyerProfile from "./components/LawyerProfile.js";
// import AISupport from "./components/Aisupport.js";

// function App() {

//   return (
//     <>
    

//     <Routes>
//       <Route path="/" element={ <LoginForm />}/>
//       <Route exact path="/home" element={<Home/>}/>
      
//       <Route path="/about" element={ <About />}/>

//       <Route path="/lawyer/id/:id" element={<LawyerProfile />} />

//       <Route path="/service" element={ <Services />}/>

//       <Route path="/contact" element={ <Contact />}/>

//       <Route path="/Aisupport" element={<AISupport />} />

//       <Route path="/profile/:id" element={<Profile />} />
       
       
//       <Route path="/register" element={ <customerRegistration />}/>

//       <Route path="/lawyer" element={ <LawyerRegistration />}/>

//       <Route path="/getlawyers" element={ <GetLawyers />}/>

//       <Route path="/customer" element={ <CustomerRegistration/>}/>

//       <Route path="/profile/:id/hire-form" element={<HireForm />} />

//       <Route path="/casestudy" element={ <Casestudy />}/>

//       <Route path="/cases" element={ <Cases />}/>

//       <Route path="/customer" element={ <CustomerRegistration/>}/>
      
//       <Route path="/caseform" element={ <Caseform/>}/>

//       <Route path="/casedescription/:id" element={ <Casedescription/>}/>

//       <Route path="/lawyerlogin" element={ <LawyerLogin/> } />

//     </Routes>
     
//      {/* <Footer /> */}
//     </>
//   );
    
// }
// export default App;



import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Services from "./components/Services";
import Profile from "./components/Profile";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import LawyerRegistration from "./components/LawyerRegistration.js";
import "./App.css";
import CustomerRegistration from "./components/CustomerRegistration";
import HireForm from "./components/HireForm";
import Caseform from "./components/Caseform";
import Casedescription from "./components/Casedescription";
import Casestudy from "./components/Casestudy";
import Cases from "./components/Cases";
import LawyerLogin from "./components/LawyerLogin.js";
import GetLawyers from "./components/GetLawyers.jsx";
import LawyerProfile from "./components/LawyerProfile.js";
import AISupport from "./components/Aisupport.js";
import ChatPage from "./components/ChatPage.js"; // ✅ NEW

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/lawyer/id/:id" element={<LawyerProfile />} />

        <Route path="/service" element={<Services />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/Aisupport" element={<AISupport />} />

        <Route path="/profile/:id" element={<Profile />} />

        <Route path="/lawyer" element={<LawyerRegistration />} />

        <Route path="/getlawyers" element={<GetLawyers />} />

        <Route path="/customer" element={<CustomerRegistration />} />

        <Route path="/profile/:id/hire-form" element={<HireForm />} />

        <Route path="/casestudy" element={<Casestudy />} />

        <Route path="/cases" element={<Cases />} />

        <Route path="/caseform" element={<Caseform />} />

        <Route path="/casedescription/:id" element={<Casedescription />} />

        <Route path="/lawyerlogin" element={<LawyerLogin />} />

        {/* ✅ NEW — Chat Route */}
        <Route path="/chat/:roomId" element={<ChatPage />} />
      </Routes>
    </>
  );
}

export default App;