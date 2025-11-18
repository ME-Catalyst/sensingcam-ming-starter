import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  setToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  removeToken() {
    this.clearAuth();
  }
}

export const apiClient = new APIClient();
export const api = apiClient.getClient();
