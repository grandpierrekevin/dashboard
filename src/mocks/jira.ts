import { JiraData } from "@/types/jira";

export const mockJiraData: JiraData[] = [
  {
    id: "TCK-1",
    title: "Corriger le bug d'affichage",
    ticket: "TCK-1",
    status: "To Do",
    priority: "High",
    type: "Bug",
    assignee: "Alice",
    created: "2024-05-01T09:00:00Z",
    updated: "2024-05-02T10:00:00Z",
    comments: [
      { author: "Bob", message: "À corriger rapidement", date: "2024-05-01T10:00:00Z" }
    ]
  },
  {
    id: "TCK-2",
    title: "Ajouter une nouvelle fonctionnalité",
    ticket: "TCK-2",
    status: "In Progress",
    priority: "Medium",
    type: "Feature",
    assignee: "Bob",
    created: "2024-05-02T11:00:00Z",
    updated: "2024-05-03T12:00:00Z",
    comments: []
  },
  {
    id: "TCK-3",
    title: "Optimiser la requête SQL lente",
    ticket: "TCK-3",
    status: "Done",
    priority: "Low",
    type: "Task",
    assignee: "Charlie",
    created: "2024-05-03T13:00:00Z",
    updated: "2024-05-04T14:00:00Z",
    comments: [
      { author: "Alice", message: "Optimisation validée en prod", date: "2024-05-04T15:00:00Z" },
      { author: "Bob", message: "Merci pour la rapidité !", date: "2024-05-04T16:00:00Z" }
    ]
  }
]; 