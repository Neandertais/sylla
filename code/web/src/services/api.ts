import axios from "axios";

export const BASE_URL = "http://localhost:3333/api/v1";

export const fetch = axios.create({
  baseURL: BASE_URL,
});

export const api = (url: string) => fetch.get(url).then((res) => res.data);

fetch.interceptors.request.use((request) => {
  const token = localStorage.getItem("sylla.token");

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

fetch.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error.response?.status === 401)) {
      localStorage.removeItem("sylla.token");
    }

    return Promise.reject(error);
  }
);
