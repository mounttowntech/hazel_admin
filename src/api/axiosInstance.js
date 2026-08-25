import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5004/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("hazelToken"); // ← match the key Login.jsx actually uses

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("[API SUCCESS]", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error(
      "[API ERROR]",
      error.config?.url,
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;