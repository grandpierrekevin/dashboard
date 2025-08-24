/**
 * Données mockées pour GitLab
 * Utilise les données communes de common.ts pour éviter la duplication
 */

import type { GitlabProject, Pipeline, MergeRequest } from "@/types/gitlab";
import { mockGithubCommits, mockGithubIssues } from "./common";

// Pipelines mockés pour tous les projets
const mockPipelines: Pipeline[] = [
  {
    id: 1,
    status: "success",
    branch: "main",
    author: "Alice",
    startedAt: "2024-06-28T09:00:00Z",
    finishedAt: "2024-06-28T09:10:00Z",
    duration: 600,
    stages: [
      { name: "Install", status: "success", duration: 120 },
      { name: "Build", status: "success", duration: 300 },
      { name: "Test", status: "success", duration: 180 },
    ],
    details: {
      commit: { id: "abc123", message: "feat: add CI", author: "Alice" },
      artifacts: [
        { name: "build.zip", size: "2MB", type: "application/zip" }
      ]
    }
  },
  {
    id: 2,
    status: "failed",
    branch: "develop",
    author: "Bob",
    startedAt: "2024-06-27T14:00:00Z",
    finishedAt: "2024-06-27T14:12:00Z",
    duration: 720,
    stages: [
      { name: "Install", status: "success", duration: 120 },
      { name: "Build", status: "failed", duration: 600 },
    ],
    details: {
      commit: { id: "def456", message: "fix: pipeline error", author: "Bob" },
      artifacts: []
    }
  },
  {
    id: 3,
    status: "running",
    branch: "feature/api",
    author: "Charlie",
    startedAt: "2024-06-28T15:00:00Z",
    finishedAt: "",
    duration: 0,
    stages: [
      { name: "Install", status: "success", duration: 60 },
      { name: "Build", status: "running", duration: 0 },
    ],
    details: {
      commit: { id: "ghi789", message: "chore: update deps", author: "Charlie" },
      artifacts: []
    }
  }
];

// Merge Requests mockées au format GitLab
const mockGitlabMRs: MergeRequest[] = [
  {
    id: 1,
    title: "Ajout de l'authentification OAuth2",
    author: "Alice",
    status: "open",
    reviewers: ["Bob", "Charlie"],
    comments: 3,
    createdAt: "2024-06-28T10:00:00Z",
    details: {
      description: "Implémentation complète de l'OAuth2 pour l'application.",
      changes: {
        filesChanged: 8,
        additions: 320,
        deletions: 45
      },
      comments: [
        { id: 1, author: "Bob", content: "Super boulot !", date: "2024-06-28T11:00:00Z" },
        { id: 2, author: "Charlie", content: "Quelques suggestions mineures.", date: "2024-06-28T12:00:00Z" }
      ]
    }
  },
  {
    id: 2,
    title: "Correction du bug sur le formulaire de login",
    author: "Bob",
    status: "merged",
    reviewers: ["Alice"],
    comments: 1,
    createdAt: "2024-06-27T09:00:00Z",
    details: {
      description: "Fix du bug empêchant la connexion sur mobile.",
      changes: {
        filesChanged: 2,
        additions: 20,
        deletions: 5
      },
      comments: [
        { id: 3, author: "Alice", content: "Merci pour la correction !", date: "2024-06-27T10:00:00Z" }
      ]
    }
  },
  {
    id: 3,
    title: "Refactorisation du module API",
    author: "Charlie",
    status: "closed",
    reviewers: ["Alice", "Bob"],
    comments: 0,
    createdAt: "2024-06-26T15:00:00Z",
    details: {
      description: "Refactor complet pour améliorer la maintenabilité.",
      changes: {
        filesChanged: 12,
        additions: 200,
        deletions: 100
      },
      comments: []
    }
  }
];

/**
 * Données mockées pour les projets GitLab
 */
export const mockGitlabData: GitlabProject[] = [
  {
    id: "p1",
    name: "frontend",
    description: "Frontend application",
    url: "https://gitlab.com/org/frontend",
    stars: 95,
    forks: 35,
    language: "TypeScript",
    lastUpdated: "2024-06-28",
    stats: {
      totalCommits: 980,
      totalMRs: 124,
      totalIssues: 67,
      contributors: 10,
      lastUpdated: "2024-06-28"
    },
    recentCommits: mockGithubCommits,
    recentMRs: mockGitlabMRs,
    recentIssues: mockGithubIssues,
    recentPipelines: mockPipelines,
    activity: [
      { date: "Lun", commits: 15, mrs: 4, issues: 3 },
      { date: "Mar", commits: 20, mrs: 6, issues: 4 },
      { date: "Mer", commits: 12, mrs: 3, issues: 2 },
      { date: "Jeu", commits: 18, mrs: 5, issues: 3 },
      { date: "Ven", commits: 10, mrs: 2, issues: 1 },
      { date: "Sam", commits: 5, mrs: 1, issues: 0 },
      { date: "Dim", commits: 3, mrs: 0, issues: 0 }
    ]
  },
  {
    id: "p2",
    name: "backend",
    description: "Backend API",
    url: "https://gitlab.com/org/backend",
    stars: 65,
    forks: 28,
    language: "Python",
    lastUpdated: "2024-06-27",
    stats: {
      totalCommits: 750,
      totalMRs: 98,
      totalIssues: 45,
      contributors: 7,
      lastUpdated: "2024-06-27"
    },
    recentCommits: mockGithubCommits,
    recentMRs: mockGitlabMRs,
    recentIssues: mockGithubIssues,
    recentPipelines: mockPipelines,
    activity: [
      { date: "Lun", commits: 10, mrs: 3, issues: 2 },
      { date: "Mar", commits: 14, mrs: 4, issues: 3 },
      { date: "Mer", commits: 8, mrs: 2, issues: 1 },
      { date: "Jeu", commits: 12, mrs: 3, issues: 2 },
      { date: "Ven", commits: 7, mrs: 1, issues: 1 },
      { date: "Sam", commits: 4, mrs: 1, issues: 0 },
      { date: "Dim", commits: 2, mrs: 0, issues: 0 }
    ]
  },
  {
    id: "p3",
    name: "infra",
    description: "Infrastructure as Code",
    url: "https://gitlab.com/org/infra",
    stars: 35,
    forks: 15,
    language: "Terraform",
    lastUpdated: "2024-06-26",
    stats: {
      totalCommits: 320,
      totalMRs: 56,
      totalIssues: 32,
      contributors: 4,
      lastUpdated: "2024-06-26"
    },
    recentCommits: mockGithubCommits,
    recentMRs: mockGitlabMRs,
    recentIssues: mockGithubIssues,
    recentPipelines: mockPipelines,
    activity: [
      { date: "Lun", commits: 6, mrs: 2, issues: 1 },
      { date: "Mar", commits: 8, mrs: 3, issues: 2 },
      { date: "Mer", commits: 5, mrs: 1, issues: 1 },
      { date: "Jeu", commits: 7, mrs: 2, issues: 1 },
      { date: "Ven", commits: 4, mrs: 1, issues: 0 },
      { date: "Sam", commits: 2, mrs: 0, issues: 0 },
      { date: "Dim", commits: 1, mrs: 0, issues: 0 }
    ]
  }
]; 