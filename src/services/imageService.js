import axiosClient from '../api/axiosClient';

export const imageService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post('/v1/files/upload', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
};