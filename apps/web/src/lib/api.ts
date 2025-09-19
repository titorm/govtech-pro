import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('govtech_refresh_token');
        
        if (refreshToken) {
          const response = await api.post('/auth/refresh', {
            refreshToken,
          });

          if (response.data.success) {
            const { token, refreshToken: newRefreshToken } = response.data.data;
            
            // Update tokens
            localStorage.setItem('govtech_token', token);
            localStorage.setItem('govtech_refresh_token', newRefreshToken);
            
            // Update authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            
            // Retry original request
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('govtech_token');
        localStorage.removeItem('govtech_user');
        localStorage.removeItem('govtech_refresh_token');
        delete api.defaults.headers.common['Authorization'];
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      toast.error('Erro de conexão. Verifique sua internet.');
      return Promise.reject(error);
    }

    // Handle server errors
    if (error.response.status >= 500) {
      toast.error('Erro interno do servidor. Tente novamente.');
      return Promise.reject(error);
    }

    // Handle rate limiting
    if (error.response.status === 429) {
      toast.error('Muitas tentativas. Aguarde alguns minutos.');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelpers = {
  // Auth
  login: (cpf: string, password: string) =>
    api.post('/auth/login', { cpf, password }),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  logout: () =>
    api.post('/auth/logout'),
  
  getMe: () =>
    api.get('/auth/me'),

  // Protocols
  getProtocols: (params?: any) =>
    api.get('/protocols', { params }),
  
  getProtocol: (id: string) =>
    api.get(`/protocols/${id}`),
  
  createProtocol: (data: any) =>
    api.post('/protocols', data),
  
  addProtocolResponse: (id: string, data: any) =>
    api.post(`/protocols/${id}/responses`, data),
  
  trackProtocol: (number: string) =>
    api.get(`/protocols/track/${number}`),

  // Services
  getServices: (params?: any) =>
    api.get('/services', { params }),
  
  getService: (id: string) =>
    api.get(`/services/${id}`),
  
  getCategories: () =>
    api.get('/services/categories'),
  
  getDepartments: () =>
    api.get('/services/departments'),

  // Documents
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getDocument: (id: string) =>
    api.get(`/documents/${id}`),
  
  downloadDocument: (id: string) =>
    api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    }),

  // User profile
  getProfile: () =>
    api.get('/users/profile'),
  
  updateProfile: (data: any) =>
    api.put('/users/profile', data),
};