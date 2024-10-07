import axios from "axios";

const URI = import.meta.env.VITE_API_URI;
console.log("VITE_API_URI:", URI);

const axiosInstance = axios.create({
	baseURL: `${URI}api/`,
	timeout: 100000, // more than enought ,100 secs
	headers: {
		"Content-Type": "application/json",
	},
});

console.log(URI);

export default axiosInstance;
