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
  updateUser: async (id, data) => {
    const response = await axiosClient.put(`/management/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await axiosClient.delete(`/management/users/${id}`);
    return response.data;
  },
  getOwners: async () => {
    const response = await axiosClient.get('/management/owners');
    return response.data;
  },
  createOwner: async (data) => {
    const response = await axiosClient.post('/management/owners', data);
    return response.data;
  },
  updateOwner: async (id, data) => {
    const response = await axiosClient.put(`/management/owners/${id}`, data);
    return response.data;
  },
  deleteOwner: async (id) => {
    const response = await axiosClient.delete(`/management/owners/${id}`);
    return response.data;
  },
  verifyOwner: async (id, status) => {
    const response = await axiosClient.patch(`/management/owners/${id}/verify`, { status });
    return response.data;
  },
  getRoles: async () => {
    const response = await axiosClient.get('/management/roles');
    return response.data;
  },
  createRole: async (data) => {
    const response = await axiosClient.post('/management/roles', data);
    return response.data;
  },
  updateRole: async (id, data) => {
    const response = await axiosClient.put(`/management/roles/${id}`, data);
    return response.data;
  },
  deleteRole: async (id) => {
    const response = await axiosClient.delete(`/management/roles/${id}`);
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