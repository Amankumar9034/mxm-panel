import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('mxm_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('mxm_access_token') || null);

  const login = (accessToken, userData) => {
    localStorage.setItem('mxm_access_token', accessToken);
    localStorage.setItem('mxm_user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('mxm_access_token');
    localStorage.removeItem('mxm_user');
    setToken(null);
    setUser(null);
  };

  /* ── Listen for 401 logout events fired by the axios interceptor ── */
  useEffect(() => {
    const handleForceLogout = () => {
      setToken(null);
      setUser(null);
      window.location.href = '/';
    };
    window.addEventListener('mxm:logout', handleForceLogout);
    return () => window.removeEventListener('mxm:logout', handleForceLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
