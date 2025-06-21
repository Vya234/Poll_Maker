// src/pages/PollResults.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button"; // Add this import
import "./PollResults.css";

const PollResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/polls/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPoll(response.data);
      } catch (err) {
        console.error("Error fetching poll results:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch poll results");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchPoll();
  }, [id, navigate]);

  if (!poll) return <p>Loading...</p>;

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const percentages = poll.options.map(option => ({
    text: option.text,
    percentage: totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0,
  }));

  return (
    <div className="poll-results-container">
      <h2>{poll.title} Results</h2>
      {error && <p className="error">{error}</p>}
      <p>Total Votes: {totalVotes}</p>
      {poll.options.map((option, index) => (
        <div key={index} className="result-item">
          <span>{option.text}: {option.votes} votes ({percentages[index].percentage}%)</span>
        </div>
      ))}
      <Button onClick={() => navigate(`/poll/${id}`)}>Back to Poll</Button>
    </div>
  );
};

export default PollResults;