import axiosClient from '../api/axiosClient';

export const foodService = {
  getAllFoods: async () => {
    const response = await axiosClient.get('/foods');
    return response.data;
  },
  getFoodById: async (id) => {
    const response = await axiosClient.get(`/foods/${id}`);
    return response.data;
  },
  searchFoods: async (keyword) => {
    const response = await axiosClient.get('/foods/search', { params: { keyword } });
    return response.data;
  },
  getFoodsByRestaurant: async (restaurantId) => {
    const response = await axiosClient.get(`/foods/restaurant/${restaurantId}`);
    return response.data;
  },
  getFoodsByCategory: async (foodCategoryId) => {
    const response = await axiosClient.get(`/foods/category/${foodCategoryId}`);
    return response.data;
  },
  createFood: async (data, image) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (image) {
      formData.append('image', image);
    }
    const response = await axiosClient.post('/foods', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  updateFood: async (id, data, image) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (image) {
      formData.append('image', image);
    }
    const response = await axiosClient.put(`/foods/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  deleteFood: async (id) => {
    const response = await axiosClient.delete(`/foods/${id}`);
    return response.data;
  },
};