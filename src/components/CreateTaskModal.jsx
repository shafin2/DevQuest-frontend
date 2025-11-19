import { useState } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const CreateTaskModal = ({ onClose, onSuccess, projectId, teamMembers }) => {
  const { refreshUser } = useAuth();
  const { showXPNotification, showNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    difficulty: 'medium',
    xpPoints: 50,
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const taskData = {
        projectId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        assignedTo: formData.assignedTo || undefined,
        priority: formData.priority,
        difficulty: formData.difficulty,
        xpPoints: parseInt(formData.xpPoints),
        dueDate: formData.dueDate || undefined,
      };

      const response = await taskService.createTask(taskData);
      
      // Refresh user data to get updated XP (non-blocking)
      try {
        await refreshUser();
      } catch (refreshError) {
        console.error('Failed to refresh user data:', refreshError);
      }
      
      // Show XP notification with animated component
      if (response.data?.xpEarned > 0) {
        const { xpEarned, leveledUp, newLevel } = response.data;
        showXPNotification(xpEarned, leveledUp, newLevel, []);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        difficulty: 'medium',
        xpPoints: 50,
        dueDate: '',
      });
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Task creation error:', err);
      setError(err.response?.data?.message || 'Failed to create task');
      showNotification(err.response?.data?.message || 'Failed to create task', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyXP = (difficulty) => {
    const xpMap = { easy: 25, medium: 50, hard: 100, expert: 200 };
    return xpMap[difficulty] || 50;
  };

  const handleDifficultyChange = (e) => {
    const difficulty = e.target.value;
    setFormData(prev => ({
      ...prev,
      difficulty,
      xpPoints: getDifficultyXP(difficulty),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm  transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">⚔️ Create New Task</h2>
                <p className="text-gray-600 text-sm mt-1">Assign a quest to your team</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Build user authentication API"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                  maxLength={200}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the task requirements and expected outcome..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                  maxLength={1000}
                />
              </div>

              {/* Assign To */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🗡️ Assign To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                >
                  <option value="">Unassigned (assign later)</option>
                  {teamMembers?.filter(m => m.status === 'active').map(member => (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.name} - Level {member.user.level || 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleDifficultyChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="easy">⭐ Easy</option>
                    <option value="medium">⭐⭐ Medium</option>
                    <option value="hard">⭐⭐⭐ Hard</option>
                    <option value="expert">⭐⭐⭐⭐ Expert</option>
                  </select>
                </div>
              </div>

              {/* XP Points & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💎 XP Reward
                  </label>
                  <input
                    type="number"
                    name="xpPoints"
                    value={formData.xpPoints}
                    onChange={handleChange}
                    min="10"
                    max="1000"
                    step="5"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-set based on difficulty
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
