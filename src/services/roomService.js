import axiosClient from '../api/axiosClient';

export const roomService = {
  getAllRooms: async () => {
    const response = await axiosClient.get('/rooms');
    return response.data;
  },
  getRoomById: async (id) => {
    const response = await axiosClient.get(`/rooms/${id}`);
    return response.data;
  },
  getRoomsByHotel: async (hotelId) => {
    const response = await axiosClient.get(`/rooms/hotel/${hotelId}`);
    return response.data;
  },
  getRoomsByRoomType: async (roomTypeId) => {
    const response = await axiosClient.get(`/rooms/room-type/${roomTypeId}`);
    return response.data;
  },
  getRoomsByFilter: async (hotelId, roomTypeId) => {
    const response = await axiosClient.get('/rooms/filter', { params: { hotelId, roomTypeId } });
    return response.data;
  },
  createRoom: async (data) => {
    const response = await axiosClient.post('/rooms', data);
    return response.data;
  },
  updateRoom: async (id, data) => {
    const response = await axiosClient.put(`/rooms/${id}`, data);
    return response.data;
  },
  deleteRoom: async (id) => {
    const response = await axiosClient.delete(`/rooms/${id}`);
    return response.data;
  },
};