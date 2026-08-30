import axiosClient from '../api/axiosClient';

export const foodCategoryService = {
  getAllFoodCategories: async () => {
    const response = await axiosClient.get('/food-categories');
    return response.data;
  },
  getFoodCategoryById: async (id) => {
    const response = await axiosClient.get(`/food-categories/${id}`);
    return response.data;
  },
  searchFoodCategories: async (keyword) => {
    const response = await axiosClient.get('/food-categories/search', { params: { keyword } });
    return response.data;
  },
  createFoodCategory: async (data) => {
    const response = await axiosClient.post('/food-categories', data);
    return response.data;
  },
  updateFoodCategory: async (id, data) => {
    const response = await axiosClient.put(`/food-categories/${id}`, data);
    return response.data;
  },
  deleteFoodCategory: async (id) => {
    const response = await axiosClient.delete(`/food-categories/${id}`);
    return response.data;
  },
};