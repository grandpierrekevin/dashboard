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
    id: "n1",
    type: "success",
    title: "Pipeline réussi",
    message: "Le pipeline #123 a été exécuté avec succès",
    date: "2024-06-28T10:30:00Z",
    read: false,
    link: "/gitlab/pipelines/123"
  },
  {
    id: "n2",
    type: "error",
    title: "Pipeline échoué",
    message: "Le pipeline #124 a échoué",
    date: "2024-06-28T09:15:00Z",
    read: false,
    link: "/gitlab/pipelines/124"
  },
  {
    id: "n3",
    type: "warning",
    title: "Pull Request en attente",
    message: "Une PR attend votre review",
    date: "2024-06-27T16:45:00Z",
    read: true,
    link: "/github/pulls/456"
  },
  {
    id: "n4",
    type: "info",
    title: "Nouvelle issue",
    message: "Une nouvelle issue a été créée",
    date: "2024-06-27T14:20:00Z",
    read: true,
    link: "/jira/issues/789"
  }
]; 