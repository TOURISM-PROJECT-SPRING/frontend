import axiosClient from '../api/axiosClient';

export const ticketService = {
  getAllTickets: async () => {
    const response = await axiosClient.get('/tickets');
    return response.data;
  },
  getAvailableTickets: async () => {
    const response = await axiosClient.get('/tickets/available');
    return response.data;
  },
  getTicketById: async (id) => {
    const response = await axiosClient.get(`/tickets/${id}`);
    return response.data;
  },
  getTicketsByTourismPlace: async (tourismPlaceId) => {
    const response = await axiosClient.get(`/tickets/place/${tourismPlaceId}`);
    return response.data;
  },
  searchTickets: async (keyword) => {
    const response = await axiosClient.get('/tickets/search', { params: { keyword } });
    return response.data;
  },
  getTicketsByPriceRange: async (min, max) => {
    const response = await axiosClient.get('/tickets/price', { params: { min, max } });
    return response.data;
  },
  createTicket: async (data) => {
    const response = await axiosClient.post('/tickets', data);
    return response.data;
  },
  updateTicket: async (id, data) => {
    const response = await axiosClient.put(`/tickets/${id}`, data);
    return response.data;
  },
  deleteTicket: async (id) => {
    const response = await axiosClient.delete(`/tickets/${id}`);
    return response.data;
  },
};