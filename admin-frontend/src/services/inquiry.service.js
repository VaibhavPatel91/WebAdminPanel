import api from './api';

export const inquiryService = {
  getAll: async (params) => {
    const response = await api.get('/inquiries', { params });
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/inquiries/${id}`);
    return response.data.data;
  },
};
