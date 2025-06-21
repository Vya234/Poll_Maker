// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Add Link for navigation to login
import axios from "axios";
import Button from "../components/Button";
import "./Auth.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setSuccess("Signup successful! Redirecting...");
      window.dispatchEvent(new Event("tokenChange")); // Trigger Navbar update
      setTimeout(() => navigate("/polls"), 1000); // Redirect to /polls after 1 second
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up for QuickPoll</h2>
        <p>Create an account to start making polls.</p>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="auth-button">
            Sign Up
          </Button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;