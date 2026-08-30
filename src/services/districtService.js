import axiosClient from '../api/axiosClient';

export const districtService = {
  getAllDistricts: async () => {
    const response = await axiosClient.get('/districts');
    return response.data;
  },
  getDistrictById: async (id) => {
    const response = await axiosClient.get(`/districts/${id}`);
    return response.data;
  },
  getDistrictsByProvince: async (provinceId) => {
    const response = await axiosClient.get(`/districts/province/${provinceId}`);
    return response.data;
  },
  searchDistricts: async (keyword) => {
    const response = await axiosClient.get('/districts/search', { params: { keyword } });
    return response.data;
  },
  createDistrict: async (data) => {
    const response = await axiosClient.post('/districts', data);
    return response.data;
  },
  updateDistrict: async (id, data) => {
    const response = await axiosClient.put(`/districts/${id}`, data);
    return response.data;
  },
  deleteDistrict: async (id) => {
    const response = await axiosClient.delete(`/districts/${id}`);
    return response.data;
  },
};