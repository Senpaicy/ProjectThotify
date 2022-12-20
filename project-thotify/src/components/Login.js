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
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      const {data} = await axios.post("http://35.163.199.26:8888/users/email/", {email: email});
      console.log("logged in user: ", data);
      setCurrentUserFromDB(data);
      console.log("Current user from db by state", currentUserFromDB);
      console.log(user);
      navigate("/my-profile");
    } catch (error) {
      console.log(error.message);
      if(error.response && error.response.data.error){
        setError(error.response.data.error);
      }
      else {
        setError(error);
      }
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
              id="email"
              placeholder=""
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="Text-Field">
            <input
              type="password"
              name="password"
              id="password"
              placeholder=""
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label htmlFor="password">Password</label>
          </div>        
          <div className="ErrorMessage">
            {error && 
              <p>
                {`${error}`}
              </p>
            }
          </div>     
          <button type="submit">Login</button>
          <div className="Signup-Link">
            Not a Member? <NavLink to="/signup">Signup</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
