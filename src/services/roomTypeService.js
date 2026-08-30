import axiosClient from '../api/axiosClient';

export const roomTypeService = {
  getAllRoomTypes: async () => {
    const response = await axiosClient.get('/room-types');
    return response.data;
  },
  getRoomTypeById: async (id) => {
    const response = await axiosClient.get(`/room-types/${id}`);
    return response.data;
  },
  searchRoomTypes: async (keyword) => {
    const response = await axiosClient.get('/room-types/search', { params: { keyword } });
    return response.data;
  },
  getRoomTypesByMinCapacity: async (minCapacity) => {
    const response = await axiosClient.get('/room-types/min-capacity', {
      params: { minCapacity },
    });
    return response.data;
  },
  createRoomType: async (data) => {
    const response = await axiosClient.post('/room-types', data);
    return response.data;
  },
  updateRoomType: async (id, data) => {
    const response = await axiosClient.put(`/room-types/${id}`, data);
    return response.data;
  },
  deleteRoomType: async (id) => {
    const response = await axiosClient.delete(`/room-types/${id}`);
    return response.data;
  },
};