import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data.data; // Return the inner data object containing admin and token
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};
