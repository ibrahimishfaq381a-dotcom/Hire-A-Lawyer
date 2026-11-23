import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

// 👇 Tidio Script (Correct way)
const tidioScript = document.createElement("script");
tidioScript.src = "https://code.tidio.co/dbnendve8bdtedftpmplhq21copsedps.js";
tidioScript.async = true;
document.body.appendChild(tidioScript);

ReactDOM.render(
  <BrowserRouter
    future={{
      v7_startTransition: true
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();