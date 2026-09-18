import axiosClient from '../api/axiosClient';

export const tourPlaceService = {
  getAllTourPlaces: async () => {
    const response = await axiosClient.get('/tour-places');
    return enrichWithImages(response.data || []);
  },
  getTourPlaceById: async (id) => {
    const response = await axiosClient.get(`/tour-places/${id}`);
    return enrichWithImages(response.data);
  },
  createTourPlace: async (data, images) => {
    const response = await axiosClient.post('/tour-places', data);
    const created = response.data;
    if (images && images.length) {
      await uploadTourPlaceImages(created.id, images);
    }
    return created;
  },
  updateTourPlace: async (id, data, images) => {
    const response = await axiosClient.put(`/tour-places/${id}`, data);
    if (images && images.length) {
      await uploadTourPlaceImages(id, images);
    }
    return response.data;
  },
  deleteTourPlace: async (id) => {
    const response = await axiosClient.delete(`/tour-places/${id}`);
    return response.data;
  },
  addTourPlaceImages: async (id, images) => {
    return uploadTourPlaceImages(id, images);
  },
  removeTourPlaceImage: async (id, imageId) => {
    const response = await axiosClient.delete(`/tour-place-attachments/${imageId}`);
    return response.data;
  },
  clearTourPlaceImages: async (id) => {
    const images = await getTourPlaceAttachments(id);
    for (const image of images) {
      await axiosClient.delete(`/tour-place-attachments/${image.id}`);
    }
  },
  setPrimaryTourPlaceImage: async (id, _imageId) => {
    return getTourPlaceAttachments(id);
  },
  getTourPlaceImages: async (id) => {
    return getTourPlaceAttachments(id);
  },
  searchTourPlaces: async (keyword) => {
    const response = await axiosClient.get('/tour-places/search', { params: { keyword } });
    return enrichWithImages(response.data || []);
  },
  getTourPlacesByDistrict: async (districtId) => {
    const response = await axiosClient.get(`/tour-places/district/${districtId}`);
    return enrichWithImages(response.data || []);
  },
  getTourPlacesByCategory: async (categoryId) => {
    const response = await axiosClient.get(`/tour-places/category/${categoryId}`);
    return enrichWithImages(response.data || []);
  },
  getTourPlacesByUser: async (userId) => {
    const response = await axiosClient.get(`/tour-places/user/${userId}`);
    return enrichWithImages(response.data || []);
  },
  getTourPlacesByStatus: async (status) => {
    const response = await axiosClient.get(`/tour-places/status/${status}`);
    return enrichWithImages(response.data || []);
  },
  getTourPlacesByMinRating: async (minRating) => {
    const response = await axiosClient.get('/tour-places/rating', { params: { minRating } });
    return enrichWithImages(response.data || []);
  },
  filterByDistrictAndCategory: async (districtId, categoryId) => {
    const response = await axiosClient.get('/tour-places/filter', {
      params: { districtId, categoryId },
    });
    return enrichWithImages(response.data || []);
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

async function uploadTourPlaceImages(id, images) {
  const formData = buildFormData({ tourPlaceId: id, files: images });
  const response = await axiosClient.post('/tour-place-attachments', formData, {
    headers: { 'Content-Type': undefined },
  });
  return response.data;
}

async function getTourPlaceAttachments(id) {
  const response = await axiosClient.get(`/tour-place-attachments/tour-place/${id}`);
  return (response.data || []).map((attachment) => ({
    id: attachment.id,
    imageUrl: attachment.cloudinaryUrl,
    isPrimary: (attachment.type || '').toUpperCase() === 'PRIMARY',
  }));
}

async function enrichWithImages(places) {
  if (Array.isArray(places)) {
    return Promise.all(places.map((place) => enrichWithImages(place)));
  }
  if (!places || places.id == null) return places;
  const placeImages = await getTourPlaceAttachments(places.id).catch(() => []);
  return { ...places, placeImages };
}