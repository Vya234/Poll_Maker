// src/components/PollForm.jsx
import React, { useState } from "react";
import api from "../api/client";
import Button from "./Button";

const PollForm = () => {
  const [options, setOptions] = useState(["", ""]);
  const [title, setTitle] = useState("");
  const [pollType, setPollType] = useState("Multiple Choice");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [requireNames, setRequireNames] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index) => options.length > 2 && setOptions(options.filter((_, i) => i !== index));
  const updateOption = (index, value) => setOptions(options.map((opt, i) => (i === index ? value : opt)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create a poll.");
      return;
    }

    try {
      await api.post(
        "/api/polls",
        {
          title,
          pollType,
          options: options.filter((opt) => opt.trim() !== ""),
          settings: { allowMultiple, requireNames },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess("Poll created successfully!");
      setTitle("");
      setOptions(["", ""]);
      setPollType("Multiple Choice");
      setAllowMultiple(false);
      setRequireNames(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create poll");
    }
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <div className="surface-card w-full max-w-2xl animate-fadeIn text-center">
        <h2 className="page-title text-2xl text-brand-600 sm:text-3xl">Create a Poll</h2>
        <p className="mt-2 text-ink-muted">Complete the fields below to create your poll.</p>
        {error && (
          <p className="mt-4 rounded-xl bg-danger-50 px-3 py-2 text-sm font-medium text-danger-600">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 rounded-xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">
            {success}
          </p>
        )}

        <form className="mt-6 text-left" onSubmit={handleSubmit}>
          <label className="form-label">Title</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your question"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="form-label mt-4">Poll Type</label>
          <select
            className="form-input"
            value={pollType}
            onChange={(e) => setPollType(e.target.value)}
          >
            <option>Multiple Choice</option>
            <option>Single Choice</option>
          </select>

          <label className="form-label mt-4">Options</label>
          {options.map((option, index) => (
            <div key={index} className="mb-3 flex items-center gap-3">
              <input
                className="form-input"
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                required
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="shrink-0"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="dashed" size="sm" className="my-2 w-full sm:w-auto" onClick={addOption}>
            + Add Option
          </Button>

          <div className="mt-6 rounded-xl border border-brand-500/10 bg-brand-50/50 p-4 text-left">
            <h3 className="text-sm font-bold text-brand-700">Settings</h3>
            <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
              />
              Allow multiple selections
            </label>
            <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                checked={requireNames}
                onChange={(e) => setRequireNames(e.target.checked)}
              />
              Require participant names
            </label>
          </div>

          <Button type="submit" variant="primary" className="mt-6 w-full min-h-12 text-base">
            Create Poll
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PollForm;
