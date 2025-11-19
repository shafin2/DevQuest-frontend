import { useState } from 'react';
import { aiService } from '../services/aiService';

const AIProgressSummary = ({ project }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateSummary = async () => {
    if (summary && !loading) {
      setIsExpanded(!isExpanded);
      return;
    }

    try {
      setLoading(true);
      setIsExpanded(true);

      // Calculate task stats
      const tasks = project.tasks || [];
      const completedTasks = tasks.filter(t => t.status === 'done').length;
      const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

      const projectData = {
        title: project.title,
        description: project.description,
        totalTasks: tasks.length,
        completedTasks,
        inProgressTasks,
        teamSize: project.teamMembers?.length || 0,
        deadline: project.deadline,
        budget: project.budget
      };

      const response = await aiService.generateProgressSummary(projectData);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('Unable to generate AI summary at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <button
        onClick={generateSummary}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="font-semibold text-sm">
          {loading ? 'Generating...' : isExpanded ? 'Refresh Insights' : '✨ AI Progress Summary'}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 p-4 bg-linear-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-200 rounded-xl shadow-sm animate-fadeIn">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 font-medium">AI is analyzing your project...</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <span>AI Project Insights</span>
                    <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">Powered by AI</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-full p-1 transition-colors"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-200 flex items-center justify-between">
                <p className="text-xs text-purple-600 italic flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  AI-generated summary based on current project data
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIProgressSummary;
