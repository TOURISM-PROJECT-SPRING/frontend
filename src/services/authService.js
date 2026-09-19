import axiosClient from '../api/axiosClient';

export const authService = {
  // Backend LoginRequest expects { username, password }.
  login: async ({ username, usernameOrEmail, password } = {}) => {
    const response = await axiosClient.post('/auth/login', {
      username: username || usernameOrEmail,
      password,
    });
    return response.data;
  },
  register: async ({ fullname, username, email, password } = {}) => {
    const response = await axiosClient.post('/auth/register', {
      fullname,
      username,
      email,
      password,
    });
    return response.data;
  },
  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },
  updateProfile: async ({ fullname, email, phone, address } = {}) => {
    const response = await axiosClient.put('/auth/profile', {
      fullname,
      email,
      phone,
      address,
    });
    return response.data;
  },
};