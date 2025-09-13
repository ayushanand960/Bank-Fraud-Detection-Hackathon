import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,  // important for cookies
   headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
