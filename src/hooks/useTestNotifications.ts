import { useEffect } from 'react';
import { useNotifications } from '@/context/NotificationsContext';

/**
 * Hook pour ajouter des notifications de test
 * À utiliser uniquement en développement
 */
export function useTestNotifications() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Ajouter quelques notifications de test
    const testNotifications = [
      {
        type: 'info' as const,
        title: 'Bienvenue !',
        message: 'Bienvenue sur votre dashboard DevOps',
      },
      {
        type: 'success' as const,
        title: 'Intégration réussie',
        message: 'GitHub a été connecté avec succès',
      },
      {
        type: 'warning' as const,
        title: 'Attention',
        message: 'Certains builds Jenkins sont en échec',
      },
      {
        type: 'error' as const,
        title: 'Erreur critique',
        message: 'Le service SonarQube est indisponible',
      },
    ];

    // Ajouter les notifications avec un délai
    testNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification);
      }, index * 1000); // Une notification par seconde
    });
  }, [addNotification]);
} 