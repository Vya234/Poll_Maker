// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    const handleStorageChange = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tokenChange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenChange", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("tokenChange"));
    navigate("/");
  };

  const linkClass =
    "rounded-lg px-2 py-1 text-sm font-bold text-white transition hover:text-accent-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-warm focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600 sm:text-base";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-brand-600 to-brand-700 shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src="/images/logo.png"
            alt=""
            className="h-12 w-auto shrink-0 object-contain sm:h-14"
          />
          <Link to="/" className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            QuickPoll
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
          <Link to="/" className={linkClass}>
            Home
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/create" className={linkClass}>
                Create Poll
              </Link>
              <Link to="/polls" className={linkClass}>
                My Polls
              </Link>
              <Link to="/public-polls" className={linkClass}>
                Public Polls
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-bold text-white transition hover:text-accent-warm focus:outline-none focus-visible:border-accent-warm/90 focus-visible:bg-white/10 sm:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Login
              </Link>
              <Link to="/signup" className={linkClass}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
