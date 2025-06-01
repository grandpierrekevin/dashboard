export interface GitlabPipeline {
  id: string;
  name: string;
  status: "success" | "failed" | "running";
  duration: number;
  date: string;
  branch: string;
  author: string;
  commit: string;
  canRetry?: boolean;
}

export interface JenkinsBuild {
  id: string;
  name: string;
  status: "success" | "failed" | "running";
  duration: number;
  date: string;
  job: string;
  branch: string;
  canRetry?: boolean;
  consoleUrl?: string;
}

export interface GithubRepoActivity {
  repo: string;
  commits: number;
  prs: number;
  issues: number;
  recentCommits: GithubCommit[];
  recentPRs: GithubPR[];
  recentIssues: GithubIssue[];
}

export interface GithubCommit {
  id: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  filesChanged: number;
  additions: number;
  deletions: number;
}

export interface GithubPR {
  id: string;
  title: string;
  author: string;
  date: string;
  status: "open" | "merged" | "closed";
  reviewers: string[];
  comments: number;
}

export interface GithubIssue {
  id: string;
  title: string;
  author: string;
  date: string;
  status: "open" | "closed";
  labels: string[];
  comments: number;
}

export interface JiraTicket {
  id: string;
  ticket: string;
  title: string;
  status: "To Do" | "In Progress" | "Done";
  assignee: string;
  priority: "High" | "Medium" | "Low";
  type: "Bug" | "Feature" | "Task";
  created: string;
  updated: string;
  comments: JiraComment[];
}

export interface JiraComment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface SonarMetric {
  name: string;
  value: number;
  issues?: SonarIssue[];
}

export interface SonarIssue {
  id: string;
  type: "bug" | "vulnerability" | "code_smell";
  severity: "blocker" | "critical" | "major" | "minor";
  component: string;
  line: number;
  message: string;
  status: "open" | "resolved";
  date: string;
} 