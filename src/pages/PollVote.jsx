// src/pages/PollVote.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import "./PollVote.css";

const PollVote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [voterName, setVoterName] = useState("");
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
        console.error("Error fetching poll:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch poll");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchPoll();
  }, [id, navigate]);

  const handleVote = async () => {
    if (poll.settings.requireNames && !voterName) {
      setError("Voter name is required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/polls/${id}/vote`,
        { optionIndices: selectedOptions, voterName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/poll/${id}/results`);
    } catch (err) {
      console.error("Error voting:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to vote");
    }
  };

  if (!poll) return <p>Loading...</p>;

  return (
    <div className="poll-vote-container">
      <h2>{poll.title}</h2>
      {error && <p className="error">{error}</p>}
      <p>Type: {poll.pollType}</p>
      <div className="options-list">
        {poll.options.map((option, index) => (
          <label key={index} className="option-item">
            <input
              type={poll.pollType === "Single Choice" ? "radio" : "checkbox"}
              name="options"
              checked={selectedOptions.includes(index)}
              onChange={(e) => {
                if (poll.pollType === "Single Choice") {
                  setSelectedOptions([index]);
                } else {
                  setSelectedOptions(
                    e.target.checked
                      ? [...selectedOptions, index]
                      : selectedOptions.filter((i) => i !== index)
                  );
                }
              }}
            />
            {option.text} (Votes: {option.votes})
          </label>
        ))}
      </div>
      {poll.settings.requireNames && (
        <input
          type="text"
          placeholder="Enter your name"
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
          className="name-input"
        />
      )}
      <div className="button-group">
        <Button onClick={handleVote}>Vote</Button>
        <Button onClick={() => navigate(`/poll/${id}/results`)}>View Results</Button>
      </div>
    </div>
  );
};

export default PollVote;