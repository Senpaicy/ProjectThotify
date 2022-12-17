import React, { useState } from "react";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";

function Signup({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };
    try {
      console.log("????????");
      const user = await signup(email, password);
      console.log("am i not erroring");
      console.log(user);
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

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

export default Signup;
