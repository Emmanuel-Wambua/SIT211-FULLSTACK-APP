import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wambux_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('wambux_token') || null);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('wambux_user', JSON.stringify(userData));
    localStorage.setItem('wambux_token', accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('wambux_user');
    localStorage.removeItem('wambux_token');
    localStorage.removeItem('wambux_refresh');
    localStorage.removeItem('wambux_cart');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user && !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
