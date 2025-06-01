export interface GitlabRepoActivity {
  repo: string;
  commits: number;
  date: string;
}

export interface GitlabData {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  recentPipelines: Pipeline[];
  recentMRs: MergeRequest[];
  recentIssues: Issue[];
  stats: ProjectStats;
  activity: GitlabRepoActivity[];
}

export interface Pipeline {
  id: number;
  status: 'success' | 'failed' | 'running' | 'pending';
  branch: string;
  author: string;
  startedAt: string;
  finishedAt: string;
  duration: number;
  stages: PipelineStage[];
  details: PipelineDetails;
}

export interface PipelineStage {
  name: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  duration: number;
}

export interface PipelineDetails {
  commit: {
    id: string;
    message: string;
    author: string;
  };
  artifacts: Artifact[];
}

export interface Artifact {
  name: string;
  size: string;
  type: string;
}

export interface MergeRequest {
  id: number;
  title: string;
  author: string;
  status: 'open' | 'closed' | 'merged';
  reviewers: string[];
  comments: number;
  createdAt: string;
  details: MRDetails;
}

export interface MRDetails {
  description: string;
  changes: {
    filesChanged: number;
    additions: number;
    deletions: number;
  };
  comments: MRComment[];
}

export interface MRComment {
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

export interface ProjectStats {
  totalPipelines: number;
  totalMRs: number;
  totalIssues: number;
  contributors: number;
  lastUpdated: string;
} 