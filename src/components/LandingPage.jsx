import React from "react";
import "./LandingPage.css"; // Ensure you have a CSS file for styling

const LandingPage = () => {
  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">QuickPoll </h1>
        <div className="auth-buttons">
          <button className="login">Login</button>
          <button className="signup">Sign Up</button>
        </div>
      </header>

      <main className="poll-form">
        <h2>Create a Poll</h2>
        <p>Complete the below fields to create your poll.</p>

        <label>Title</label>
        <input type="text" placeholder="Type your question here" />

        <label>Poll Type</label>
        <select>
          <option>Multiple Choice</option>
          <option>Single Choice</option>
        </select>

        <label>Answer Options</label>
        <input type="text" placeholder="Option 1" />
        <input type="text" placeholder="Option 2" />
        <button className="add-option">+ Add option</button>

        <h3>Settings</h3>
        <label>
          <input type="checkbox" /> Allow multiple selections
        </label>
        <label>
          <input type="checkbox" /> Require participant names
        </label>

        <button className="create-poll">Create Poll</button>
      </main>
    </div>
  );
};

export default LandingPage;
