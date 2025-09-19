import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@govtech-pro/types';
import { api } from './api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (cpf: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  cpf: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('govtech_token');
    const storedUser = localStorage.getItem('govtech_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('govtech_token');
        localStorage.removeItem('govtech_user');
      }
    }

    setIsLoading(false);
  }, []);

  // Verify token on app start
  useEffect(() => {
    if (token && !user) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data.user);
        localStorage.setItem('govtech_user', JSON.stringify(response.data.data.user));
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  const login = async (cpf: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { cpf, password });

      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        
        setUser(userData);
        setToken(userToken);
        
        // Store in localStorage
        localStorage.setItem('govtech_token', userToken);
        localStorage.setItem('govtech_user', JSON.stringify(userData));
        
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        
        toast.success(`Bem-vindo(a), ${userData.name}!`);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao fazer login';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', data);

      if (response.data.success) {
        toast.success('Conta criada com sucesso! Faça login para continuar.');
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao criar conta';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Call logout endpoint (fire and forget)
    if (token) {
      api.post('/auth/logout').catch(() => {
        // Ignore errors on logout
      });
    }

    // Clear state
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('govtech_token');
    localStorage.removeItem('govtech_user');
    localStorage.removeItem('govtech_refresh_token');
    
    // Clear authorization header
    delete api.defaults.headers.common['Authorization'];
    
    toast.success('Logout realizado com sucesso');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}