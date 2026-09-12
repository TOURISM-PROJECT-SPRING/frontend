import axiosClient from '../api/axiosClient';

export const paymentService = {
  initiatePayment: async (bookingId, paymentMethod = 'CARD') => {
    const response = await axiosClient.post(`/ticket-bookings/${bookingId}/payment`, null, {
      params: { paymentMethod },
    });
    return response.data;
  },
  handleCallback: async (data) => {
    const response = await axiosClient.post('/payments/callback', data);
    return response.data;
  },
  handleCallbackForm: async (transactionId, status, bookingId) => {
    const response = await axiosClient.post('/payments/callback-form', null, {
      params: { transactionId, status, bookingId },
    });
    return response.data;
  },
};