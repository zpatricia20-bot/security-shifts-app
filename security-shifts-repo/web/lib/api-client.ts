// lib/api-client.ts

import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

export const getOperators = async () => {
  const { data } = await apiClient.get('/operators');
  return data;
};

export const getShifts = async (filters: any = {}) => {
  const { data } = await apiClient.get('/shifts', { params: filters });
  return data;
};

export const getShiftDetails = async (id: string) => {
  const { data } = await apiClient.get(`/shifts/${id}`);
  return data;
};

export const updateShift = async (id: string, payload: any) => {
  const { data } = await apiClient.patch(`/shifts/${id}`, payload);
  return data;
};

export const recordAttendance = async (shiftId: string, payload: any) => {
  const { data } = await apiClient.post(`/shifts/${shiftId}/attendance`, payload);
  return data;
};

export const getShops = async () => {
  const { data } = await apiClient.get('/shops');
  return data;
};
