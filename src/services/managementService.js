import axiosClient from '../api/axiosClient';

export const managementService = {
  getUsers: async () => {
    const response = await axiosClient.get('/management/users');
    return response.data;
  },
  getUserById: async (id) => {
    const response = await axiosClient.get(`/management/users/${id}`);
    return response.data;
  },
  getOwners: async () => {
    const response = await axiosClient.get('/management/owners');
    return response.data;
  },
  getRoles: async () => {
    const response = await axiosClient.get('/management/roles');
    return response.data;
  },
  getReviews: async () => {
    const response = await axiosClient.get('/management/reviews');
    return response.data;
  },
  getPromotions: async () => {
    const response = await axiosClient.get('/management/promotions');
    return response.data;
  },
  getNotifications: async () => {
    const response = await axiosClient.get('/management/notifications');
    return response.data;
  },
  getPayments: async () => {
    const response = await axiosClient.get('/management/payments');
    return response.data;
  },
  getTourPackages: async () => {
    const response = await axiosClient.get('/management/tour-packages');
    return response.data;
  },
  getTourGuides: async () => {
    const response = await axiosClient.get('/management/tour-guides');
    return response.data;
  },
};