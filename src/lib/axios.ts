import axios from "axios";
import { API_BASE_URL } from "./constants";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ??
      err.response?.data?.error ??
      err.message ??
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;