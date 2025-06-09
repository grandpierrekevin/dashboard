import { CorrelationRule, ToolType, MetricType, OperatorType, ActionType } from "@/types/correlation";

export const mockCorrelationRules: CorrelationRule[] = [
  {
    id: "rule-1",
    name: "Alerte SonarQube vers Jenkins",
    description: "Déclenche un build Jenkins quand SonarQube détecte des vulnérabilités critiques",
    enabled: true,
    createdAt: new Date("2024-03-20T10:00:00Z"),
    updatedAt: new Date("2024-03-20T10:00:00Z"),
    source: {
      tool: ToolType.SONARQUBE,
      metric: MetricType.VULNERABILITIES,
      condition: {
        operator: OperatorType.GREATER_THAN,
        value: 2
      }
    },
    target: {
      tool: ToolType.JENKINS,
      action: ActionType.TRIGGER_BUILD,
      parameters: {
        jobName: "security-scan",
        branch: "main"
      }
    }
  },
  {
    id: "rule-2",
    name: "Alerte Jenkins vers Jira",
    description: "Crée un ticket Jira quand un build Jenkins échoue",
    enabled: true,
    createdAt: new Date("2024-03-20T11:00:00Z"),
    updatedAt: new Date("2024-03-20T11:00:00Z"),
    source: {
      tool: ToolType.JENKINS,
      metric: MetricType.BUILD_STATUS,
      condition: {
        operator: OperatorType.EQUALS,
        value: "failed"
      }
    },
    target: {
      tool: ToolType.JIRA,
      action: ActionType.CREATE_ISSUE,
      parameters: {
        project: "TCK",
        type: "Bug",
        priority: "High",
        title: "Build Jenkins échoué",
        description: "Un build Jenkins a échoué et nécessite une investigation"
      }
    }
  }
];

export const mockCorrelationResults = [
  {
    id: "result-1",
    ruleId: "rule-1",
    sourceData: {
      project: "backend-api",
      vulnerabilities: 3,
      timestamp: "2024-03-22T11:00:00Z"
    },
    targetData: {
      jobName: "security-scan",
      buildNumber: 51,
      status: "triggered",
      timestamp: "2024-03-22T11:05:00Z"
    },
    status: "success",
    timestamp: "2024-03-22T11:05:00Z"
  },
  {
    id: "result-2",
    ruleId: "rule-2",
    sourceData: {
      jobName: "build-app",
      buildNumber: 100,
      status: "failed",
      timestamp: "2024-03-20T10:10:00Z"
    },
    targetData: {
      ticketId: "TCK-1",
      status: "created",
      timestamp: "2024-03-20T10:15:00Z"
    },
    status: "success",
    timestamp: "2024-03-20T10:15:00Z"
  }
]; 