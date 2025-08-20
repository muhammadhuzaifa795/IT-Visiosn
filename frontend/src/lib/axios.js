// src/lib/axios.js
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
  });

  /* ➕ add the interceptor */
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });


  




// import axios from "axios"

// const BASE_URL =
//   import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "https://your-production-backend.com/api"

// // Create axios instance with base configuration
// export const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// })

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Only redirect if not already on login page to prevent infinite loops
//       if (!window.location.pathname.includes("/login")) {
//         localStorage.removeItem("token")
//         window.location.href = "/login"
//       }
//     }
//     return Promise.reject(error)
//   },
// )
