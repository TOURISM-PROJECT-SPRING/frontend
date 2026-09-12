import axiosClient from '../api/axiosClient';

export const userAttachmentService = {
  getUserAttachments: async (userId) => {
    const response = await axiosClient.get(`/users/${userId}/attachments`);
    return response.data;
  },
  uploadUserAttachment: async (userId, file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    const response = await axiosClient.post(`/users/${userId}/attachments`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  uploadUserAttachments: async (userId, files, type) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (type) formData.append('type', type);
    const response = await axiosClient.post(`/users/${userId}/attachments`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  deleteUserAttachment: async (userId, attachmentId) => {
    const response = await axiosClient.delete(`/users/${userId}/attachments/${attachmentId}`);
    return response.data;
  },
};