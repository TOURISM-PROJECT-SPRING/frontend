import axiosClient from '../api/axiosClient';

export const roomBookingService = {
  getAllRoomBookings: async () => {
    const response = await axiosClient.get('/room-bookings');
    return response.data;
  },
  getRoomBookingById: async (id) => {
    const response = await axiosClient.get(`/room-bookings/${id}`);
    return response.data;
  },
  getRoomBookingsByUser: async (userId) => {
    const response = await axiosClient.get(`/room-bookings/user/${userId}`);
    return response.data;
  },
  getRoomBookingsByRoom: async (roomId) => {
    const response = await axiosClient.get(`/room-bookings/room/${roomId}`);
    return response.data;
  },
  getRoomBookingsByStatus: async (status) => {
    const response = await axiosClient.get(`/room-bookings/status/${status}`);
    return response.data;
  },
  getRoomBookingsByUserAndStatus: async (userId, status) => {
    const response = await axiosClient.get(`/room-bookings/user/${userId}/status/${status}`);
    return response.data;
  },
  createRoomBooking: async (data) => {
    const response = await axiosClient.post('/room-bookings', data);
    return response.data;
  },
  updateRoomBooking: async (id, data) => {
    const response = await axiosClient.put(`/room-bookings/${id}`, data);
    return response.data;
  },
  cancelRoomBooking: async (id) => {
    const response = await axiosClient.post(`/room-bookings/${id}/cancel`);
    return response.data;
  },
  deleteRoomBooking: async (id) => {
    const response = await axiosClient.delete(`/room-bookings/${id}`);
    return response.data;
  },
};