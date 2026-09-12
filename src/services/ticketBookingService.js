import axiosClient from '../api/axiosClient';

export const ticketBookingService = {
  getAllTicketBookings: async () => {
    const response = await axiosClient.get('/ticket-bookings');
    return response.data;
  },
  getTicketBookingById: async (id) => {
    const response = await axiosClient.get(`/ticket-bookings/${id}`);
    return response.data;
  },
  getTicketBookingsByUser: async (userId) => {
    const response = await axiosClient.get(`/ticket-bookings/user/${userId}`);
    return response.data;
  },
  getTicketBookingsByTicket: async (ticketId) => {
    const response = await axiosClient.get(`/ticket-bookings/ticket/${ticketId}`);
    return response.data;
  },
  getTicketBookingsByStatus: async (status) => {
    const response = await axiosClient.get(`/ticket-bookings/status/${status}`);
    return response.data;
  },
  getTicketBookingsByDate: async (visitDate) => {
    const response = await axiosClient.get('/ticket-bookings/date', {
      params: { visitDate },
    });
    return response.data;
  },
  createTicketBooking: async (data) => {
    const response = await axiosClient.post('/ticket-bookings', data);
    return response.data;
  },
  cancelTicketBooking: async (id) => {
    const response = await axiosClient.post(`/ticket-bookings/${id}/cancel`);
    return response.data;
  },
  markTicketBookingUsed: async (id) => {
    const response = await axiosClient.post(`/ticket-bookings/${id}/use`);
    return response.data;
  },
  verifyTicketBooking: async (qrCode) => {
    const response = await axiosClient.post('/ticket-bookings/verify', { qrCode });
    return response.data;
  },
  deleteTicketBooking: async (id) => {
    const response = await axiosClient.delete(`/ticket-bookings/${id}`);
    return response.data;
  },
  downloadETicket: async (id) => {
    const response = await axiosClient.get(`/ticket-bookings/${id}/eticket`, {
      responseType: 'blob',
    });
    return response.data;
  },
};