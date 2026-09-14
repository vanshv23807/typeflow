import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  guestUsername: string;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, avatar?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { bio?: string; avatar?: string }) => Promise<void>;
  updateUserStatsLocally: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('typeflow_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  
  const [guestUsername] = useState<string>(() => {
    const saved = localStorage.getItem('typeflow_guest_name');
    if (saved) return saved;
    const gen = `Typer_${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('typeflow_guest_name', gen);
    return gen;
  });

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('typeflow_token');
      if (storedToken) {
        try {
          const res = await api.auth.getMe();
          setUser(res.user);
          setToken(storedToken);
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          localStorage.removeItem('typeflow_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api.auth.login({ identifier, password });
    localStorage.setItem('typeflow_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
  };

  const register = async (username: string, email: string, password: string, avatar?: string) => {
    const res = await api.auth.register({ username, email, password, avatar });
    localStorage.setItem('typeflow_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('typeflow_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: { bio?: string; avatar?: string }) => {
    const res = await api.auth.updateProfile(data);
    setUser(res.user);
  };

  const updateUserStatsLocally = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        guestUsername,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        login,
        register,
        logout,
        updateProfile,
        updateUserStatsLocally
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
