import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Django backend URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration: Refresh and retry failed requests
api.interceptors.response.use(
  (response) => response, // Return response if success
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });
          localStorage.setItem("access_token", res.data.access);
          api.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`;
          return api(originalRequest); // Retry the failed request
        }
      } catch (refreshError) {
        console.error("Session expired. Please log in again.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/"; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export const getCsrfToken = () => {
  const cookies = document.cookie.split("; ");
  const csrfCookie = cookies.find((row) => row.startsWith("csrftoken="));
  return csrfCookie ? csrfCookie.split("=")[1] : null;
};


export default api;
