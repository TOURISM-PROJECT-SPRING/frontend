import axiosClient from '../api/axiosClient';

export const provinceService = {
  getAllProvinces: async () => {
    const response = await axiosClient.get('/provinces');
    return response.data;
  },
  getProvinceById: async (id) => {
    const response = await axiosClient.get(`/provinces/${id}`);
    return response.data;
  },
  searchProvinces: async (keyword) => {
    const response = await axiosClient.get('/provinces/search', { params: { keyword } });
    return response.data;
  },
  createProvince: async (data, image) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (image) {
      formData.append('image', image);
    }
    const response = await axiosClient.post('/provinces', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  updateProvince: async (id, data, image) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (image) {
      formData.append('image', image);
    }
    const response = await axiosClient.put(`/provinces/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  deleteProvince: async (id) => {
    const response = await axiosClient.delete(`/provinces/${id}`);
    return response.data;
  },
};