import axiosClient from '../api/axiosClient';

export const roomAttachmentService = {
  getRoomAttachments: async (roomId) => {
    const response = await axiosClient.get(`/rooms/${roomId}/attachments`);
    return response.data;
  },
  uploadRoomAttachment: async (roomId, file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    const response = await axiosClient.post(`/rooms/${roomId}/attachments`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  uploadRoomAttachments: async (roomId, files, type) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (type) formData.append('type', type);
    const response = await axiosClient.post(`/rooms/${roomId}/attachments`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  deleteRoomAttachment: async (roomId, attachmentId) => {
    const response = await axiosClient.delete(`/rooms/${roomId}/attachments/${attachmentId}`);
    return response.data;
  },
};