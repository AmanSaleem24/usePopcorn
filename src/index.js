import React from "react";
import ReactDOM from "react-dom/client";
import { useState } from "react";
import App from "./App";
import StarRating from "./StarRatiing";
// import "./index.css"; // optional, if you have global styles

const root = ReactDOM.createRoot(document.getElementById("root"));

function Test(){
  const [rating, setRating] = useState(0)
  return(
    <div>
      <StarRating color="red" maxRating={10} size={30} onSetRating={setRating}/>
      <p>This movie was rated {rating} on iMDB.</p>
    </div>
  )
}
root.render(
  <React.StrictMode>
    <StarRating maxRating="Ass" messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}/>
    <StarRating maxRating={10} size={24} color="red" defaultRating = {"3"} />
    <Test />
  </React.StrictMode>
);
