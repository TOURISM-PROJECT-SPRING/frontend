import axiosClient from '../api/axiosClient';

const toProvince = (location) => ({
  id: location.id,
  name: location.province,
  image: location.image || null,
});

const toProvinces = (locations) => {
  const seen = new Set();
  const provinces = [];
  for (const loc of locations || []) {
    if (!loc.province || seen.has(loc.province)) continue;
    seen.add(loc.province);
    provinces.push(toProvince(loc));
  }
  return provinces;
};

export const provinceService = {
  getAllProvinces: async () => {
    const response = await axiosClient.get('/locations');
    return toProvinces(response.data);
  },
  getProvinceById: async (id) => {
    const response = await axiosClient.get(`/locations/${id}`);
    return toProvince(response.data);
  },
  searchProvinces: async (keyword) => {
    const response = await axiosClient.get('/locations/search', { params: { keyword } });
    return toProvinces(response.data);
  },
  createProvince: async (data, image) => {
    const response = await axiosClient.post('/locations', {
      province: data.name,
      district: data.name,
    });
    return toProvince(response.data);
  },
  updateProvince: async (id, data, image) => {
    const current = await axiosClient.get(`/locations/${id}`);
    const response = await axiosClient.put(`/locations/${id}`, {
      province: data.name,
      district: current.data.district,
    });
    return toProvince(response.data);
  },
  deleteProvince: async (id) => {
    const response = await axiosClient.delete(`/locations/${id}`);
    return response.data;
  },
};