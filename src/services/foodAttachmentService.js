import axiosClient from '../api/axiosClient';

export const foodAttachmentService = {
  getFoodAttachments: async (foodId) => {
    const response = await axiosClient.get(`/foods/${foodId}/attachments`);
    return response.data;
  },
  uploadFoodAttachment: async (foodId, file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    const response = await axiosClient.post(`/foods/${foodId}/attachments`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  uploadFoodAttachments: async (foodId, files, type) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (type) formData.append('type', type);
    const response = await axiosClient.post(`/foods/${foodId}/attachments`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  deleteFoodAttachment: async (foodId, attachmentId) => {
    const response = await axiosClient.delete(`/foods/${foodId}/attachments/${attachmentId}`);
    return response.data;
  },
};