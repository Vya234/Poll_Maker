// src/pages/PollResults.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";

const BAR_FILLS = [
  "linear-gradient(90deg, #2a9d8f 0%, #48c9b0 100%)",
  "linear-gradient(90deg, #227c70 0%, #2a9d8f 100%)",
  "linear-gradient(90deg, #1d6b61 0%, #3aab9a 100%)",
  "linear-gradient(90deg, #2e8b7d 0%, #5fd4c1 100%)",
  "linear-gradient(90deg, #267a6f 0%, #42c4b1 100%)",
];

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
        const response = await api.get(`/api/polls/${id}`, {
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

  const rows = useMemo(() => {
    if (!poll?.options?.length) return [];
    const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
    return poll.options.map((option, index) => {
      const pct = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
      const pctDisplay = totalVotes > 0 ? pct.toFixed(1) : "0";
      return {
        key: `${index}-${option.text}`,
        text: option.text,
        votes: option.votes || 0,
        percentage: pct,
        pctDisplay,
        fillStyle: BAR_FILLS[index % BAR_FILLS.length],
      };
    });
  }, [poll]);

  if (!poll) {
    return (
      <div className="page-shell py-16 text-center text-ink-muted">
        Loading…
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);

  return (
    <div className="page-shell max-w-3xl py-10">
      <div className="surface-card text-center">
        <h2 className="page-title text-2xl text-brand-600 sm:text-3xl">
          {poll.title} Results
        </h2>
        {error && (
          <p className="mt-4 rounded-xl bg-danger-50 px-3 py-2 text-sm font-semibold text-danger-600">{error}</p>
        )}
        <p className="mt-4 text-base font-semibold text-ink-muted">Total votes: {totalVotes}</p>

        <ul className="mt-6 space-y-5 text-left" aria-label="Results by option">
          {rows.map((row) => (
            <li key={row.key}>
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="font-bold text-ink">{row.text}</span>
                <span className="flex items-baseline gap-3 text-sm">
                  <span className="text-ink-muted">{row.votes} votes</span>
                  <span className="min-w-[3.25rem] text-right text-base font-extrabold tabular-nums text-brand-600">
                    {row.pctDisplay}%
                  </span>
                </span>
              </div>
              <div
                className="h-3 overflow-hidden rounded-full bg-gradient-to-b from-brand-100 to-brand-100/80 shadow-inner shadow-brand-900/5"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(row.percentage * 10) / 10}
                aria-label={`${row.text}: ${row.pctDisplay} percent`}
              >
                <div
                  className="h-full rounded-full shadow-sm transition-all duration-500 ease-out"
                  style={{
                    width: `${row.percentage}%`,
                    background: row.fillStyle,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-brand-500/15 pt-6">
          <Button variant="primary" className="min-w-[12rem]" onClick={() => navigate(`/poll/${id}`)}>
            Back to Poll
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PollResults;
