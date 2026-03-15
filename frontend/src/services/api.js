import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Elections API
export const electionsAPI = {
  getAll: () => api.get('/elections'),
  getById: (id) => api.get(`/elections/${id}`),
  create: (data) => api.post('/elections', data),
  addCandidate: (id, data) => api.post(`/elections/${id}/candidates`, data),
  registerVoter: (id, data) => api.post(`/elections/${id}/register`, data),
  registerVoters: (id, data) => api.post(`/elections/${id}/register-multiple`, data),
  vote: (id, data) => api.post(`/elections/${id}/vote`, data),
  getResults: (id) => api.get(`/elections/${id}/results`),
  endElection: (id) => api.put(`/elections/${id}/end`)
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserVotes: (id) => api.get(`/users/${id}/votes`),
  verifyVoter: (wallet) => api.get(`/users/verify/${wallet}`)
};

export default api;
