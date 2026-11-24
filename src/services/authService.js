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
  // Social / OAuth sign-in. Google forwards a provider access token via `token`
  // and the backend verifies it server-side.
  loginWithProvider: async ({ provider, token } = {}) => {
    const response = await axiosClient.post(`/auth/social/${provider}`, { token });
    return response.data;
  },
  getConnectedAccounts: async (expectedSessionToken) => {
    const response = await axiosClient.get('/auth/social/connections', { expectedSessionToken });
    return response.data;
  },
  linkFacebook: async (token, expectedSessionToken) => {
    const response = await axiosClient.post('/auth/social/facebook/link', { token }, { expectedSessionToken });
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
  logout: async (sessionToken) => {
    const response = await axiosClient.post('/auth/logout', undefined, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
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