import axios from "axios";

const instance = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
});

export default instance;
