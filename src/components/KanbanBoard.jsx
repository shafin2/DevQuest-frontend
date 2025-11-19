import { useState } from 'react';

const KanbanBoard = ({ tasks, onTaskMove, onTaskClick, isPM }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const columns = [
    { id: 'todo', title: '📋 To Do', color: 'bg-gray-50 border-gray-300' },
    { id: 'inProgress', title: '🔄 In Progress', color: 'bg-blue-50 border-blue-300' },
    { id: 'review', title: '👀 Review', color: 'bg-yellow-50 border-yellow-300' },
    { id: 'done', title: '✅ Done', color: 'bg-green-50 border-green-300' },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      setIsUpdating(true);
      setUpdatingTaskId(draggedTask._id);
      try {
        await onTaskMove(draggedTask._id, newStatus);
      } catch (error) {
        console.error('Failed to move task:', error);
      } finally {
        setIsUpdating(false);
        setUpdatingTaskId(null);
      }
    }
    setDraggedTask(null);
  };

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map(column => {
        const columnTasks = getTasksByStatus(column.id);
        
        return (
          <div
            key={column.id}
            className="flex flex-col min-h-[500px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={`${column.color} border-2 rounded-t-xl px-4 py-3`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">{column.title}</h3>
                <span className="bg-white px-2 py-1 rounded-full text-xs font-bold text-gray-700">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Tasks Container */}
            <div className="flex-1 bg-gray-100 border-2 border-t-0 border-gray-200 rounded-b-xl p-3 space-y-3 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm">No tasks</p>
                </div>
              ) : (
                columnTasks.map(task => {
                  const isDragging = draggedTask?._id === task._id;
                  const isBeingUpdated = updatingTaskId === task._id;
                  
                  return (
                  <div
                    key={task._id}
                    draggable={!isUpdating}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onClick={() => !isUpdating && onTaskClick?.(task)}
                    className={`bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative ${
                      isDragging ? 'opacity-50 scale-95' : ''
                    } ${
                      isBeingUpdated ? 'animate-pulse' : ''
                    }`}
                  >
                    {isBeingUpdated && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                        <div className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span className="text-sm font-semibold">Updating...</span>
                        </div>
                      </div>
                    )}
                    {/* Task Title */}
                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {task.title}
                    </h4>

                    {/* Description */}
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Priority & Difficulty */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-md font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-600">
                        {getDifficultyStars(task.difficulty)}
                      </span>
                    </div>

                    {/* XP & Assignee */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{task.xpPoints} XP</span>
                      </div>

                      {task.assignedTo ? (
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {task.assignedTo.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-gray-600 hidden sm:inline">
                            Lv.{task.assignedTo.level || 1}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Unassigned</span>
                      )}
                    </div>

                    {/* Due Date */}
                    {task.dueDate && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
