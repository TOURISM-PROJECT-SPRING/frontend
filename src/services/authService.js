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
  forgotPassword: async (email) => {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async ({ token, newPassword } = {}) => {
    const response = await axiosClient.post('/auth/reset-password', {
      token,
      newPassword,
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
};