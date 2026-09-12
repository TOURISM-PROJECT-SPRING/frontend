import axiosClient from '../api/axiosClient';

export const hotelAttachmentService = {
  getHotelAttachments: async (hotelId) => {
    const response = await axiosClient.get(`/hotels/${hotelId}/attachments`);
    return response.data;
  },
  uploadHotelAttachment: async (hotelId, file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    const response = await axiosClient.post(`/hotels/${hotelId}/attachments`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  uploadHotelAttachments: async (hotelId, files, type) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (type) formData.append('type', type);
    const response = await axiosClient.post(`/hotels/${hotelId}/attachments`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  deleteHotelAttachment: async (hotelId, attachmentId) => {
    const response = await axiosClient.delete(`/hotels/${hotelId}/attachments/${attachmentId}`);
    return response.data;
  },
};