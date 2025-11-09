import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// This is a simple client-side password. In a real-world application,
// this would be handled by a secure backend authentication system.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'password123';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check session storage to see if user was already logged in
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };
  
  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated]);

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
