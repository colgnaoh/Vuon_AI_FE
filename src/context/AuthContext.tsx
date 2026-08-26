import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User, GlobalRole } from '@/types';
import { apiClient } from '@/services/apiClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  name?: string;
  exp?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('vuon_token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('vuon_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (token && !token.startsWith('mock-jwt-token')) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          // Token expired
          logout();
        } else {
          // Auto-sync real profile role from Backend
          apiClient.get('/profiles/me').then(res => {
            if (res.data) {
              const p = res.data;
              const updatedUser: User = {
                id: p.id,
                email: p.email,
                fullName: p.fullName || user?.fullName || 'User',
                globalRole: p.globalRole || 'Member',
                avatarUrl: p.avatarUrl || user?.avatarUrl,
              };
              setUser(updatedUser);
              localStorage.setItem('vuon_user', JSON.stringify(updatedUser));
            }
          }).catch(() => {
            // Ignore error if BE is unreachable or preflight CORS failed
          });
        }
      } catch (e) {
        console.warn('Invalid token format');
      }
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('vuon_token', newToken);
    localStorage.setItem('vuon_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vuon_token');
    localStorage.removeItem('vuon_user');
  };

  const isAuthenticated = !!token && !!user;
  const role = user?.globalRole ? user.globalRole.toLowerCase() : '';
  const isAdmin = role === 'admin' || role === 'labmanager' || role === 'lab_manager';

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
