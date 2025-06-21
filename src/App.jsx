// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PollForm from "./components/PollForm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PollList from "./pages/PollList";
import PublicPolls from "./pages/PublicPolls"; // Import the new page
import PollVote from "./pages/PollVote";
import PollResults from "./pages/PollResults";
import PollEdit from "./pages/PollEdit";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <PollForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/polls"
              element={
                <PrivateRoute>
                  <PollList />
                </PrivateRoute>
              }
            />
            <Route
              path="/public-polls"
              element={
                <PrivateRoute>
                  <PublicPolls />
                </PrivateRoute>
              }
            />
            <Route path="/poll/:id" element={<PollVote />} />
            <Route path="/poll/:id/results" element={<PollResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/edit/:id"
              element={
                <PrivateRoute>
                  <PollEdit />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;