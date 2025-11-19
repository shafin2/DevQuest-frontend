import api from '../lib/api';

export const taskService = {
  // Create new task (PM only)
  createTask: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  // Get tasks for a project
  getProjectTasks: async (projectId, status) => {
    const params = status ? { status } : {};
    const response = await api.get(`/tasks/project/${projectId}`, { params });
    return response.data;
  },

  // Get developer's assigned tasks
  getMyTasks: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/tasks/my-tasks', { params });
    return response.data;
  },

  // Update task (status, assignment, etc)
  updateTask: async (taskId, data) => {
    const response = await api.patch(`/tasks/${taskId}`, data);
    return response.data;
  },

  // Update task status (for Kanban drag & drop)
  updateTaskStatus: async (taskId, status) => {
    const response = await api.patch(`/tasks/${taskId}`, { status });
    return response.data;
  },

  // Delete task (PM only)
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
};
