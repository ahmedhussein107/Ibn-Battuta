import axios from "axios";

const URL = process.env.API_URL;

const axiosInstance = axios.create({
  baseURL: `${URL}api/`,
  timeout: 100000, // more than enought ,100 secs
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
