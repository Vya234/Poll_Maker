// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";

const Login = () => {
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
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setSuccess("Login successful!");
      window.dispatchEvent(new Event("tokenChange"));
      setTimeout(() => navigate("/polls"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <div className="surface-card w-full max-w-md animate-fadeIn text-center">
        <h2 className="page-title text-2xl text-brand-600 sm:text-3xl">Login to QuickPoll</h2>
        <p className="mt-2 text-ink-muted">Access your account to create and manage polls.</p>
        {error && (
          <p className="mt-4 rounded-xl bg-danger-50 px-3 py-2 text-sm font-medium text-danger-600" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 rounded-xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">
            {success}
          </p>
        )}

        <form className="mt-6 text-left" onSubmit={handleSubmit}>
          <label className="form-label">Username</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="form-label mt-4">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" className="mt-6 w-full min-h-12 text-base">
            Login
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink-muted">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
