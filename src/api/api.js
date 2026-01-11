import axios from "axios";

const API = axios.create({
  baseURL: "https://trackify-backend-j8hd.onrender.com/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
export const getDashboardData = () =>
  API.get("/routine/dashboard");