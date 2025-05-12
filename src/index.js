import React from "react";
import ReactDOM from "react-dom/client";



// import App from "./App";
import AppV1 from "./App-v1";
// import StarRating from "./StarRatiing";
// import TextExpander from "./TextExpander";


import "./index.css"; // optional, if you have global styles

const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <React.StrictMode>
    <AppV1 />
  </React.StrictMode>
);
