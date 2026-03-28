// src/pages/PollVote.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";

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
        const response = await api.get(`/api/polls/${id}`, {
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
      await api.post(
        `/api/polls/${id}/vote`,
        { optionIndices: selectedOptions, voterName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate(`/poll/${id}/results`);
    } catch (err) {
      console.error("Error voting:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to vote");
    }
  };

  if (!poll) {
    return (
      <div className="page-shell py-16 text-center text-ink-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="page-shell max-w-3xl py-10">
      <div className="surface-card mx-auto text-center">
        <h2 className="page-title text-2xl text-brand-600 sm:text-3xl">{poll.title}</h2>
        {error && (
          <p className="mt-4 rounded-xl bg-danger-50 px-3 py-2 text-sm font-semibold text-danger-600">{error}</p>
        )}
        <p className="mt-3 text-sm font-medium text-ink-muted">
          Type: <span className="text-ink">{poll.pollType}</span>
        </p>
        <div className="mt-6 space-y-3 text-left">
          {poll.options.map((option, index) => (
            <label
              key={index}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/90 bg-brand-50/30 px-4 py-3 text-ink transition hover:bg-brand-50/60"
            >
              <input
                type={poll.pollType === "Single Choice" ? "radio" : "checkbox"}
                name="options"
                className="h-4 w-4 shrink-0 border-slate-300 text-brand-600 focus:ring-brand-500"
                checked={selectedOptions.includes(index)}
                onChange={(e) => {
                  if (poll.pollType === "Single Choice") {
                    setSelectedOptions([index]);
                  } else {
                    setSelectedOptions(
                      e.target.checked
                        ? [...selectedOptions, index]
                        : selectedOptions.filter((i) => i !== index),
                    );
                  }
                }}
              />
              <span className="font-medium">
                {option.text}{" "}
                <span className="text-sm font-normal text-ink-muted">({option.votes} votes)</span>
              </span>
            </label>
          ))}
        </div>
        {poll.settings.requireNames && (
          <input
            type="text"
            placeholder="Enter your name"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            className="form-input mx-auto mt-6 max-w-xs text-center"
          />
        )}
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button variant="primary" className="sm:min-w-[10rem]" onClick={handleVote}>
            Vote
          </Button>
          <Button variant="secondary" className="sm:min-w-[10rem]" onClick={() => navigate(`/poll/${id}/results`)}>
            View Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PollVote;
