import axios from 'axios';

// Axios instance for API requests
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Use the environment variable
  withCredentials: true, // Allow sending cookies with each request
});

export default api;
