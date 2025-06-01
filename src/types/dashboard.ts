import { Integration } from './integrations';

export interface ChartData {
  name: string;
  value: number;
}

export interface JenkinsJob {
  name: string;
  ok: number;
  ko: number;
}

export interface JiraTicket {
  name: string;
  tickets: number;
}

export interface DashboardData {
  github: ChartData[];
  gitlab: ChartData[];
  jenkins: ChartData[];
  jira: JiraTicket[];
  sonar: ChartData[];
  alerts: string[];
}

export interface KPI {
  label: string;
  value: number;
  color: string;
  show: boolean;
} 