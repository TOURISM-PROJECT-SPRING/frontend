import axiosClient from '../api/axiosClient';

export const restaurantAttachmentService = {
  getRestaurantAttachments: async (restaurantId) => {
    const response = await axiosClient.get(`/restaurants/${restaurantId}/attachments`);
    return response.data;
  },
  uploadRestaurantAttachment: async (restaurantId, file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    const response = await axiosClient.post(`/restaurants/${restaurantId}/attachments`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  uploadRestaurantAttachments: async (restaurantId, files, type) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (type) formData.append('type', type);
    const response = await axiosClient.post(`/restaurants/${restaurantId}/attachments`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  deleteRestaurantAttachment: async (restaurantId, attachmentId) => {
    const response = await axiosClient.delete(`/restaurants/${restaurantId}/attachments/${attachmentId}`);
    return response.data;
  },
};