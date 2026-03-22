import api from './api';

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/categories', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data.data;
  },
};
