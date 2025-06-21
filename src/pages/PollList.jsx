// src/pages/PollList.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import "./PollList.css";

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          console.log("No token found in localStorage");
          navigate("/login");
          return;
        }
        console.log("Fetching polls with token:", token.substring(0, 20) + "...");
        const response = await axios.get("http://localhost:5000/api/polls", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Polls fetched:", response.data);
        setPolls(response.data);
      } catch (err) {
        console.error("Error fetching polls:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch polls");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchPolls();
  }, [navigate]);

  const handleDelete = async (pollId) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          navigate("/login");
          return;
        }
        console.log("Deleting poll with ID:", pollId);
        await axios.delete(`http://localhost:5000/api/polls/${pollId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Poll deleted successfully:", pollId);
        setPolls(polls.filter((poll) => poll._id !== pollId));
      } catch (err) {
        console.error("Error deleting poll:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to delete poll");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    }
  };

  const handleEdit = (pollId) => {
    console.log("Navigating to edit page for poll ID:", pollId);
    navigate(`/edit/${pollId}`);
  };

  return (
    <div className="poll-list-container">
      <h2>My Polls</h2>
      {error && <p className="error">{error}</p>}
      {polls.length === 0 ? (
        <p>
          No polls found. <Link to="/create">Create one now!</Link>
        </p>
      ) : (
        <ul className="poll-list">
          {polls.map((poll) => (
            <li key={poll._id} className="poll-item">
              <Link to={`/poll/${poll._id}`}>{poll.title}</Link>
              <div className="poll-actions">
                <Button className="edit-button" onClick={() => handleEdit(poll._id)}>
                  Edit
                </Button>
                <Button className="delete-button" onClick={() => handleDelete(poll._id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PollList;