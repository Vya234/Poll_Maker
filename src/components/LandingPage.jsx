// LandingPage.jsx
import React, { useState } from "react";
import "./LandingPage.css";

const LandingPage = () => {
  const [options, setOptions] = useState(["", ""]);
  const [title, setTitle] = useState("");
  const [pollType, setPollType] = useState("Multiple Choice");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [requireNames, setRequireNames] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pollData = {
      title,
      pollType,
      options: options.filter(opt => opt.trim() !== ""),
      settings: { allowMultiple, requireNames }
    };
    console.log("Poll Created:", pollData);
    // Add your submit logic here (e.g., API call)
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const PreviewModal = () => (
    <div className="preview-modal">
      <div className="preview-content">
        <button className="preview-close" onClick={togglePreview}>×</button>
        <div className="preview-poll">
          <h3>{title || "Your Poll Title"}</h3>
          {options
            .filter(opt => opt.trim() !== "")
            .map((option, index) => (
              <div key={index} className="preview-option">
                <input
                  type={pollType === "Multiple Choice" && allowMultiple ? "checkbox" : "radio"}
                  name="poll-option"
                  disabled
                />
                <span>{option || `Option ${index + 1}`}</span>
              </div>
            ))}
          {requireNames && (
            <input
              type="text"
              placeholder="Your name"
              disabled
              style={{ margin: "10px 0" }}
            />
          )}
          <button className="preview-submit" disabled>Submit Vote</button>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "10px" }}>
            This is a preview - options are disabled
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">QuickPoll</h1>
        <div className="auth-buttons">
          <button className="login">Login</button>
          <button className="signup">Sign Up</button>
        </div>
      </header>

      <main className="poll-form">
        <h2>Create a Poll</h2>
        <p>Complete the below fields to create your poll.</p>

        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input 
            type="text" 
            placeholder="Type your question here" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />

          <div className="poll-type-container">
            <label style={{ display: "block" }}>Poll Type</label>
            <select 
              className="poll-type"
              value={pollType}
              onChange={(e) => setPollType(e.target.value)}
            >
              <option>Multiple Choice</option>
              <option>Single Choice</option>
            </select>
          </div>

          <div className="answer-options-container">
            <label style={{ display: "block" }}>Answer Options</label>
            {options.map((option, index) => (
              <div className="option-container" key={index}>
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                />
                {options.length > 2 && (
                  <button 
                    type="button"
                    className="remove-option"
                    onClick={() => removeOption(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-option" onClick={addOption}>
              + Add option
            </button>
          </div>

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

          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              type="button" 
              className="create-poll" 
              onClick={togglePreview}
              style={{ backgroundColor: "#2a9d8f", flex: 1 }}
            >
              Preview Poll
            </button>
            <button type="submit" className="create-poll" style={{ flex: 1 }}>
              Create Poll
            </button>
          </div>
        </form>
      </main>

      {showPreview && <PreviewModal />}
    </div>
  );
};

export default LandingPage;