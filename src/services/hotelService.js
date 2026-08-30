import axiosClient from '../api/axiosClient';

export const hotelService = {
  getAllHotels: async () => {
    const response = await axiosClient.get('/hotels');
    return response.data;
  },
  getHotelById: async (id) => {
    const response = await axiosClient.get(`/hotels/${id}`);
    return response.data;
  },
  searchHotels: async (keyword) => {
    const response = await axiosClient.get('/hotels/search', { params: { keyword } });
    return response.data;
  },
  getHotelsByDistrict: async (districtId) => {
    const response = await axiosClient.get(`/hotels/location/${districtId}`);
    return response.data;
  },
  getHotelsByOwner: async (ownerId) => {
    const response = await axiosClient.get(`/hotels/owner/${ownerId}`);
    return response.data;
  },
  createHotel: async (data) => {
    const response = await axiosClient.post('/hotels', data);
    return response.data;
  },
  updateHotel: async (id, data) => {
    const response = await axiosClient.put(`/hotels/${id}`, data);
    return response.data;
  },
  deleteHotel: async (id) => {
    const response = await axiosClient.delete(`/hotels/${id}`);
    return response.data;
  },
};