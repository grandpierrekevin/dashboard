/**
 * Données de test communes utilisées par plusieurs mocks
 * Ces données sont réutilisées pour éviter la duplication
 */

import type { 
  GithubCommit,
  GithubPR,
  GithubIssue,
  JiraComment
} from "@/types/mocks";

export const mockGithubCommits: GithubCommit[] = [
  {
    id: "c1",
    message: "feat: add authentication system",
    author: "Alice Smith",
    date: "2024-06-28",
    branch: "main",
    filesChanged: 12,
    additions: 450,
    deletions: 120
  },
  {
    id: "c2",
    message: "fix: resolve login bug",
    author: "Bob Johnson",
    date: "2024-06-27",
    branch: "feature/auth",
    filesChanged: 3,
    additions: 50,
    deletions: 20
  }
];

export const mockGithubPRs: GithubPR[] = [
  {
    id: "pr1",
    title: "Implement OAuth2 authentication",
    author: "Alice Smith",
    date: "2024-06-28",
    status: "open",
    reviewers: ["Bob Johnson", "Charlie Brown"],
    comments: 5
  },
  {
    id: "pr2",
    title: "Fix login form validation",
    author: "Bob Johnson",
    date: "2024-06-27",
    status: "merged",
    reviewers: ["Alice Smith"],
    comments: 2
  }
];

export const mockGithubIssues: GithubIssue[] = [
  {
    id: "i1",
    title: "Login page not responsive on mobile",
    author: "Charlie Brown",
    date: "2024-06-28",
    status: "open",
    labels: ["bug", "frontend"],
    comments: 3
  },
  {
    id: "i2",
    title: "Add password reset functionality",
    author: "Diana Prince",
    date: "2024-06-27",
    status: "closed",
    labels: ["feature", "security"],
    comments: 1
  }
];

export const mockJiraComments: JiraComment[] = [
  {
    id: "jc1",
    author: "Alice Smith",
    content: "Working on the implementation",
    date: "2024-06-28"
  },
  {
    id: "jc2",
    author: "Bob Johnson",
    content: "Please review the changes",
    date: "2024-06-27"
  }
]; 