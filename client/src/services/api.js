import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/* ── Request Interceptor: Attach JWT ── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response Interceptor: Handle errors globally ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      /* Token expired or invalid */
      if (status === 401) {
        const currentPath = window.location.pathname;
        const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
        const isPublicPath = publicPaths.some((p) => currentPath.startsWith(p));

        if (!isPublicPath) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

/* ── Auth API ── */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  getMe: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh-token'),
};

/* ── User API ── */
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) => api.put('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateRole: (id, data) => api.put(`/users/${id}/role`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

/* ── Temple API ── */
export const templeAPI = {
  getAll: (params) => api.get('/temples', { params }),
  getById: (id) => api.get(`/temples/${id}`),
  create: (data) => api.post('/temples', data),
  update: (id, data) => api.put(`/temples/${id}`, data),
  delete: (id) => api.delete(`/temples/${id}`),
  uploadImages: (id, formData) => api.post(`/temples/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getSlots: (id, params) => api.get(`/temples/${id}/slots`, { params }),
  getPopular: () => api.get('/temples/popular'),
};

/* ── Slot API ── */
export const slotAPI = {
  create: (data) => api.post('/slots', data),
  update: (id, data) => api.put(`/slots/${id}`, data),
  delete: (id) => api.delete(`/slots/${id}`),
  getAvailability: (params) => api.get('/slots/availability', { params }),
};

/* ── Booking API ── */
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, data) => api.put(`/bookings/${id}/cancel`, data),
  getTicket: (id) => api.get(`/bookings/${id}/ticket`),
  downloadPDF: (id) => api.get(`/bookings/${id}/pdf`, { responseType: 'blob' }),
  verify: (bookingId) => api.get(`/bookings/verify/${bookingId}`),
  getByTemple: (templeId, params) => api.get(`/bookings/temple/${templeId}`, { params }),
};

/* ── Payment API ── */
export const paymentAPI = {
  process: (data) => api.post('/payments/process', data),
  getById: (id) => api.get(`/payments/${id}`),
  getHistory: (params) => api.get('/payments/history', { params }),
};

/* ── Donation API ── */
export const donationAPI = {
  create: (data) => api.post('/donations', data),
  getAll: (params) => api.get('/donations', { params }),
  getByTemple: (templeId, params) => api.get(`/donations/temple/${templeId}`, { params }),
  getAllAdmin: (params) => api.get('/donations/all', { params }),
};

/* ── Feedback API ── */
export const feedbackAPI = {
  create: (data) => api.post('/feedback', data),
  getByTemple: (templeId, params) => api.get(`/feedback/temple/${templeId}`, { params }),
  reply: (id, data) => api.put(`/feedback/${id}/reply`, data),
};

/* ── Rating API ── */
export const ratingAPI = {
  create: (data) => api.post('/ratings', data),
  getByTemple: (templeId, params) => api.get(`/ratings/temple/${templeId}`, { params }),
};

/* ── Notification API ── */
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

/* ── Event API ── */
export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

/* ── Wishlist API ── */
export const wishlistAPI = {
  toggle: (templeId) => api.post(`/wishlist/${templeId}`),
  getAll: () => api.get('/wishlist'),
};

/* ── Analytics API ── */
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getBookings: (params) => api.get('/analytics/bookings', { params }),
  getRevenue: (params) => api.get('/analytics/revenue', { params }),
  generateReport: (params) => api.get('/reports/generate', { params }),
};

export default api;
