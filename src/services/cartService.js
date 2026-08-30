import axiosClient from '../api/axiosClient';

export const cartService = {
  getOrCreateCart: async (userId, restaurantId) => {
    const response = await axiosClient.get('/carts', { params: { userId, restaurantId } });
    return response.data;
  },
  getCartsByUser: async (userId) => {
    const response = await axiosClient.get(`/carts/user/${userId}`);
    return response.data;
  },
  getCartItems: async (cartId) => {
    const response = await axiosClient.get(`/carts/${cartId}/items`);
    return response.data;
  },
  addItem: async (cartId, itemData) => {
    const response = await axiosClient.post(`/carts/${cartId}/items`, itemData);
    return response.data;
  },
  updateItemQuantity: async (cartId, itemId, quantity) => {
    const response = await axiosClient.put(`/carts/${cartId}/items/${itemId}`, null, {
      params: { quantity },
    });
    return response.data;
  },
  removeItem: async (cartId, itemId) => {
    const response = await axiosClient.delete(`/carts/${cartId}/items/${itemId}`);
    return response.data;
  },
  clearCart: async (cartId) => {
    const response = await axiosClient.delete(`/carts/${cartId}/items`);
    return response.data;
  },
};