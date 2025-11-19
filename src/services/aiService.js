import api from '../lib/api';

export const aiService = {
  generateProgressSummary: async (projectData) => {
    const response = await api.post('/chatbot/progress-summary', { projectData });
    return response.data;
  },

  generateTaskTitle: async (projectTitle, userInput) => {
    const response = await api.post('/chatbot/task-suggestion', {
      context: { projectTitle, userInput },
      type: 'title'
    });
    return response.data;
  },

  generateTaskDescription: async (projectTitle, title, userInput) => {
    const response = await api.post('/chatbot/task-suggestion', {
      context: { projectTitle, title, userInput },
      type: 'description'
    });
    return response.data;
  }
};
