import api from '../lib/api';

export const profileService = {
  // Get complete profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update basic profile info
  updateBasicInfo: async (data) => {
    const response = await api.put('/profile/basic', data);
    return response.data;
  },

  // Update professional/technical info (for developers and PMs)
  updateProfessionalInfo: async (data) => {
    const response = await api.put('/profile/professional', data);
    return response.data;
  },

  // Update skills and expertise
  updateSkills: async (data) => {
    const response = await api.put('/profile/skills', data);
    return response.data;
  },

  // Update portfolio/projects
  updatePortfolio: async (data) => {
    const response = await api.put('/profile/portfolio', data);
    return response.data;
  },

  // Update profile visibility settings
  updateVisibility: async (visibility) => {
    const response = await api.put('/profile/visibility', { visibility });
    return response.data;
  },
};
