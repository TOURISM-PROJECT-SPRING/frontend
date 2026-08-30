import axiosClient from '../api/axiosClient';

export const restaurantService = {
  getAllRestaurants: async () => {
    const response = await axiosClient.get('/restaurants');
    return response.data;
  },
  getRestaurantById: async (id) => {
    const response = await axiosClient.get(`/restaurants/${id}`);
    return response.data;
  },
  searchRestaurants: async (keyword) => {
    const response = await axiosClient.get('/restaurants/search', { params: { keyword } });
    return response.data;
  },
  getRestaurantsByTourismPlace: async (tourismPlaceId) => {
    const response = await axiosClient.get(`/restaurants/tourism-place/${tourismPlaceId}`);
    return response.data;
  },
  createRestaurant: async (data) => {
    const response = await axiosClient.post('/restaurants', data);
    return response.data;
  },
  updateRestaurant: async (id, data) => {
    const response = await axiosClient.put(`/restaurants/${id}`, data);
    return response.data;
  },
  deleteRestaurant: async (id) => {
    const response = await axiosClient.delete(`/restaurants/${id}`);
    return response.data;
  },
};