import "../App.css";
import "../style/css/LandingPage.css"
import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";

function LandingPage() {
  return (
    <div className="Center-Container">
      <h1>Welcome to Thotify!</h1>
      <div className="Center1">
        <p>
          Connect with people who have a similar music taste!

          Listening to music is an important aspect of people's lives. What if you could make friends or more than friends based on your music interest. Thotify uses the spotify API where they collect data about your top Artists and Tracks. 
        </p>
        <NavLink to="/signup">
          <button>Get Started</button>
        </NavLink>
      </div>
    </div>
  );
}

export default LandingPage;