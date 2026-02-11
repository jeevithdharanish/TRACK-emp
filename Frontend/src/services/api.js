import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Employees
export const employeeAPI = {
  getAll: (page = 0, size = 10) => api.get(`/employees?page=${page}&size=${size}`),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Performance Evaluations
export const evaluationAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.employeeId) query.append('employeeId', params.employeeId);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size) query.append('size', params.size);
    return api.get(`/performance-evaluations?${query.toString()}`);
  },
  getById: (id) => api.get(`/performance-evaluations/${id}`),
  create: (data) => api.post('/performance-evaluations', data),
  update: (id, data) => api.put(`/performance-evaluations/${id}`, data),
  delete: (id) => api.delete(`/performance-evaluations/${id}`),
};

// Reports
export const reportAPI = {
  topPerformers: (limit = 5, startDate, endDate) => {
    const query = new URLSearchParams({ limit });
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    return api.get(`/reports/performance/top?${query.toString()}`);
  },
  departmentPerformance: (startDate, endDate) => {
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    return api.get(`/reports/performance/departments?${query.toString()}`);
  },
  performanceTrends: (startDate, endDate) => {
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    return api.get(`/reports/performance/trends?${query.toString()}`);
  },
};

// Roles
export const roleAPI = {
  getAll: () => api.get('/roles'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
};

// Skill Level Stages
export const skillLevelStageAPI = {
  getAll: () => api.get('/skill-level-stage'),
  getById: (id) => api.get(`/skill-level-stage/${id}`),
  create: (data) => api.post('/skill-level-stage', data),
  update: (id, data) => api.put(`/skill-level-stage/${id}`, data),
  delete: (id) => api.delete(`/skill-level-stage/${id}`),
};

export default api;
