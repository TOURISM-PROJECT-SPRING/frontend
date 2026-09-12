import axiosClient from '../api/axiosClient';

export const newsletterService = {
  getAllSubscribers: async () => {
    const response = await axiosClient.get('/newsletter');
    return response.data;
  },
  subscribe: async (email) => {
    const response = await axiosClient.post('/newsletter/subscribe', { email });
    return response.data;
  },
};