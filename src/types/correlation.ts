/**
 * Types d'outils supportés par le cockpit DevOps
 */
export enum ToolType {
  GITHUB = 'github',
  GITLAB = 'gitlab',
  JENKINS = 'jenkins',
  JIRA = 'jira',
  SONARQUBE = 'sonarqube'
}

/**
 * Types de métriques disponibles par outil
 */
export enum MetricType {
  // GitHub
  COMMIT = 'commit',
  DEPLOYMENT = 'deployment',
  PULL_REQUEST = 'pull_request',
  
  // GitLab
  PIPELINE = 'pipeline',
  
  // Jenkins
  BUILD = 'build',
  TEST = 'test',
  
  // Jira
  ISSUE = 'issue',
  
  // SonarQube
  COVERAGE = 'coverage',
  CODE_QUALITY = 'code_quality'
}

/**
 * Types d'opérateurs pour les conditions de corrélation
 */
export enum OperatorType {
  GREATER_THAN = '>',
  LESS_THAN = '<',
  EQUALS = '=',
  NOT_EQUALS = '!=',
  CONTAINS = 'contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with'
}

/**
 * Types d'actions disponibles pour les cibles de corrélation
 */
export enum ActionType {
  NOTIFY = 'notify',
  CREATE_ISSUE = 'create_issue',
  TRIGGER_BUILD = 'trigger_build',
  UPDATE_STATUS = 'update_status'
}

/**
 * Configuration de la source d'une règle de corrélation
 */
export interface CorrelationSource {
  tool: ToolType;
  metric: MetricType;
  condition: {
    operator: OperatorType;
    value: string;
  };
}

/**
 * Configuration de la cible d'une règle de corrélation
 */
export interface CorrelationTarget {
  tool: ToolType;
  metric: MetricType;
  action: ActionType;
  config: Record<string, unknown>;
}

/**
 * Règle de corrélation complète
 */
export interface CorrelationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  source: CorrelationSource;
  target: CorrelationTarget;
  createdAt: string;
  updatedAt: string;
}

/**
 * Résultat d'une corrélation
 */
export interface CorrelationResult {
  id: string;
  ruleId: string;
  sourceData: Record<string, unknown>;
  targetData: Record<string, unknown>;
  status: 'success' | 'failure';
  timestamp: string;
}

export interface CorrelationStats {
  totalRules: number;
  activeRules: number;
  successCount: number;
  failureCount: number;
  lastRun: Date;
} 