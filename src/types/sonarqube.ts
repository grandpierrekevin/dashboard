export interface SonarActivity {
  project: string;
  issues: number;
  date: string;
}

export interface SonarData {
  id: number;
  name: string;
  description: string;
  lastAnalysis: string;
  qualityGate: QualityGate;
  metrics: ProjectMetrics;
  issues: Issue[];
  hotspots: Hotspot[];
  stats: ProjectStats;
  activity: SonarActivity[];
}

export interface QualityGate {
  status: 'passed' | 'failed';
  conditions: QualityGateCondition[];
}

export interface QualityGateCondition {
  metric: string;
  status: 'passed' | 'failed';
  value: number;
  threshold: number;
}

export interface ProjectMetrics {
  coverage: number;
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  duplications: number;
  lines: number;
  ncloc: number;
}

export interface Issue {
  id: string;
  type: 'bug' | 'vulnerability' | 'code_smell';
  severity: 'blocker' | 'critical' | 'major' | 'minor' | 'info';
  component: string;
  line: number;
  message: string;
  author: string;
  creationDate: string;
  status: 'open' | 'confirmed' | 'resolved' | 'closed';
  resolution: string | null;
  details: IssueDetails;
}

export interface IssueDetails {
  rule: {
    key: string;
    name: string;
    description: string;
  };
  effort: string;
  tags: string[];
}

export interface Hotspot {
  id: string;
  component: string;
  line: number;
  message: string;
  author: string;
  creationDate: string;
  status: 'to_review' | 'reviewed' | 'fixed';
  resolution: string | null;
  details: HotspotDetails;
}

export interface HotspotDetails {
  rule: {
    key: string;
    name: string;
    description: string;
  };
  effort: string;
  tags: string[];
}

export interface ProjectStats {
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  totalHotspots: number;
  toReviewHotspots: number;
  reviewedHotspots: number;
  lastUpdated: string;
} 