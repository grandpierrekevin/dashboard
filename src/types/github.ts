export interface GithubData {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  recentCommits: Commit[];
  recentPRs: PullRequest[];
  recentIssues: Issue[];
  stats: RepoStats;
  activity: GithubRepoActivity[];
}

export interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  status: 'success' | 'failed' | 'pending';
  details: CommitDetails;
}

export interface CommitDetails {
  filesChanged: number;
  additions: number;
  deletions: number;
  changedFiles: ChangedFile[];
}

export interface ChangedFile {
  name: string;
  status: 'added' | 'modified' | 'deleted';
}

export interface PullRequest {
  id: number;
  title: string;
  author: string;
  status: 'open' | 'closed' | 'merged';
  reviewers: string[];
  comments: number;
  createdAt: string;
  details: PRDetails;
}

export interface PRDetails {
  description: string;
  changes: {
    filesChanged: number;
    additions: number;
    deletions: number;
  };
  comments: PRComment[];
}

export interface PRComment {
  id: number;
  author: string;
  content: string;
  date: string;
}

export interface Issue {
  id: number;
  title: string;
  author: string;
  status: 'open' | 'closed';
  assignee: string;
  labels: string[];
  createdAt: string;
  details: IssueDetails;
}

export interface IssueDetails {
  description: string;
  comments: IssueComment[];
}

export interface IssueComment {
  id: number;
  author: string;
  content: string;
  date: string;
}

export interface RepoStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  contributors: number;
  lastUpdated: string;
}

export interface GithubRepoActivity {
  repo: string;
  commits: number;
  date: string;
} 