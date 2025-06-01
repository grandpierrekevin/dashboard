export type ToolType = 'github' | 'gitlab' | 'jenkins' | 'jira' | 'sonarqube';

export const TOOL_LABELS: Record<ToolType, string> = {
  github: 'GitHub',
  gitlab: 'GitLab',
  jenkins: 'Jenkins',
  jira: 'Jira',
  sonarqube: 'SonarQube',
};

export const TOOL_METRICS: Record<ToolType, string[]> = {
  github: ['commit', 'pull_request', 'issue', 'release'],
  gitlab: ['commit', 'merge_request', 'issue', 'release'],
  jenkins: ['build', 'deployment', 'test_result'],
  jira: ['issue', 'sprint', 'epic', 'story'],
  sonarqube: ['quality_gate', 'code_coverage', 'code_smell', 'bug', 'vulnerability'],
}; 