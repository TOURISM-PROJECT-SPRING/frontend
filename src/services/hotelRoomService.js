import axiosClient from '../api/axiosClient';

export const hotelRoomService = {
  getAllHotelRooms: async () => {
    const response = await axiosClient.get('/hotel-rooms');
    return response.data;
  },
  getHotelRoomById: async (id) => {
    const response = await axiosClient.get(`/hotel-rooms/${id}`);
    return response.data;
  },
  getHotelRoomsByHotel: async (hotelId) => {
    const response = await axiosClient.get(`/hotel-rooms/hotel/${hotelId}`);
    return response.data;
  },
  getHotelRoomsByRoomType: async (roomTypeId) => {
    const response = await axiosClient.get(`/hotel-rooms/room-type/${roomTypeId}`);
    return response.data;
  },
  getHotelRoomsByPriceRange: async (minPrice, maxPrice) => {
    const response = await axiosClient.get('/hotel-rooms/price-range', {
      params: { minPrice, maxPrice },
    });
    return response.data;
  },
  getHotelRoomsByMinCapacity: async (minCapacity) => {
    const response = await axiosClient.get('/hotel-rooms/min-capacity', {
      params: { minCapacity },
    });
    return response.data;
  },
  createHotelRoom: async (data) => {
    const response = await axiosClient.post('/hotel-rooms', data);
    return response.data;
  },
  updateHotelRoom: async (id, data) => {
    const response = await axiosClient.put(`/hotel-rooms/${id}`, data);
    return response.data;
  },
  deleteHotelRoom: async (id) => {
    const response = await axiosClient.delete(`/hotel-rooms/${id}`);
    return response.data;
  },
};