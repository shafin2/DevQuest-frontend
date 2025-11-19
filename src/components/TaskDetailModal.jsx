import { useState } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const TaskDetailModal = ({ task, onClose, onUpdate, isPM }) => {
  const { refreshUser, isDeveloper } = useAuth();
  const { showXPNotification, showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);

  const statuses = [
    { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-700' },
    { value: 'inProgress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { value: 'review', label: 'Review', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'done', label: 'Done', color: 'bg-green-100 text-green-700' },
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      critical: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[priority] || colors.medium;
  };

  const getDifficultyStars = (difficulty) => {
    const stars = {
      easy: '⭐',
      medium: '⭐⭐',
      hard: '⭐⭐⭐',
      expert: '⭐⭐⭐⭐',
    };
    return stars[difficulty] || '⭐⭐';
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await taskService.updateTaskStatus(task._id, newStatus);
      setStatus(newStatus);
      
      // If task completed and user is developer, refresh user data and show XP notification
      if (newStatus === 'done' && isDeveloper && response.data?.xpEarned > 0) {
        const { xpEarned, leveledUp, newLevel, newBadges = [] } = response.data;
        
        // Refresh user data to get updated XP/level (non-blocking)
        try {
          await refreshUser();
        } catch (refreshError) {
          console.error('Failed to refresh user data:', refreshError);
        }
        
        // Show XP notification with animated component
        showXPNotification(xpEarned, leveledUp, newLevel, newBadges);
      }
      
      onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
      showNotification(error.response?.data?.message || 'Failed to update task status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setLoading(true);
      await taskService.deleteTask(task._id);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert(error.response?.data?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getDifficultyStars(task.difficulty)} {task.difficulty}
                  </span>
                  <span className="text-sm font-bold text-indigo-600">
                    {task.xpPoints} XP
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Description */}
            {task.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {/* Status */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {statuses.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => handleStatusChange(s.value)}
                    disabled={loading || status === s.value}
                    className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all border-2 ${
                      status === s.value
                        ? `${s.color} border-current`
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Assigned To</h3>
              {task.assignedTo ? (
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {task.assignedTo.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{task.assignedTo.name}</p>
                    <p className="text-sm text-gray-500">Level {task.assignedTo.level || 1}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Unassigned</p>
              )}
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Due Date</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(task.dueDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Created</p>
                  <p className="text-gray-900">{new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
                {task.completedAt && (
                  <div>
                    <p className="text-gray-500 mb-1">Completed</p>
                    <p className="text-gray-900">{new Date(task.completedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          {isPM && (
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-between items-center">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Delete Task
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
