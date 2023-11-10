import axios from 'axios';

const baseURL = 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: baseURL
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const cookies = document.cookie;

//     config.headers['Cookie'] = cookies;

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;