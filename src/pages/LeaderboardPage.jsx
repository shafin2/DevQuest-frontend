import { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboardService';
import { useAuth } from '../contexts/AuthContext';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardService.getLeaderboard(filter);
      setLeaderboard(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 text-gray-700 border-gray-300';
    if (rank === 3) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-white text-gray-600 border-gray-200';
  };

  const getRoleColor = (role) => {
    const colors = {
      client: 'bg-indigo-100 text-indigo-700',
      pm: 'bg-purple-100 text-purple-700',
      developer: 'bg-green-100 text-green-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (role) => {
    const labels = {
      client: '🎯 Quest Giver',
      pm: '⚔️ Guild Master',
      developer: '🗡️ Adventurer',
    };
    return labels[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
          <p className="text-gray-600">Top users ranked by experience points</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setFilter('client')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              filter === 'client'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎯 Quest Givers
          </button>
          <button
            onClick={() => setFilter('pm')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              filter === 'pm'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ⚔️ Guild Masters
          </button>
          <button
            onClick={() => setFilter('developer')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              filter === 'developer'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🗡️ Adventurers
          </button>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Rankings Yet</h3>
            <p className="text-gray-600">Complete tasks to earn XP and appear on the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((player, index) => {
              const rank = index + 1;
              const isCurrentUser = player._id === user?._id;
              
              return (
                <div
                  key={player._id}
                  className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-md ${
                    isCurrentUser 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : rank <= 3
                      ? 'border-yellow-300'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xl ${getRankColor(rank)}`}>
                      {getRankBadge(rank)}
                    </div>

                    {/* Avatar */}
                    <div className="w-14 h-14 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-4 border-white shadow-md">
                      {player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{player.name}</h3>
                        {isCurrentUser && (
                          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRoleColor(player.role)}`}>
                          {getRoleLabel(player.role)}
                        </span>
                        {player.tasksCompleted > 0 && (
                          <span className="text-xs text-gray-600">
                            {player.tasksCompleted} tasks completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-2xl font-bold text-gray-900">{player.xp}</span>
                        <span className="text-sm text-gray-600">XP</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-sm text-gray-600">Level</span>
                        <span className="text-lg font-bold text-indigo-600">{player.level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar (Top 3 only) */}
                  {rank <= 3 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                        <span>Level {player.level}</span>
                        <span>Level {player.level + 1}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-linear-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(player.xp % 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        {100 - (player.xp % 100)} XP to next level
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Your Position (if not in top visible) */}
        {!loading && leaderboard.length > 0 && (
          <div className="mt-8 bg-indigo-600 text-white rounded-xl p-6 text-center">
            <p className="text-sm text-indigo-100 mb-1">Your Current Rank</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl font-bold">
                #{leaderboard.findIndex(p => p._id === user?._id) + 1 || '—'}
              </span>
              <div className="text-left">
                <p className="text-lg font-semibold">{user?.xp || 0} XP</p>
                <p className="text-sm text-indigo-200">Level {user?.level || 1}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
