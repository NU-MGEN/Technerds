/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    console.log("entering");
    event.preventDefault();
    setRole("student");
    navigate("/chatbot", { state: { role: "student" } });
    // Implement authentication logic here
    if (userId === "validUserId" && password === "validPassword") {
      setRole("student");
      console.log(
        `Logging in with User ID: ${userId} and Password: ${password}`
      );
      navigate("/chatbot", role); // Change from history.push to navigate
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label htmlFor="userId" className="form-label">
            User ID:
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
