import { JiraData } from "@/types/jira";

export const mockJiraData: JiraData[] = [
  {
    id: 1,
    name: "Projet Frontend",
    description: "Application frontend principale",
    key: "FRONT",
    issues: [
      {
        id: "FRONT-1",
        key: "FRONT-1",
        title: "Corriger le bug d'affichage",
        type: "bug",
        status: "to_do",
        priority: "high",
        assignee: "Alice",
        reporter: "Bob",
        created: "2024-05-01T09:00:00Z",
        updated: "2024-05-02T10:00:00Z",
        description: "Le bug d'affichage sur la page d'accueil doit être corrigé",
        labels: ["frontend", "bug"],
        components: ["UI"],
        storyPoints: 3,
        comments: [
          {
            id: 1,
            author: "Bob",
            content: "À corriger rapidement",
            created: "2024-05-01T10:00:00Z"
          }
        ],
        subtasks: [],
        transitions: [
          {
            from: "to_do",
            to: "in_progress",
            date: "2024-05-02T10:00:00Z",
            author: "Alice"
          }
        ]
      },
      {
        id: "FRONT-2",
        key: "FRONT-2",
        title: "Ajouter une nouvelle fonctionnalité",
        type: "story",
        status: "in_progress",
        priority: "medium",
        assignee: "Bob",
        reporter: "Alice",
        created: "2024-05-02T11:00:00Z",
        updated: "2024-05-03T12:00:00Z",
        description: "Implémenter la nouvelle fonctionnalité de recherche",
        labels: ["frontend", "feature"],
        components: ["Search"],
        storyPoints: 5,
        comments: [],
        subtasks: [
          {
            id: "FRONT-2.1",
            key: "FRONT-2.1",
            title: "Créer le composant de recherche",
            status: "in_progress",
            assignee: "Bob"
          }
        ],
        transitions: [
          {
            from: "to_do",
            to: "in_progress",
            date: "2024-05-03T12:00:00Z",
            author: "Bob"
          }
        ]
      }
    ],
    sprints: [
      {
        id: 1,
        name: "Sprint 1",
        startDate: "2024-05-01T00:00:00Z",
        endDate: "2024-05-14T23:59:59Z",
        status: "active",
        issues: ["FRONT-1", "FRONT-2"]
      },
      {
        id: 2,
        name: "Sprint 2",
        startDate: "2024-05-15T00:00:00Z",
        endDate: "2024-05-28T23:59:59Z",
        status: "future",
        issues: []
      }
    ],
    stats: {
      totalIssues: 2,
      openIssues: 1,
      inProgressIssues: 1,
      doneIssues: 0,
      velocity: 8,
      lastUpdated: "2024-05-03T12:00:00Z"
    },
    activity: [
      { date: "Lun", tickets: 4 },
      { date: "Mar", tickets: 6 },
      { date: "Mer", tickets: 5 },
      { date: "Jeu", tickets: 7 },
      { date: "Ven", tickets: 3 },
      { date: "Sam", tickets: 2 },
      { date: "Dim", tickets: 1 }
    ]
  }
];

// Ajout d'une activité sur 7 jours pour Jira
export const mockJiraActivity = [
  { date: "Lun", issues: 4 },
  { date: "Mar", issues: 6 },
  { date: "Mer", issues: 5 },
  { date: "Jeu", issues: 7 },
  { date: "Ven", issues: 3 },
  { date: "Sam", issues: 2 },
  { date: "Dim", issues: 1 }
]; 