import axiosClient from '../api/axiosClient';

export const authService = {
  login: async ({ username, usernameOrEmail, email, password } = {}) => {
    const userIdentifier = username || usernameOrEmail || email || '';
    const response = await axiosClient.post('/auth/login', {
      username: userIdentifier,
      password,
    });
    return response.data;
  },
  register: async ({
    fullname,
    fullName,
    username,
    email,
    password,
    gender = 'Male',
    address = '',
    dateOfBirth = null,
  } = {}) => {
    const response = await axiosClient.post('/auth/register', {
      fullname: fullname || fullName,
      username,
      email,
      password,
      gender,
      address,
      dateOfBirth,
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
    try {
      const response = await axiosClient.post('/auth/logout');
      return response.data;
    } catch {
      return null;
    }
  },
};