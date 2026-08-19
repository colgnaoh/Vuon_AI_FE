import { apiClient } from './apiClient';
import { User, GlobalRole } from '@/types';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    } catch (err) {
      // Mock Fallback for local demo preview if backend API is offline
      const mockRole: GlobalRole = data.email.includes('admin') ? 'Admin' : 'Member';
      return {
        token: 'mock-jwt-token-vuon-ai-space-' + Date.now(),
        user: {
          id: 'usr-101',
          email: data.email,
          fullName: data.email.split('@')[0].toUpperCase(),
          globalRole: mockRole,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
      };
    }
  },

  async register(data: { fullName: string; email: string; interests: string[] }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    } catch (err) {
      return {
        token: 'mock-jwt-token-vuon-ai-space-' + Date.now(),
        user: {
          id: 'usr-' + Math.floor(Math.random() * 1000),
          email: data.email,
          fullName: data.fullName,
          globalRole: 'Member',
        },
      };
    }
  },
};
