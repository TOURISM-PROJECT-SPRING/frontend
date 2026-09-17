import { promotionService } from './promotionService';

export const offersService = {
  getPromotions: async () => {
    return promotionService.getActivePromotions();
  },
};