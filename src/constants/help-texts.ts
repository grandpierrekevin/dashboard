export const HELP_TEXTS = {
  correlation: {
    overview: "La page de corrélation vous permet de créer et gérer des règles qui connectent vos différents outils DevOps. Ces règles automatisent les actions entre vos outils en fonction des événements.",
    rules: "Les règles de corrélation définissent comment les événements d'un outil source déclenchent des actions dans un outil cible. Vous pouvez créer, modifier et supprimer des règles selon vos besoins.",
    timeline: "La timeline affiche l'historique des événements corrélés, vous permettant de suivre l'exécution de vos règles et de diagnostiquer les problèmes potentiels.",
    source: {
      tool: "Sélectionnez l'outil source qui déclenchera la règle de corrélation.",
      metric: "Choisissez la métrique à surveiller dans l'outil source.",
      operator: "Définissez l'opérateur de comparaison pour la condition.",
      value: "Entrez la valeur à comparer avec la métrique.",
    },
    target: {
      tool: "Sélectionnez l'outil cible qui recevra l'action.",
      metric: "Choisissez la métrique sur laquelle l'action sera appliquée.",
      action: "Définissez l'action à exécuter dans l'outil cible.",
    },
  },
  integrations: {
    github: "Connectez votre compte GitHub pour suivre les commits, pull requests et issues.",
    gitlab: "Connectez votre compte GitLab pour suivre les commits, merge requests et issues.",
    jenkins: "Connectez votre instance Jenkins pour suivre les builds et déploiements.",
    jira: "Connectez votre instance Jira pour gérer les tickets et sprints.",
    sonarqube: "Connectez votre instance SonarQube pour suivre la qualité du code.",
  },
  dashboard: {
    overview: "Vue d'ensemble de toutes vos intégrations et métriques.",
    activities: "Historique des activités récentes dans vos outils connectés.",
    alerts: "Alertes et notifications importantes.",
  },
  settings: {
    profile: "Gérez vos informations personnelles et préférences.",
    notifications: "Configurez vos préférences de notification.",
    security: "Gérez vos paramètres de sécurité et d'authentification.",
  },
} as const; 