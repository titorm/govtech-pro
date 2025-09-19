import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@govtech-pro/types';
import { api } from './api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (cpf: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('govtech_admin_token');
    const storedUser = localStorage.getItem('govtech_admin_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('govtech_admin_token');
        localStorage.removeItem('govtech_admin_user');
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
        const userData = response.data.data.user;
        
        // Check if user has admin privileges
        if (!['admin', 'manager', 'operator'].includes(userData.role)) {
          throw new Error('Acesso negado');
        }
        
        setUser(userData);
        localStorage.setItem('govtech_admin_user', JSON.stringify(userData));
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
        
        // Check if user has admin privileges
        if (!['admin', 'manager', 'operator'].includes(userData.role)) {
          throw new Error('Acesso negado. Você não tem permissão para acessar o painel administrativo.');
        }
        
        setUser(userData);
        setToken(userToken);
        
        // Store in localStorage with admin prefix
        localStorage.setItem('govtech_admin_token', userToken);
        localStorage.setItem('govtech_admin_user', JSON.stringify(userData));
        
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        
        const roleLabelMap = {
          admin: 'Administrador',
          manager: 'Gestor',
          operator: 'Operador',
        } as const;
        const roleLabel = roleLabelMap[userData.role as keyof typeof roleLabelMap] || userData.role;
        
        toast.success(`Bem-vindo(a), ${userData.name}! (${roleLabel})`);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Erro ao fazer login';
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
    localStorage.removeItem('govtech_admin_token');
    localStorage.removeItem('govtech_admin_user');
    localStorage.removeItem('govtech_admin_refresh_token');
    
    // Clear authorization header
    delete api.defaults.headers.common['Authorization'];
    
    toast.success('Logout realizado com sucesso');
  };

  const value = {
    user,
    token,
    login,
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