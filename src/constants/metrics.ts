import type { ToolType } from './tools';

export type MetricType =
  | 'commit'
  | 'pull_request'
  | 'merge_request'
  | 'issue'
  | 'release'
  | 'build'
  | 'deployment'
  | 'test_result'
  | 'sprint'
  | 'epic'
  | 'story'
  | 'quality_gate'
  | 'code_coverage'
  | 'code_smell'
  | 'bug'
  | 'vulnerability';

export const METRIC_LABELS: Record<MetricType, string> = {
  commit: 'Commit',
  pull_request: 'Pull Request',
  merge_request: 'Merge Request',
  issue: 'Ticket',
  release: 'Release',
  build: 'Build',
  deployment: 'Déploiement',
  test_result: 'Résultat de test',
  sprint: 'Sprint',
  epic: 'Epic',
  story: 'Story',
  quality_gate: 'Quality Gate',
  code_coverage: 'Couverture de code',
  code_smell: 'Code Smell',
  bug: 'Bug',
  vulnerability: 'Vulnérabilité',
};

export const TOOL_METRICS: Record<ToolType, MetricType[]> = {
  github: ['commit', 'pull_request', 'issue', 'release'],
  gitlab: ['commit', 'merge_request', 'issue', 'release'],
  jenkins: ['build', 'deployment', 'test_result'],
  jira: ['issue', 'sprint', 'epic', 'story'],
  sonarqube: ['quality_gate', 'code_coverage', 'code_smell', 'bug', 'vulnerability'],
}; 