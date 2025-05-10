import axios from "axios";

const instance = axios.create({
<<<<<<< HEAD
  baseURL: "https://project-allocation-process-and-evaluation.onrender.com",
=======
  baseURL: process.env.BASE_URL,
>>>>>>> 044a381d7d4e050e89f483b31972c4bbda9150be
  withCredentials: true,
});

export default instance;
