# QuickPoll - Full Stack Polling Application

QuickPoll is a full-stack web application that allows users to create, vote on, and view results for customized polls. It supports both public and private polls with multiple configuration options, including single or multiple choice questions and optional voter name collection.

## Features

- User signup and login with JWT authentication
- Create and manage custom polls
  - Single or multiple choice options
  - Require voter names or allow anonymous voting
  - Choose between public or private visibility
- Vote on polls
- View real-time poll results with vote counts
- Edit or delete your own polls
- Browse and vote on public polls

## Technologies Used

### Frontend
- React.js
- React Router DOM
- Axios
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB (using Mongoose)
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Folder Structure

poll-maker/
├── backend/
│ ├── models/ # Mongoose Schemas
│ ├── routes/ # Express API routes
│ ├── server.js # Express server entry point
│ ├── package.json
│ └── .env # Environment variables
├── public/
│ └── images/
├── src/
│ ├── components/ # Reusable UI components (Navbar, Button, PollForm, etc.)
│ ├── pages/ # Page components (Login, Signup, PollList, PollVote, etc.)
│ ├── App.jsx # App routing and layout
│ └── App.css
├── package.json
└── README.md

