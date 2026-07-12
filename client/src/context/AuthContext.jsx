import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Load user from localStorage on mount */
  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await authAPI.getMe();
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /* Register */
  const register = async (formData) => {
    setError(null);
    try {
      const res = await authAPI.register(formData);
      const { token, user: userData } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    }
  };

  /* Login */
  const login = async (formData) => {
    setError(null);
    try {
      const res = await authAPI.login(formData);
      const { token, user: userData } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      setUser(userData);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    }
  };

  /* Logout */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      /* Proceed with local logout even if API call fails */
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('fallbackBookings');
      setUser(null);
    }
  };

  /* Update user data locally */
  const updateUser = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  /* Check if user has specific role */
  const hasRole = (...roles) => {
    return user && roles.includes(user.role);
  };

  /* Check if user is authenticated */
  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
    hasRole,
    loadUser,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
