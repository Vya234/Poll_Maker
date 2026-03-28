// src/pages/PollList.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";

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
          navigate("/login");
          return;
        }
        const response = await api.get("/api/polls", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        await api.delete(`/api/polls/${pollId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    navigate(`/edit/${pollId}`);
  };

  return (
    <div className="page-shell py-10">
      <h2 className="page-title text-center text-3xl text-brand-600 sm:text-4xl">My Polls</h2>
      {error && (
        <p className="mx-auto mt-4 max-w-xl rounded-xl bg-danger-50 px-4 py-2 text-center text-sm font-medium text-danger-600">
          {error}
        </p>
      )}
      {polls.length === 0 ? (
        <p className="mx-auto mt-8 max-w-md text-center text-ink-muted">
          No polls found.{" "}
          <Link to="/create" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
            Create one now!
          </Link>
        </p>
      ) : (
        <ul className="mx-auto mt-8 max-w-2xl space-y-4">
          {polls.map((poll) => (
            <li
              key={poll._id}
              className="rounded-2xl border border-brand-500/12 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Link
                to={`/poll/${poll._id}`}
                className="block text-left text-lg font-bold text-ink transition hover:text-brand-600"
              >
                {poll.title}
              </Link>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-end">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(poll._id)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(poll._id)}>
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
