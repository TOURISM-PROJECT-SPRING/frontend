import axiosClient from '../api/axiosClient';

export const tourPlaceAttachmentService = {
  getByTourPlaceId: async (tourPlaceId) => {
    const response = await axiosClient.get(`/tour-place-attachments/tour-place/${tourPlaceId}`);
    return response.data;
  },
  uploadAttachments: async (tourPlaceId, files, type) => {
    const formData = new FormData();
    formData.append('tourPlaceId', tourPlaceId);
    if (Array.isArray(files)) {
      files.forEach((file) => formData.append('files', file));
    } else if (files) {
      formData.append('file', files);
    }
    if (type) {
      formData.append('type', type);
    }
    const response = await axiosClient.post('/tour-place-attachments', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  deleteAttachment: async (attachmentId) => {
    const response = await axiosClient.delete(`/tour-place-attachments/${attachmentId}`);
    return response.data;
  },
};
