// src/pages/PollEdit.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";

const PollEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [title, setTitle] = useState("");
  const [pollType, setPollType] = useState("Single Choice");
  const [options, setOptions] = useState([]);
  const [settings, setSettings] = useState({ allowMultiple: false, requireNames: false });
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
        const pollData = response.data;
        setPoll(pollData);
        setTitle(pollData.title);
        setPollType(pollData.pollType);
        setOptions(pollData.options.map((opt) => opt.text));
        setSettings(pollData.settings);
      } catch (err) {
        console.error("Error fetching poll for editing:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch poll for editing");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchPoll();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await api.put(
        `/api/polls/${id}`,
        { title, pollType, options, settings },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate("/polls");
    } catch (err) {
      console.error("Error editing poll:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to edit poll");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  if (!poll) {
    return (
      <div className="page-shell py-16 text-center text-ink-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="page-shell max-w-2xl py-10">
      <div className="surface-card">
        <h2 className="page-title text-center text-2xl text-brand-600 sm:text-3xl">Edit Poll</h2>
        {error && (
          <p className="mt-4 rounded-xl bg-danger-50 px-3 py-2 text-center text-sm font-medium text-danger-600">
            {error}
          </p>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Title</label>
            <input
              className="form-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">Poll Type</label>
            <select className="form-input" value={pollType} onChange={(e) => setPollType(e.target.value)}>
              <option value="Single Choice">Single Choice</option>
              <option value="Multiple Choice">Multiple Choice</option>
            </select>
          </div>
          <div>
            <label className="form-label">Options</label>
            {options.map((option, index) => (
              <div key={index} className="mb-3 flex gap-3">
                <input
                  className="form-input"
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="shrink-0 self-center"
                  onClick={() => removeOption(index)}
                  disabled={options.length <= 2}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="dashed" size="sm" onClick={addOption}>
              Add Option
            </Button>
          </div>
          <div className="rounded-xl border border-brand-500/10 bg-brand-50/40 p-4">
            <span className="form-label mb-3 mt-0">Settings</span>
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                checked={settings.allowMultiple}
                onChange={(e) => setSettings({ ...settings, allowMultiple: e.target.checked })}
              />
              Allow Multiple Choices
            </label>
            <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                checked={settings.requireNames}
                onChange={(e) => setSettings({ ...settings, requireNames: e.target.checked })}
              />
              Require Voter Names
            </label>
          </div>
          <Button type="submit" variant="primary" className="mt-2 w-full min-h-12">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PollEdit;
