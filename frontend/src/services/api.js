import axios from 'axios';

const API = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
    socialLogin: (data) => API.post('/auth/social', data),
    getMe: () => API.get('/auth/me'),
    logout: () => API.post('/auth/logout'),
    updateProfile: (data) => API.put('/auth/updateprofile', data),
    updatePassword: (data) => API.put('/auth/updatepassword', data),
};

// Material APIs
export const materialAPI = {
    getAll: (params) => API.get('/materials', { params }),
    getOne: (id) => API.get(`/materials/${id}`),
    create: (data) => API.post('/materials', data),
    update: (id, data) => API.put(`/materials/${id}`, data),
    delete: (id) => API.delete(`/materials/${id}`),
    approve: (id, data) => API.put(`/materials/${id}/approve`, data),
    trackDownload: (id) => API.put(`/materials/${id}/download`),
    toggleLike: (id) => API.put(`/materials/${id}/like`),
    toggleBookmark: (id) => API.put(`/materials/${id}/bookmark`),
    addComment: (id, data) => API.post(`/materials/${id}/comments`, data),
    deleteComment: (id, commentId) =>
        API.delete(`/materials/${id}/comments/${commentId}`),
    getStats: () => API.get('/materials/stats'),
};

// User APIs (Admin)
export const userAPI = {
    getAll: (params) => API.get('/users', { params }),
    getOne: (id) => API.get(`/users/${id}`),
    updateRole: (id, data) => API.put(`/users/${id}/role`, data),
    delete: (id) => API.delete(`/users/${id}`),
};

export default API;
