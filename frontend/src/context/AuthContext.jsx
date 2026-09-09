import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync profile if token exists on mount
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.users.getProfile();
        if (isMounted && data.profile) {
          setUser((prev) => ({
            ...prev,
            ...data.profile,
          }));
          localStorage.setItem('user', JSON.stringify({ ...user, ...data.profile }));
        }
      } catch (err) {
        // If token is invalid or expired, clear session
        if (err.status === 401 || err.status === 400) {
          logout();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = useCallback(async (email, password) => {
    const data = await api.auth.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  }, []);

  const signup = useCallback(async (userData) => {
    const data = await api.auth.signup(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const data = await api.users.updateProfile(profileData);
    if (data.profile) {
      setUser((prev) => {
        const updated = { ...prev, ...data.profile };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
    }
    return data.profile;
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    updateProfile,
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

