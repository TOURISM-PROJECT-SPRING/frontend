import axiosClient from '../api/axiosClient';

export const adminService = {
  getDashboardStats: async () => {
    const response = await axiosClient.get('/admin/dashboard-stats');
    return response.data;
  },
  getBookings: async ({ type, status, search, page = 0, size = 20 } = {}) => {
    const response = await axiosClient.get('/admin/bookings', {
      params: { type, status, search, page, size },
    });
    return response.data;
  },
};
