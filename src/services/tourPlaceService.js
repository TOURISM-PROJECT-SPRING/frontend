import axiosClient from '../api/axiosClient';

export const tourPlaceService = {
  getAllTourPlaces: async () => {
    const response = await axiosClient.get('/tour-places');
    return response.data;
  },
  getTourPlaceById: async (id) => {
    const response = await axiosClient.get(`/tour-places/${id}`);
    return response.data;
  },
  createTourPlace: async (data, images) => {
    const formData = buildFormData(data);
    if (images) {
      images.forEach((image) => formData.append('images', image));
    }
    const response = await axiosClient.post('/tour-places', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  updateTourPlace: async (id, data, images) => {
    const formData = buildFormData(data);
    if (images) {
      images.forEach((image) => formData.append('images', image));
    }
    const response = await axiosClient.put(`/tour-places/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  deleteTourPlace: async (id) => {
    const response = await axiosClient.delete(`/tour-places/${id}`);
    return response.data;
  },
  addTourPlaceImages: async (id, images) => {
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));
    const response = await axiosClient.post(`/tour-places/${id}/images`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  removeTourPlaceImage: async (id, imageId) => {
    const response = await axiosClient.delete(`/tour-places/${id}/images/${imageId}`);
    return response.data;
  },
  clearTourPlaceImages: async (id) => {
    const response = await axiosClient.delete(`/tour-places/${id}/images`);
    return response.data;
  },
  setPrimaryTourPlaceImage: async (id, imageId) => {
    const response = await axiosClient.post(`/tour-places/${id}/images/${imageId}/primary`);
    return response.data;
  },
  searchTourPlaces: async (keyword) => {
    const response = await axiosClient.get('/tour-places/search', { params: { keyword } });
    return response.data;
  },
  getTourPlacesByDistrict: async (districtId) => {
    const response = await axiosClient.get(`/tour-places/district/${districtId}`);
    return response.data;
  },
  getTourPlacesByCategory: async (categoryId) => {
    const response = await axiosClient.get(`/tour-places/category/${categoryId}`);
    return response.data;
  },
  getTourPlacesByUser: async (userId) => {
    const response = await axiosClient.get(`/tour-places/user/${userId}`);
    return response.data;
  },
  getTourPlacesByStatus: async (status) => {
    const response = await axiosClient.get(`/tour-places/status/${status}`);
    return response.data;
  },
  getTourPlacesByMinRating: async (minRating) => {
    const response = await axiosClient.get('/tour-places/rating', { params: { minRating } });
    return response.data;
  },
  filterByDistrictAndCategory: async (districtId, categoryId) => {
    const response = await axiosClient.get('/tour-places/filter', {
      params: { districtId, categoryId },
    });
    return response.data;
  },
};

function buildFormData(data) {
  const formData = new FormData();
  for (const key in data) {
    const value = data[key];
    if (value === undefined || value === null) {
      continue;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, value);
    }
  }
  return formData;
}