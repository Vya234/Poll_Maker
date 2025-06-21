// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import "./Home.css";


const Home = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="home-container">
      <h1>Welcome to QuickPoll</h1>
      <p>Create and vote on polls with ease!</p>
      {isLoggedIn ? (
        <Link to="/create">
          <Button className="home-button">Create a Poll</Button>
        </Link>
      ) : (
        <div className="home-actions">
          <Link to="/login">
            <Button className="home-button">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="home-button signup">Sign Up</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;