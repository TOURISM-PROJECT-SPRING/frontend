import axiosClient from '../api/axiosClient';

export const placeCategoryService = {
  getAllCategories: async () => {
    const response = await axiosClient.get('/place-categories');
    return response.data;
  },
  getCategoryById: async (id) => {
    const response = await axiosClient.get(`/place-categories/${id}`);
    return response.data;
  },
  searchCategories: async (keyword) => {
    const response = await axiosClient.get('/place-categories/search', { params: { keyword } });
    return response.data;
  },
  createCategory: async (data, image) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (image) {
      formData.append('image', image);
    }
    const response = await axiosClient.post('/place-categories', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  updateCategory: async (id, data, image) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (image) {
      formData.append('image', image);
    }
    const response = await axiosClient.put(`/place-categories/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await axiosClient.delete(`/place-categories/${id}`);
    return response.data;
  },
};