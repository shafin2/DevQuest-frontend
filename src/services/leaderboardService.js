import api from '../lib/api';

export const leaderboardService = {
  getLeaderboard: async (role = 'all') => {
    const response = await api.get(`/auth/leaderboard?role=${role}`);
    return response.data;
  },
};
