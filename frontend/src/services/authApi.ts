import { apiClient } from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const DEFAULT_MOCK_USER: User = {
  id: 'usr-aryan',
  name: 'Aryan Kumar',
  email: 'aryan@aqua-xfoul.com',
  role: 'Administrator',
  initials: 'AK',
};

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch {
      // Mock fallback for frontend standalone execution
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (!credentials.email || credentials.email.trim() === '') {
        throw new Error('Please enter a valid email address or username');
      }
      return {
        token: 'mock-jwt-token-aqua-xfoul-2026',
        user: {
          ...DEFAULT_MOCK_USER,
          email: credentials.email,
        },
      };
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch {
      const stored = localStorage.getItem('aqua_auth_user');
      if (stored) {
        return JSON.parse(stored);
      }
      return DEFAULT_MOCK_USER;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore mock logout failure
    } finally {
      localStorage.removeItem('aqua_auth_token');
      localStorage.removeItem('aqua_auth_user');
    }
  },
};
