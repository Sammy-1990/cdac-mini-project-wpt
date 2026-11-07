import axios from "axios";

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach JWT bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // When sending FormData, delete Content-Type so Axios/browser sets multipart/form-data with proper boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized on a protected route
      const currentPath = window.location.pathname;
      const isPublicRoute =
        currentPath === "/" ||
        currentPath === "/home" ||
        currentPath === "/events" ||
        currentPath.startsWith("/events/") ||
        currentPath === "/login" ||
        currentPath === "/register" ||
        currentPath.startsWith("/invitation/");

      if (!isPublicRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
