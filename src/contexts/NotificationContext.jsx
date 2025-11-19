import { createContext, useContext, useState } from 'react';
import XPNotification from '../components/XPNotification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showXPNotification = (xp, levelUp = false, level = null, badges = []) => {
    setNotification({ xp, levelUp, level, badges });
  };

  const showNotification = (message, type = 'info') => {
    // For now, show alert - can be enhanced with a toast component later
    if (type === 'error') {
      console.error(message);
    } else if (type === 'success') {
      console.log(message);
    }
    // You can implement a proper toast notification here
    alert(message);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showXPNotification, showNotification }}>
      {children}
      {notification && (
        <XPNotification
          xp={notification.xp}
          levelUp={notification.levelUp}
          level={notification.level}
          badges={notification.badges}
          onClose={closeNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};
