import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

const DashboardPage = () => {
  const { user, isClient, isPM, isDeveloper, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalProjects: 0,
    teamMembers: 0,
    tasksCompleted: 0,
    pendingInvites: 0,
    totalXP: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Refresh user data on mount to get latest XP/level
      if (user) {
        await refreshUser();
      }
      fetchDashboardStats();
    };
    loadData();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await projectService.getMyProjects();
      const projects = response.data.projects || [];
      
      const activeProjects = projects.filter(p => p.status === 'active').length;
      const totalTeamMembers = projects.reduce((sum, p) => sum + (p.teamMembers?.length || 0), 0);
      
      setStats({
        activeProjects,
        totalProjects: projects.length,
        teamMembers: totalTeamMembers,
        tasksCompleted: user?.tasksCompleted || 0,
        pendingInvites: 0,
        totalXP: user?.xp || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Header with Profile Card */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-indigo-100 flex items-center gap-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    {user?.role === 'client' && '🎯 Quest Giver'}
                    {user?.role === 'pm' && '⚔️ Guild Master'}
                    {user?.role === 'developer' && '🗡️ Adventurer'}
                  </span>
                  <span className="bg-yellow-400/20 px-3 py-1 rounded-full text-sm font-semibold">
                    Level {user?.level || 1} • {user?.xp || 0} XP
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-indigo-100 mb-1">Next Level</p>
              <div className="w-64 bg-white/20 rounded-full h-3 backdrop-blur-sm">
                <div 
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((user?.xp || 0) % 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-indigo-100 mt-1">
                {100 - ((user?.xp || 0) % 100)} XP to Level {(user?.level || 1) + 1}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Card 1 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {isClient && 'My Projects'}
                  {isPM && 'Managing'}
                  {isDeveloper && 'Active Tasks'}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats.activeProjects}
                </p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stats Card 2 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {isClient && 'Total Projects'}
                  {isPM && 'Team Members'}
                  {isDeveloper && 'Tasks Done'}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : (isDeveloper ? stats.tasksCompleted : isPM ? stats.teamMembers : stats.totalProjects)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isDeveloper ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  )}
                </svg>
              </div>
            </div>
          </div>

          {/* Stats Card 3 - XP (Developers only) or Team Size */}
          {isDeveloper ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total XP</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalXP}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Team Size</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.teamMembers}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Stats Card 4 - Current Level (Developers) or Pending */}
          {isDeveloper ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Level</p>
                  <p className="text-3xl font-bold text-gray-900">{user?.level || 1}</p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                  🎖️
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Invites</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.pendingInvites}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isClient && (
              <Link to="/projects" className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="ml-4 text-left">
                  <p className="font-semibold text-gray-900">Create New Quest</p>
                  <p className="text-sm text-gray-600">Start a new project</p>
                </div>
              </Link>
            )}

            <Link to="/projects" className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="font-semibold text-gray-900">
                  {isClient && 'My Quests'}
                  {isPM && 'Manage Projects'}
                  {isDeveloper && 'Active Quests'}
                </p>
                <p className="text-sm text-gray-600">View all projects</p>
              </div>
            </Link>

            <Link to="/invites" className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="font-semibold text-gray-900">Invitations</p>
                <p className="text-sm text-gray-600">Pending invites</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-600 mb-6">
              Start your journey by creating a project or joining a team
            </p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
