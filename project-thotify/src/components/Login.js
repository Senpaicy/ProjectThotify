import React, { useState } from "react";
import "../App.css";
import "../style/css/Forms.css"
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function Login({currentUserFromDB, setCurrentUserFromDB}) {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      const {data} = await axios.post("http://localhost:8888/users/email/", {email: email});
      console.log("logged in user: ", data);
      setCurrentUserFromDB(data);
      console.log("Current user from db by state", currentUserFromDB);
      console.log(user);
      navigate("/my-profile");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="Center-Container">
      <div className="Center">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="Text-Field">
            <input
              type="email"
              name="email"
              placeholder=""
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label>Email</label>
          </div>
          <div className="Text-Field">
            <input
              type="password"
              name="password"
              placeholder=""
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label>Password</label>
          </div>        

          <button type="submit">Login</button>
          <div className="Signup-Link">
            Not a Member? <a><NavLink to="/signup">Signup</NavLink></a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
