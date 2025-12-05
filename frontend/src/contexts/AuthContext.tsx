import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AdminUser } from '@/types';
import { adminApi, getAccessToken, clearTokens } from '@/services/api';

interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_STORAGE_KEY = 'admin_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = getAccessToken();
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        clearTokens();
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const { user: loggedInUser } = await adminApi.login(username, password);
    setUser(loggedInUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
  };

  const logout = () => {
    adminApi.logout();
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
