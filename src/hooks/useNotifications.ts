import { useState, useEffect } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  date?: string;
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    title: 'Jenkins',
    message: 'Jobs Jenkins en échec',
    type: 'error',
    read: false,
    date: new Date().toISOString()
  },
  {
    id: '2',
    title: 'GitHub',
    message: 'Pull request #123 à revoir',
    type: 'warning',
    read: false,
    date: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Déploiement',
    message: 'Déploiement réussi sur staging',
    type: 'success',
    read: false,
    date: new Date().toISOString()
  }
];

interface UseNotificationsOptions {
  initialNotifications?: Notification[];
}

/**
 * Hook pour gérer les notifications avec persistance locale.
 * @param options Options de configuration du hook
 * @returns {object} notifications, addNotification, removeNotification, markAsRead, markAllAsRead
 */
export function useNotifications(options: UseNotificationsOptions = {}) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem("notifications");
      if (saved) return JSON.parse(saved);
    } catch {}
    return options.initialNotifications || defaultNotifications;
  });

  useEffect(() => {
    try {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  function addNotification(notification: Omit<Notification, 'id' | 'date' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(list => [newNotification, ...list]);
  }

  function removeNotification(id: string) {
    setNotifications(list => list.filter(n => n.id !== id));
  }

  function markAsRead(id: string) {
    setNotifications(list => list.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllAsRead() {
    setNotifications(list => list.map(n => ({ ...n, read: true })));
  }

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
  };
} 