import axiosClient from '../api/axiosClient';

const toDistrict = (location) => ({
  id: location.id,
  name: location.district,
  province: { id: location.id, name: location.province },
});

const toDistricts = (locations) => (locations || []).map(toDistrict);

export const districtService = {
  getAllDistricts: async () => {
    const response = await axiosClient.get('/locations');
    return toDistricts(response.data);
  },
  getDistrictById: async (id) => {
    const response = await axiosClient.get(`/locations/${id}`);
    return toDistrict(response.data);
  },
  getDistrictsByProvince: async (provinceId) => {
    const province = await axiosClient.get(`/locations/${provinceId}`);
    const response = await axiosClient.get('/locations/province', {
      params: { name: province.data.province },
    });
    return toDistricts(response.data);
  },
  searchDistricts: async (keyword) => {
    const response = await axiosClient.get('/locations/search', { params: { keyword } });
    return toDistricts(response.data);
  },
  createDistrict: async (data) => {
    const response = await axiosClient.post('/locations', {
      province: data.province || data.provinceName,
      district: data.name,
    });
    return toDistrict(response.data);
  },
  updateDistrict: async (id, data) => {
    const current = await axiosClient.get(`/locations/${id}`);
    const response = await axiosClient.put(`/locations/${id}`, {
      province: data.province || current.data.province,
      district: data.name,
    });
    return toDistrict(response.data);
  },
  deleteDistrict: async (id) => {
    const response = await axiosClient.delete(`/locations/${id}`);
    return response.data;
  },
};