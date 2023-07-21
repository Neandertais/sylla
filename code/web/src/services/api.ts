import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
});

export const fetch = (url: string) => api.get(url).then((res) => res);

api.interceptors.request.use((request) => {
  const token = localStorage.getItem("sylla.token");

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

api.interceptors.response.use(
  (response) => response.data?.data,
  (error) => {
    if ((error.response?.status === 401)) {
      localStorage.removeItem("sylla.token");
    }

    return Promise.reject(error);
  }
);
