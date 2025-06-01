export interface JenkinsActivity {
  job: string;
  builds: number;
  date: string;
}

export interface JenkinsData {
  id: number;
  name: string;
  description: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  lastBuild: Build;
  recentBuilds: BuildSummary[];
  stats: JobStats;
  activity: JenkinsActivity[];
}

export interface Build {
  id: number;
  number: number;
  status: 'success' | 'failed' | 'running' | 'pending';
  startedAt: string;
  finishedAt: string;
  duration: number;
  stages: BuildStage[];
  artifacts: Artifact[];
  changes: BuildChange[];
}

export interface BuildSummary {
  id: number;
  number: number;
  status: 'success' | 'failed' | 'running' | 'pending';
  startedAt: string;
  finishedAt: string;
  duration: number;
  stages: BuildStageSummary[];
}

export interface BuildStage {
  name: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  duration: number;
  logs: string;
  error?: string;
}

export interface BuildStageSummary {
  name: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  duration: number;
}

export interface Artifact {
  name: string;
  size: string;
  type: string;
}

export interface BuildChange {
  commit: string;
  author: string;
  message: string;
}

export interface JobStats {
  totalBuilds: number;
  successRate: number;
  averageDuration: number;
  lastUpdated: string;
} 