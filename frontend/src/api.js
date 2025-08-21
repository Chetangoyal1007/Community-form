// api.js

import axios from "axios";

const instance = axios.create({
  baseURL: "https://community-form-backend.onrender.com", // Replace with your backend server URL
});

export default instance;
