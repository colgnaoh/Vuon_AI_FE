import { apiClient } from './apiClient';
import { User, GlobalRole } from '@/types';
import { supabase } from '@/lib/supabaseClient';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Keep presets for UI structure, but they shouldn't bypass auth anymore
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
    if (!data.password) {
      throw new Error("Password is required for real authentication.");
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.session) {
      console.error('[AuthService] Login failed:', error?.message);
      throw new Error(error?.message || 'Login failed');
    }

    const token = authData.session.access_token;
    
    // After getting token, we need to fetch profile from BE using this token
    // We temporarily set it in local storage so apiClient can pick it up
    localStorage.setItem('vuon_token', token);

    try {
      const profileRes = await apiClient.get('/profiles/me');
      const profile = profileRes.data; // Use the response interceptor which unwraps {success: true, data: profile}
      
      return {
        token,
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.fullName || data.email.split('@')[0],
          globalRole: profile.globalRole || 'Member',
          avatarUrl: profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
      };
    } catch (e) {
      console.warn("Could not fetch profile, it might not exist yet. Returning minimal user data from Supabase.");
      return {
        token,
        user: {
          id: authData.user.id,
          email: authData.user.email || data.email,
          fullName: authData.user.email?.split('@')[0].toUpperCase() || 'User',
          globalRole: 'Member',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
      };
    }
  },

  async register(data: { fullName: string; email: string; password?: string; interests: string[] }): Promise<AuthResponse> {
    if (!data.password) {
      throw new Error("Password is required to register.");
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.session) {
      console.error('[AuthService] Register failed:', error?.message);
      throw new Error(error?.message || 'Register failed (or email confirmation required)');
    }

    const token = authData.session.access_token;
    localStorage.setItem('vuon_token', token);

    // Sync profile to BE
    try {
      const profileRes = await apiClient.put('/profiles/me', {
        fullName: data.fullName,
        bio: '',
        skills: data.interests,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        lookingFor: '',
      });
      
      const profile = profileRes.data;
      return {
        token,
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.fullName,
          globalRole: profile.globalRole || 'Member',
          avatarUrl: profile.avatarUrl,
        },
      };
    } catch (e) {
      console.error("Failed to sync profile to BE after registration", e);
      return {
        token,
        user: {
          id: authData.user.id,
          email: authData.user.email || data.email,
          fullName: data.fullName,
          globalRole: 'Member',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
      };
    }
  },
};
