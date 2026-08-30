import axiosClient from '../api/axiosClient';

export const orderService = {
  getAllOrders: async () => {
    const response = await axiosClient.get('/food-orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await axiosClient.get(`/food-orders/${id}`);
    return response.data;
  },
  getOrdersByUser: async (userId) => {
    const response = await axiosClient.get(`/food-orders/user/${userId}`);
    return response.data;
  },
  getOrdersByRestaurant: async (restaurantId) => {
    const response = await axiosClient.get(`/food-orders/restaurant/${restaurantId}`);
    return response.data;
  },
  getOrdersByStatus: async (status) => {
    const response = await axiosClient.get(`/food-orders/status/${status}`);
    return response.data;
  },
  placeOrder: async (orderData) => {
    const response = await axiosClient.post('/food-orders', orderData);
    return response.data;
  },
  placeOrderFromCart: async (userId, restaurantId, pickupTime) => {
    const response = await axiosClient.post('/food-orders/from-cart', null, {
      params: {
        userId,
        restaurantId,
        pickupTime: pickupTime instanceof Date ? pickupTime.toISOString() : pickupTime,
      },
    });
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await axiosClient.put(`/food-orders/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
  cancelOrder: async (id) => {
    const response = await axiosClient.post(`/food-orders/${id}/cancel`);
    return response.data;
  },
  deleteOrder: async (id) => {
    const response = await axiosClient.delete(`/food-orders/${id}`);
    return response.data;
  },
};