import api from './api';

export const productService = {
  getAll: async (params) => {
    const response = await api.get('/products', { params });
    return response.data.data;
  },
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data.data;
  },
};
