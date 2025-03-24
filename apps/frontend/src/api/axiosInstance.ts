import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshAxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((req) => {
    if (error) {
      req.reject(error);
    } else {
      req.resolve();
    }
  });
  failedQueue = [];
};

const handleRefreshToken = async (originalRequest: InternalAxiosRequestConfig) => {
  try {
    await refreshAxiosInstance.post('/auth/refresh', {}, { 
      withCredentials: true,
      headers: { 'X-Skip-Interceptor': 'true' }
    });

    isRefreshing = false;
    processQueue(null);
    return axiosInstance(originalRequest);
  } catch (refreshError) {
    isRefreshing = false;
    processQueue(refreshError);
    
    if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
      window.location.href = '/login';
    }
    
    return Promise.reject(new Error(
      axios.isAxiosError(refreshError) ? refreshError.message : 'Unknown error'
    ));
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message));
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (originalRequest?.url?.includes('/auth/refresh')) {
      return Promise.reject(new Error(error.message));
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;
      return handleRefreshToken(originalRequest);
    }

    return Promise.reject(new Error(error.message));
  }
);

export default axiosInstance;
