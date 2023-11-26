import axios from 'axios';
import globalState from './globalData';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${globalState.jwtToken}`;
  config.baseURL = globalState.apiHost;

  return config;
});

export default axiosInstance;