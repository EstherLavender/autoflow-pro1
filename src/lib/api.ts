import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  login: (data: Record<string, unknown>) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Services APIs
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id: string) => api.get(`/services/${id}`),
  create: (data: Record<string, unknown>) => api.post('/services', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

// Bookings APIs
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  create: (data: Record<string, unknown>) => api.post('/bookings', data),
  updateStatus: (id: string, status: string) => api.patch(`/bookings/${id}/status`, { status }),
  assignDetailer: (id: string, detailer_id: string) => api.patch(`/bookings/${id}/assign`, { detailer_id }),
  cancel: (id: string) => api.delete(`/bookings/${id}`),
};

// Vehicles APIs
export const vehiclesAPI = {
  getAll: () => api.get('/vehicles'),
  create: (data: Record<string, unknown>) => api.post('/vehicles', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/vehicles/${id}`, data),
  delete: (id: string) => api.delete(`/vehicles/${id}`),
};

// Users APIs
export const usersAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/users', { params }),
  getPending: () => api.get('/users/pending'),
  approve: (id: string) => api.patch(`/users/${id}/approve`),
  reject: (id: string) => api.delete(`/users/${id}/reject`),
  suspend: (id: string) => api.patch(`/users/${id}/suspend`),
  activate: (id: string) => api.patch(`/users/${id}/activate`),
  getStats: () => api.get('/users/stats'),
};

// Upload APIs
export const uploadAPI = {
  profilePicture: (file: File) => {
    const formData = new FormData();
    formData.append('profile', file);
    return api.post('/uploads/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  vehiclePhoto: (vehicleId: string, file: File) => {
    const formData = new FormData();
    formData.append('vehicle', file);
    return api.post(`/uploads/vehicle/${vehicleId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Notifications APIs
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
};

// Payments APIs
export const paymentsAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/payments', { params }),
  getById: (id: string) => api.get(`/payments/${id}`),
  initiateSTKPush: (data: { phone: string; amount: number; booking_id?: string }) => 
    api.post('/payments/mpesa/stkpush', data),
  checkStatus: (checkoutRequestId: string) => api.get(`/payments/status/${checkoutRequestId}`),
};

export default api;
