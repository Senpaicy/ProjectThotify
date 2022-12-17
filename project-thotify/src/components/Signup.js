import React, { useState } from "react";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [funFact, setFunFact] = useState("");
  const [other, setOther] = useState("");

  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("????????");
      const user = await signup(email, password);
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
      console.log("am i not erroring");
    } catch (error) {
      console.log("am i erroring");
      console.log(error.message);
    }
  };

  return (
    <div>
      <h1> Register User </h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            placeholder="Bob..."
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
        </label>
        <label>
          Last Name
          <input
            placeholder="Smith..."
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </label>
        <label>
          Email
          <input
            placeholder="Email..."
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <h1>Add your bio here!</h1>
        <label>
          Describe yourself:
          <input
            placeholder="I am not your ordinary music enthusiast..."
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </label>
        <label>
          A fun fact about yourself:
          <input
            placeholder="I am Challenger in LoL!..."
            onChange={(e) => {
              setFunFact(e.target.value);
            }}
          />
        </label>
        <label>
          Any other information:
          <input
            placeholder="I am allergic to peanuts :(..."
            onChange={(e) => {
              setOther(e.target.value);
            }}
          />
        </label>

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

export default Signup;
