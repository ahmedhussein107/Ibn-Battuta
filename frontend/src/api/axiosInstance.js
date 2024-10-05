import axios from "axios";

const URL = import.meta.env.VITE_API_URL;
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  baseURL: `${URL}api/`,
  timeout: 100000, // more than enought ,100 secs
  headers: {
    "Content-Type": "application/json",
  },
});

console.log(URL);

export default axiosInstance;
