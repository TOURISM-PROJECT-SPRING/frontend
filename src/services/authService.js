import axiosClient from '../api/axiosClient';

export const authService = {
  login: async ({ usernameOrEmail, password } = {}) => {
    const response = await axiosClient.post('/auth/login', { usernameOrEmail, password });
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
};