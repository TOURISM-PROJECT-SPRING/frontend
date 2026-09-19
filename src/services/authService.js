import axiosClient from '../api/axiosClient';

export const authService = {
  // Backend LoginRequest expects { username, password }.
  login: async ({ username, usernameOrEmail, email, password } = {}) => {
    const userIdentifier = username || usernameOrEmail || email || '';
    const response = await axiosClient.post('/auth/login', {
      username: userIdentifier,
      password,
    });
    return response.data;
  },
  register: async ({ fullname, fullName, username, email, password } = {}) => {
    const response = await axiosClient.post('/auth/register', {
      fullname: fullname || fullName,
      username,
      email,
      password,
    });
    return response.data;
  },
  changePassword: async ({ currentPassword, newPassword } = {}) => {
    const response = await axiosClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
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

export default authService;