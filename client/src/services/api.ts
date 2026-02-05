import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "http://34.224.99.183:3000",
});

export default api;

