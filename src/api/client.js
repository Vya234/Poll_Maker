import axios from "axios";

/**
 * Single Axios instance for the API so base URL and defaults stay consistent across the app.
 * Set REACT_APP_API_URL in production (e.g. https://api.example.com).
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

export default api;
