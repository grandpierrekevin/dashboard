/**
 * Données mockées pour GitLab
 * Utilise les données communes de common.ts pour éviter la duplication
 */

import type { GitlabProject } from "@/types/gitlab";
import { mockGithubCommits, mockGithubPRs, mockGithubIssues } from "./common";

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
    recentMRs: mockGithubPRs,
    recentIssues: mockGithubIssues
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
    recentMRs: mockGithubPRs,
    recentIssues: mockGithubIssues
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
    recentMRs: mockGithubPRs,
    recentIssues: mockGithubIssues
  }
]; 