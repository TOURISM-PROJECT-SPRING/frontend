import axiosClient from '../api/axiosClient';
import { restaurantAttachmentService } from './restaurantAttachmentService';

async function withImages(restaurant) {
  if (!restaurant || restaurant.id == null) return restaurant;
  try {
    const attachments = await restaurantAttachmentService.getRestaurantAttachments(restaurant.id);
    const first = attachments?.[0];
    return { ...restaurant, imageUrl: first?.cloudinaryUrl || undefined };
  } catch {
    return { ...restaurant, imageUrl: undefined };
  }
}

export const restaurantService = {
  getAllRestaurants: async () => {
    const response = await axiosClient.get('/restaurants');
    return response.data;
  },
  getAllRestaurantsWithImages: async () => {
    const response = await axiosClient.get('/restaurants');
    const restaurants = response.data || [];
    return Promise.all(restaurants.map(withImages));
  },
  getRestaurantById: async (id) => {
    const response = await axiosClient.get(`/restaurants/${id}`);
    return response.data;
  },
  getRestaurantByIdWithImages: async (id) => {
    const response = await axiosClient.get(`/restaurants/${id}`);
    return withImages(response.data);
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