// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const Home = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="page-shell flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
      <h1 className="page-title max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
        Welcome to QuickPoll
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted sm:text-xl">
        Create and vote on polls with ease — clear questions, fair choices, live results.
      </p>
      {isLoggedIn ? (
        <div className="mt-10">
          <Link to="/create">
            <Button variant="primary" className="min-w-[12rem] px-8">
              Create a Poll
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/login" className="sm:flex-1">
            <Button variant="onGreen" className="w-full sm:min-w-[10rem]">
              Login
            </Button>
          </Link>
          <Link to="/signup" className="sm:flex-1">
            <Button variant="dark" className="w-full sm:min-w-[10rem]">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
