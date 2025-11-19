import api from '../lib/api';

export const projectService = {
  // Create new project (Client only)
  createProject: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Get user's projects based on role
  getMyProjects: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/projects/my-projects', { params });
    return response.data;
  },

  // Get project details by ID
  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Get pending invites
  getMyInvites: async () => {
    const response = await api.get('/projects/invites/my-invites');
    return response.data;
  },

  // Accept project invite
  acceptInvite: async (token) => {
    const response = await api.post(`/projects/invites/accept/${token}`);
    return response.data;
  },

  // PM invites developer to project
  inviteDeveloper: async (projectId, developerEmail) => {
    const response = await api.post(`/projects/${projectId}/invite-developer`, {
      developerEmail,
    });
    return response.data;
  },

  // Get all developers (PM only)
  getAllDevelopers: async (filters = {}) => {
    const response = await api.get('/projects/developers/all', { params: filters });
    return response.data;
  },
};
