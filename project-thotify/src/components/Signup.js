import React, { useState } from "react";
import "../style/css/Forms.css";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes, useNavigate
} from "react-router-dom"
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [funFact, setFunFact] = useState("");
  const [other, setOther] = useState("");
  const [error, setError] = useState("");

  const { signup } = useAuth();
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(passwordConfirmation !== password) {
        throw("Error: Passwords don't match");
      }
      console.log("????????");
      const userInDatabase = await axios.post(
        "http://localhost:8888/users/create-user-profile",
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          description: description,
          funFact: funFact,
          other: other,
        }
      );
      const user = await signup(email, password);
      console.log("am i not erroring");
      navigate("/login");
    } catch (error) {
      console.log("am i erroring");
      console.log("Error", error);
      if(error.response && error.response.data.error){
      setError(error.response.data.error);
      }else {
        setError(error);
      }

    }
  };

  return (
    <div className="Center-Container">
      <div className="Center">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="Text-Field">
            <input
              type="text"
              name="firstName"
              placeholder=""
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <label>First Name</label>
          </div>

          <div className="Text-Field">
            <input
              type="text"
              name="lastName"
              placeholder=""
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <label>Last Name</label>
          </div>

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
          <div className="Text-Field">
            <input
              type="password"
              name="passwordConfirmation"
              placeholder=""
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
              }}
            />
            <label>Re-enter Password</label>
          </div>
          <div className="Text-Field">
            <input
              type="text"
              name="description"
              placeholder=""
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <label>Describe yourself in a couple of words...</label>
          </div>
          <div className="Text-Field">
            <input
              type="text"
              name="funFact"
              placeholder=""
              onChange={(e) => {
                setFunFact(e.target.value);
              }}
            />
            <label>Add a little fun fact about yourself...</label>
          </div>
          <div className="Text-Field">
            <input
              type="text"
              name="other"
              placeholder=""
              onChange={(e) => {
                setOther(e.target.value);
              }}
            />
            <label>Any extra information?</label>
          </div>

          <button type="submit">Register</button>
          <div className="Signup-Link">
            Already a Member? <a><NavLink to="/login">Login</NavLink></a>
          </div>
        </form>
        {error && <p>{`${error}`}</p>}
      </div>
    </div>
  );
}

export default Signup;
