import axios from "axios"

// export const BASE_URL = "https://netrorkbackend.onrender.com"
// config/index.js
export const BASE_URL = "http://localhost:9090/uploads"


export const clientServer = axios.create({
  baseURL: "http://localhost:9090", // tera URL
});
clientServer.interceptors.request.use((config) => {
  // ✅ sirf browser pe run karo
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
