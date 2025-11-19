import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';
import { useNavigate } from 'react-router-dom';

const InvitesPage = () => {
  const { user, isPM, isDeveloper } = useAuth();
  const navigate = useNavigate();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const response = await projectService.getMyInvites();
      setInvites(response.data.invites);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load invites');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async (token) => {
    try {
      setProcessingId(token);
      setError('');
      await projectService.acceptInvite(token);
      
      // Remove accepted invite from list
      setInvites(prev => prev.filter(inv => inv.token !== token));
      
      // Show success message and redirect
      setTimeout(() => {
        navigate('/projects');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept invitation');
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'pm') {
      return '⚔️';
    }
    return '🗡️';
  };

  const getRoleTitle = (role) => {
    if (role === 'pm') {
      return 'Guild Master';
    }
    return 'Adventurer';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            📬 Quest Invitations
          </h1>
          <p className="text-gray-600 mt-1">
            {isPM && "You've been invited to lead these quests"}
            {isDeveloper && "You've been invited to join these adventures"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Invites List */}
        {invites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending invitations</h3>
            <p className="text-gray-600">
              When someone invites you to a project, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div
                key={invite._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Role Badge */}
                    <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      <span>{getRoleIcon(invite.role)}</span>
                      <span>{getRoleTitle(invite.role)}</span>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {invite.project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {invite.project.description}
                    </p>

                    {/* Tech Stack */}
                    {invite.project.techStack && invite.project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {invite.project.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-md font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Invited by <strong>{invite.invitedBy.name}</strong></span>
                      </div>
                      
                      {invite.project.budget && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Budget: <strong>${invite.project.budget.toLocaleString()}</strong></span>
                        </div>
                      )}

                      {invite.project.deadline && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Due: <strong>{new Date(invite.project.deadline).toLocaleDateString()}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accept Button */}
                  <div className="shrink-0">
                    <button
                      onClick={() => handleAcceptInvite(invite.token)}
                      disabled={processingId === invite.token}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                    >
                      {processingId === invite.token ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Accepting...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Accept Quest
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expiry Warning */}
                {invite.expiresAt && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Expires on {new Date(invite.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitesPage;
