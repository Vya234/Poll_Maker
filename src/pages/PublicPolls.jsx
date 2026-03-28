// src/pages/PublicPolls.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/cn";
import api from "../api/client";
import PollCard from "../components/PollCard";

function totalVotesForPoll(poll) {
  if (!poll?.options?.length) return 0;
  return poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
}

const PublicPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await api.get("/api/polls/public", {
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
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, [navigate]);

  const handleVote = useCallback(
    (pollId) => {
      navigate(`/poll/${pollId}`);
    },
    [navigate],
  );

  const filteredPolls = useMemo(() => {
    let list = [...polls];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => (p.title || "").toLowerCase().includes(q));
    }
    if (sortBy === "recent") {
      list.sort((a, b) => {
        const da = new Date(a.createdAt || 0).getTime();
        const db = new Date(b.createdAt || 0).getTime();
        return db - da;
      });
    } else {
      list.sort((a, b) => totalVotesForPoll(b) - totalVotesForPoll(a));
    }
    return list;
  }, [polls, search, sortBy]);

  const chip = (active) =>
    cn(
      "rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
      active
        ? "border-transparent bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-900/20"
        : "border-brand-500/35 bg-white text-brand-700 hover:border-brand-500 hover:bg-brand-50",
    );

  if (error) {
    return (
      <div className="page-shell py-10">
        <p
          className="mx-auto max-w-2xl rounded-2xl border border-danger-500/30 bg-danger-50 px-6 py-4 text-center text-sm font-medium text-danger-700"
          role="alert"
        >
          {error}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-shell py-10">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <h1 className="page-title text-3xl sm:text-4xl">Public Polls</h1>
          <p className="mx-auto mt-2 max-w-prose text-ink-muted">
            Browse polls from the community and cast your vote.
          </p>
        </header>
        <p className="text-center text-ink-muted">Loading polls…</p>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="page-shell py-10">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <h1 className="page-title text-3xl sm:text-4xl">Public Polls</h1>
          <p className="mx-auto mt-2 max-w-prose text-ink-muted">
            Browse polls from the community and cast your vote.
          </p>
        </header>
        <div
          className="mx-auto max-w-md rounded-2xl border border-brand-500/15 bg-white px-8 py-10 text-center shadow-card"
          role="status"
        >
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl ring-2 ring-brand-200"
            aria-hidden
          >
            📊
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink">No public polls yet</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            When someone shares a poll, it will show up here. In the meantime, you can start a new question for
            others to vote on.
          </p>
          <Link
            to="/create"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 px-6 font-bold text-white shadow-md transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Create a poll
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-10">
      <header className="mx-auto mb-8 max-w-3xl text-center">
        <h1 className="page-title text-3xl sm:text-4xl">Public Polls</h1>
        <p className="mx-auto mt-2 max-w-prose text-ink-muted">
          Browse polls from the community and cast your vote.
        </p>
      </header>

      <div className="mx-auto mb-8 flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full max-w-md flex-1">
          <label htmlFor="public-polls-search" className="sr-only">
            Search polls
          </label>
          <input
            id="public-polls-search"
            type="search"
            className="form-input"
            placeholder="Search by question…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Sort poll list">
          <span className="text-sm font-semibold text-ink-muted">Sort by</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={chip(sortBy === "recent")}
              onClick={() => setSortBy("recent")}
              aria-pressed={sortBy === "recent"}
            >
              Most recent
            </button>
            <button
              type="button"
              className={chip(sortBy === "most_voted")}
              onClick={() => setSortBy("most_voted")}
              aria-pressed={sortBy === "most_voted"}
            >
              Most voted
            </button>
          </div>
        </div>
      </div>

      {filteredPolls.length === 0 ? (
        <div
          className="mx-auto max-w-lg rounded-2xl border border-brand-500/15 bg-white px-6 py-8 text-center shadow-card"
          role="status"
        >
          <p className="font-bold text-ink">No polls match your search</p>
          <p className="mt-2 text-sm text-ink-muted">Try a different keyword or clear the search box.</p>
          <button
            type="button"
            className="mt-5 rounded-xl border-2 border-brand-500/40 bg-brand-50 px-5 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98]"
            onClick={() => setSearch("")}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6">
          {filteredPolls.map((poll) => (
            <PollCard key={poll._id} poll={poll} onVote={() => handleVote(poll._id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicPolls;
