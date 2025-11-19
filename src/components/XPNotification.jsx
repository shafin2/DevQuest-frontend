import { useEffect, useState } from 'react';

const XPNotification = ({ xp, levelUp, level, badges = [], onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 10);
    
    // Auto-close after 5 seconds (increased for badges)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {levelUp ? (
        // Level Up Notification
        <div className="bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-xl shadow-2xl p-6 max-w-sm border-4 border-yellow-300 animate-bounce">
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="absolute -top-1 -right-1 bg-white text-yellow-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                ⬆
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">🎉 LEVEL UP!</h3>
              <p className="text-lg font-semibold">You are now Level {level}!</p>
              <p className="text-sm text-yellow-100 mt-1">+{xp} XP Earned</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t-2 border-yellow-300/50">
            <p className="text-sm font-medium text-center">Keep conquering quests, mighty adventurer! ⚔️</p>
            {badges.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-yellow-100 mb-2">New Badges Earned:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {badges.map((badge, index) => (
                    <div key={index} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-1">
                      <span className="text-lg">{badge.icon}</span>
                      <span className="text-xs font-semibold">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // XP Gain Notification
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl p-5 max-w-sm border-2 border-indigo-400">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">+{xp} XP!</h3>
              <p className="text-sm text-indigo-100">Task completed successfully! 🎯</p>
              {badges.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {badges.map((badge, index) => (
                    <span key={index} className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
                      {badge.icon} {badge.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default XPNotification;
