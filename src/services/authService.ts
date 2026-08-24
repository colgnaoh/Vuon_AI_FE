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

export const DEMO_PRESETS = [
  {
    roleLabel: 'Admin System',
    email: 'admin@vuonai.space',
    user: {
      id: 'usr-admin',
      email: 'admin@vuonai.space',
      fullName: 'Quản trị viên Hệ thống',
      globalRole: 'Admin' as GlobalRole,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    }
  },
  {
    roleLabel: 'Lab Manager',
    email: 'labmanager@vuonai.space',
    user: {
      id: 'usr-labmgr',
      email: 'labmanager@vuonai.space',
      fullName: 'Quản lý Lab Vườn AI',
      globalRole: 'LabManager' as GlobalRole,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    }
  },
  {
    roleLabel: 'Mentor Chuyên Gia',
    email: 'hoang.nguyen@vuonai.space',
    user: {
      id: 'men-01',
      email: 'hoang.nguyen@vuonai.space',
      fullName: 'TS. Nguyễn Văn Hoàng',
      globalRole: 'Member' as GlobalRole,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    }
  },
  {
    roleLabel: 'Sinh Viên / Student',
    email: 'alex.nguyen@vuonai.space',
    user: {
      id: 'usr-101',
      email: 'alex.nguyen@vuonai.space',
      fullName: 'Alex Nguyễn (Student)',
      globalRole: 'Member' as GlobalRole,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    }
  }
];

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    } catch (err) {
      // Mock Fallback matching presets or custom email
      const matchedPreset = DEMO_PRESETS.find((p) => p.email.toLowerCase() === data.email.toLowerCase());
      if (matchedPreset) {
        return {
          token: 'mock-jwt-token-vuon-ai-space-' + Date.now(),
          user: matchedPreset.user,
        };
      }

      const mockRole: GlobalRole = data.email.toLowerCase().includes('admin')
        ? 'Admin'
        : data.email.toLowerCase().includes('lab')
        ? 'LabManager'
        : 'Member';

      return {
        token: 'mock-jwt-token-vuon-ai-space-' + Date.now(),
        user: {
          id: 'usr-' + Date.now(),
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
