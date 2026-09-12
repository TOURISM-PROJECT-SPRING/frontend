import axiosClient from '../api/axiosClient';

export const contactService = {
  getAllMessages: async () => {
    const response = await axiosClient.get('/contact');
    return response.data;
  },
  getMessageById: async (id) => {
    const response = await axiosClient.get(`/contact/${id}`);
    return response.data;
  },
  sendMessage: async ({ name, email, subject, message } = {}) => {
    const response = await axiosClient.post('/contact', { name, email, subject, message });
    return response.data;
  },
  markRead: async (id) => {
    const response = await axiosClient.put(`/contact/${id}/read`);
    return response.data;
  },
  deleteMessage: async (id) => {
    const response = await axiosClient.delete(`/contact/${id}`);
    return response.data;
  },
};