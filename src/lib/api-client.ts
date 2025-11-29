import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
    "https://activehiveapi.onrender.com",
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = window.localStorage.getItem("activehive_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => handleApiErrorResponse(error)
);

const handleApiErrorResponse = (error: AxiosError) => {
  if (error.response?.status === 401) {
    window.localStorage.removeItem("activehive_token");
  }
  return Promise.reject(error);
};

export const apiClient = {
  get: <T>(url: string, config = {}): Promise<T> =>
    axiosInstance.get(url, config),
  post: <T>(url: string, data = {}, config = {}): Promise<T> =>
    axiosInstance.post(url, data, config),
  put: <T>(url: string, data = {}, config = {}): Promise<T> =>
    axiosInstance.put(url, data, config),
  patch: <T>(url: string, data = {}, config = {}): Promise<T> =>
    axiosInstance.patch(url, data, config),
  delete: <T>(url: string, config = {}): Promise<T> =>
    axiosInstance.delete(url, config),
};
