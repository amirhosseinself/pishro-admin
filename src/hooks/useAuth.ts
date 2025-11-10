// @/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import {
  getAuthToken,
  getAuthUser,
  setAuthToken,
  setAuthUser,
  removeAuthToken,
  removeAuthUser,
  logout as authLogout,
  isAuthenticated as checkAuth,
  isAdmin as checkAdmin,
  type AuthUser,
} from '@/lib/auth';

/**
 * Custom hook for authentication
 * Manages auth state and provides auth utilities
 */

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load auth state on mount
  useEffect(() => {
    const loadAuthState = () => {
      const currentToken = getAuthToken();
      const currentUser = getAuthUser();

      setToken(currentToken);
      setUser(currentUser);
      setLoading(false);
    };

    loadAuthState();
  }, []);

  /**
   * Login user with token and user data
   */
  const login = (authToken: string, userData: AuthUser) => {
    setAuthToken(authToken);
    setAuthUser(userData);
    setToken(authToken);
    setUser(userData);
  };

  /**
   * Logout user and clear auth state
   */
  const logout = () => {
    removeAuthToken();
    removeAuthUser();
    setToken(null);
    setUser(null);
    authLogout();
  };

  /**
   * Update user data
   */
  const updateUser = (updatedUser: Partial<AuthUser>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setAuthUser(newUser);
      setUser(newUser);
    }
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: checkAuth(),
    isAdmin: checkAdmin(),
    login,
    logout,
    updateUser,
  };
}
