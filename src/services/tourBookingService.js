import axiosClient from '../api/axiosClient';

export const tourBookingService = {
  getAllTourBookings: async () => {
    const response = await axiosClient.get('/tour-bookings');
    return response.data;
  },
  getTourBookingById: async (id) => {
    const response = await axiosClient.get(`/tour-bookings/${id}`);
    return response.data;
  },
  getTourBookingsByUser: async (userId) => {
    const response = await axiosClient.get(`/tour-bookings/user/${userId}`);
    return response.data;
  },
  getTourBookingsByStatus: async (status) => {
    const response = await axiosClient.get(`/tour-bookings/status/${status}`);
    return response.data;
  },
  createTourBooking: async (data) => {
    const response = await axiosClient.post('/tour-bookings', data);
    return response.data;
  },
  cancelTourBooking: async (id) => {
    const response = await axiosClient.post(`/tour-bookings/${id}/cancel`);
    return response.data;
  },
  deleteTourBooking: async (id) => {
    const response = await axiosClient.delete(`/tour-bookings/${id}`);
    return response.data;
  },
};