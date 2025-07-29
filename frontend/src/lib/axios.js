// // src/lib/axios.js
// import axios from "axios";

// const isDevTunnel = location.origin.includes(".devtunnels.ms");

// const BASE_URL = isDevTunnel
//   ? "https://qs93k5gj-5000.inc1.devtunnels.ms/api"
//   : import.meta.env.MODE === "development"
//   ? "http://localhost:5000/api"
//   : "https://your-production-backend.com/api";

// export const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// /* ➕ add the interceptor */
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });



import axios from "axios";

const isDevTunnel = location.origin.includes(".devtunnels.ms");

const BASE_URL = isDevTunnel
  ? "https://qs93k5gj-5000.inc1.devtunnels.ms/api"
  : import.meta.env.MODE === "development"
  ? "http://localhost:5000/api"
  : "https://your-production-backend.com/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Request to ${config.url}:`, { headers: config.headers, method: config.method });
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`Response error for ${error.config.url}:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);