import axiosClient from '../api/axiosClient';

export const promotionService = {
  getActivePromotions: async () => {
    const response = await axiosClient.get('/promotions');
    return response.data;
  },
};
