import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config.__retryCount >= 2) {
      return Promise.reject(error);
    }
    config.__retryCount = (config.__retryCount || 0) + 1;
    const delay = config.__retryCount * 500;
    await new Promise((r) => setTimeout(r, delay));
    return apiClient(config);
  },
);

export function getErrorMessage(error) {
  return (
    error.response?.data?.error ||
    error.message ||
    'Something went wrong. Please try again.'
  );
}
