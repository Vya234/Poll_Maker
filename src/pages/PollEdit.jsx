// src/pages/PollEdit.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import "./PollEdit.css";

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
        console.log("Fetching poll for editing with ID:", id);
        const response = await axios.get(`http://localhost:5000/api/polls/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Poll fetched for editing:", response.data);
        const pollData = response.data;
        setPoll(pollData);
        setTitle(pollData.title);
        setPollType(pollData.pollType);
        setOptions(pollData.options.map(opt => opt.text));
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
      console.log("Submitting edit for poll ID:", id, "with data:", { title, pollType, options, settings });
      await axios.put(
        `http://localhost:5000/api/polls/${id}`,
        { title, pollType, options, settings },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Poll edited successfully:", id);
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

  if (!poll) return <p>Loading...</p>;

  return (
    <div className="poll-edit-container">
      <h2>Edit Poll</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Poll Type:</label>
          <select value={pollType} onChange={(e) => setPollType(e.target.value)}>
            <option value="Single Choice">Single Choice</option>
            <option value="Multiple Choice">Multiple Choice</option>
          </select>
        </div>
        <div>
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index} className="option-row">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              <button type="button" onClick={() => removeOption(index)} disabled={options.length <= 2}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addOption}>Add Option</button>
        </div>
        <div>
          <label>Settings:</label>
          <label>
            <input
              type="checkbox"
              checked={settings.allowMultiple}
              onChange={(e) => setSettings({ ...settings, allowMultiple: e.target.checked })}
            />
            Allow Multiple Choices
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.requireNames}
              onChange={(e) => setSettings({ ...settings, requireNames: e.target.checked })}
            />
            Require Voter Names
          </label>
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default PollEdit;