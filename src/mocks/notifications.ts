/**
 * Types et données mockées pour les notifications
 */

import type { Notification } from "@/types/notifications";

/**
 * Données mockées pour les notifications
 * Utilisées pour le développement et les tests
 */
export const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "Le pipeline #123 a été exécuté avec succès",
    date: "2024-06-28T10:30:00Z",
    read: false
  },
  {
    id: 2,
    message: "Le pipeline #124 a échoué",
    date: "2024-06-28T09:15:00Z",
    read: false
  },
  {
    id: 3,
    message: "Une PR attend votre review",
    date: "2024-06-27T16:45:00Z",
    read: true
  },
  {
    id: 4,
    message: "Une nouvelle issue a été créée",
    date: "2024-06-27T14:20:00Z",
    read: true
  }
]; 