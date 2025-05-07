// File created by Shivom on 2023-10-05
// This file contains a custom Axios instance for making API requests.
// It sets up a base URL and includes an interceptor for adding authentication tokens.
// To use, import this file and call methods like API.get(), API.post(), etc.

// Import axios library for making HTTP requests
import axios from 'axios';

// Set the base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_BASE_API || 'http://localhost:4000/api/v1'; // Base URL from Vite env or fallback

// Log the API base URL for debugging
console.log('API Base URL:', API_BASE_URL);

// Create an Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Use localStorage instead of sessionStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
API.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`API Response [${response.config.method.toUpperCase()} ${response.config.url}]:`, response.status);
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API Error [${error.config?.method?.toUpperCase()} ${error.config?.url}]:`, error.response.status, error.response.data);

      // Handle specific HTTP errors
      switch (error.response.status) {
        case 401:
          // Unauthorized: Clear token and redirect to login
          console.error('Unauthorized access. Clearing token.');
          localStorage.removeItem('authToken');
          // Implement redirect to login page here
          break;
        case 403:
          // Forbidden: Handle access denied
          console.error('Access denied (Forbidden)');
          break;
        case 404:
          // Not Found
          console.error('Resource not found');
          break;
        case 500:
          // Server Error
          console.error('Server error');
          break;
        // Add more cases as needed
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
