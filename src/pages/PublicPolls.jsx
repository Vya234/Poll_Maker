// src/pages/PublicPolls.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PollList.css"; // Reuse PollList.css for styling

const PublicPolls = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/polls/public", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPolls(response.data);
      } catch (err) {
        console.error("Error fetching public polls:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch public polls");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchPolls();
  }, [navigate]);

  if (error) return <p className="error">{error}</p>;
  if (polls.length === 0) return <p>No public polls available.</p>;

  return (
    <div className="poll-list-container">
      <h2>Public Polls</h2>
      <ul className="poll-list">
        {polls.map((poll) => (
          <li key={poll._id} className="poll-item">
            <Link to={`/poll/${poll._id}`}>{poll.title}</Link>
            <div className="poll-actions">
              <button
                className="edit-button"
                onClick={() => navigate(`/poll/${poll._id}`)}
              >
                Vote
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicPolls;