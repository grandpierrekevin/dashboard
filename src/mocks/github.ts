/**
 * Données mockées pour GitHub
 * Utilise les données communes de common.ts pour éviter la duplication
 */

import type { GithubRepoActivity } from "@/types/mocks";
import { mockGithubCommits, mockGithubPRs, mockGithubIssues } from "./common";

/**
 * Données mockées pour les repositories GitHub
 */
export const mockGithubData = [
  {
    id: "repo-1",
    repo: "my-app",
    stars: 120,
    commits: 50,
    prs: 10,
    issues: 5
  },
  {
    id: "repo-2",
    repo: "my-lib",
    stars: 80,
    commits: 30,
    prs: 5,
    issues: 2
  }
];

/**
 * Données mockées pour les graphiques GitHub
 */
export const mockGithubChartData = [
  { date: "2024-06-22", value: 12 },
  { date: "2024-06-23", value: 15 },
  { date: "2024-06-24", value: 10 },
  { date: "2024-06-25", value: 18 },
  { date: "2024-06-26", value: 14 },
  { date: "2024-06-27", value: 20 },
  { date: "2024-06-28", value: 16 }
]; 