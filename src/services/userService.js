import api from '../lib/api';

export const userService = {
  // Get Profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update Profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', {
      profile: profileData,
    });
    return response.data;
  },

  // Change Password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
