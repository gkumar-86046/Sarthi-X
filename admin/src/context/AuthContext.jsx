/**
 * admin/src/context/AuthContext.jsx
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminUser, getAdminToken, adminLogin, adminLogout, setAdminSession } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session on initial load
    const token = getAdminToken();
    const storedUser = getAdminUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await adminLogin(email, password);
    if (data?.user) {
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    await adminLogout();
    setUser(null);
  };

  const updateProfileState = (updatedUser) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedUser };
      setAdminSession(getAdminToken(), null, merged);
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isFaculty: user?.role === 'faculty' || user?.role === 'admin',
        isLoading,
        login,
        logout,
        updateProfileState,
      }}
    >
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

