import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (config.method === 'get') {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error?.response?.data?.message;
    const errorMessage = serverMessage || error?.message || 'Request failed. Please try again.';

    if (!error?.config?.skipErrorToast) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
