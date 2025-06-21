// src/components/PollForm.jsx
import React, { useState } from "react";
import axios from "axios";
import Button from "./Button";
import "./PollForm.css";

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
      const response = await axios.post(
        "http://localhost:5000/api/polls",
        {
          title,
          pollType,
          options: options.filter((opt) => opt.trim() !== ""),
          settings: { allowMultiple, requireNames },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
    <div className="poll-form-container">
      <div className="poll-form">
        <h2>Create a Poll</h2>
        <p>Complete the fields below to create your poll.</p>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter your question"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Poll Type</label>
          <select value={pollType} onChange={(e) => setPollType(e.target.value)}>
            <option>Multiple Choice</option>
            <option>Single Choice</option>
          </select>

          <label>Options</label>
          {options.map((option, index) => (
            <div key={index} className="option-container">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                required
              />
              {options.length > 2 && (
                <Button type="button" className="remove-option" onClick={() => removeOption(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" className="add-option" onClick={addOption}>
            + Add Option
          </Button>

          <div className="settings">
            <h3>Settings</h3>
            <label>
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
              />
              Allow multiple selections
            </label>
            <label>
              <input
                type="checkbox"
                checked={requireNames}
                onChange={(e) => setRequireNames(e.target.checked)}
              />
              Require participant names
            </label>
          </div>

          <Button type="submit" className="create-poll">
            Create Poll
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PollForm;