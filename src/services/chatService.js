import api from '../lib/api';

const chatService = {
  // Get Stream Chat token for current user
  getChatToken: async () => {
    const response = await api.get('/chat/token');
    return response.data.data; // Extract the data object
  },

  // Create or get project channel
  createProjectChannel: async (projectId) => {
    const response = await api.post(`/chat/channel/${projectId}`);
    return response.data.data; // Extract the data object
  },
};

export default chatService;
