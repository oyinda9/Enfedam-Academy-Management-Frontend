import axios from "axios";

// Define the API base URL (change this for production)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL, // Set API base URL
  headers: { "Content-Type": "application/json" }, // Set default headers
});

// Automatically attach the auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") { // Ensure it's running in the browser
    const token = localStorage.getItem("token"); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to headers
    }
  }
  return config;
});

export default api; // Export the Axios instance
