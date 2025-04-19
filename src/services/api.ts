import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token or other custom headers here if needed
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (e.g., logging, showing notifications)
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

// Reusable API call functions
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.get(url, config);
  return response.data;
};

export const post = async <T>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.post(url, data, config);
  return response.data;
};

export const put = async <T>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.put(url, data, config);
  return response.data;
};

export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.delete(url, config);
  return response.data;
};
