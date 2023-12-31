import axios from 'axios';
import { API_URL } from '../keys';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.baseURL = API_URL;

  return config;
});

export default axiosInstance;