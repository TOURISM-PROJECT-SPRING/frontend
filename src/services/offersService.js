import axiosClient from '../api/axiosClient';

export const offersService = {
  getPromotions: async () => {
    const response = await axiosClient.get('/promotions');
    return response.data;
  },
};