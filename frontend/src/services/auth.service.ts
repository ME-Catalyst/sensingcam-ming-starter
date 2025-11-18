import { api, apiClient } from './api';
import type { APIResponse, AuthResponse, LoginCredentials, RegisterData, User } from '../types';
import { STORAGE_KEYS } from '../constants';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<APIResponse<AuthResponse>>('/auth/login', credentials);
    const { user, token, refreshToken } = response.data.data!;

    // Store auth data
    apiClient.setToken(token);
    apiClient.setRefreshToken(refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return response.data.data!;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<APIResponse<AuthResponse>>('/auth/register', data);
    const { user, token, refreshToken } = response.data.data!;

    // Store auth data
    apiClient.setToken(token);
    apiClient.setRefreshToken(refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return response.data.data!;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<APIResponse<User>>('/auth/me');
    const user = response.data.data!;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const response = await api.post<APIResponse<{ token: string; refreshToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    const tokens = response.data.data!;

    apiClient.setToken(tokens.token);
    apiClient.setRefreshToken(tokens.refreshToken);

    return tokens;
  },

  logout() {
    apiClient.removeToken();
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  },
};
