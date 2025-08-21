import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://community-form-backend.onrender.com",
});

export default instance;
