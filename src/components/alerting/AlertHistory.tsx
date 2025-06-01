import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useIntegrations } from '@/context/IntegrationsContext';
import { VirtualizedList } from "@/components/ui/virtualized-list";

interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'resolved' | 'acknowledged';
  timestamp: string;
  details: {
    tool: string;
    metric: string;
    value: string | number;
  }[];
}

const SEVERITY_COLORS = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
};

const STATUS_COLORS = {
  active: 'bg-red-500',
  acknowledged: 'bg-yellow-500',
  resolved: 'bg-green-500',
};

const TOOL_LABELS = {
  github: 'GitHub',
  gitlab: 'GitLab',
  jenkins: 'Jenkins',
  jira: 'Jira',
  sonarqube: 'SonarQube',
};

export function AlertHistory() {
  const { integrations } = useIntegrations();
  const activeIntegrations = integrations.filter(i => i.active);

  // Simuler des données d'alerte
  const mockAlerts = [
    {
      id: 1,
      ruleName: "Pipeline en échec",
      severity: "high",
      status: "active",
      timestamp: new Date().toISOString(),
      details: [
        { tool: "jenkins", metric: "Build", value: "Échec" },
        { tool: "gitlab", metric: "Pipeline", value: "Échec" },
      ],
    },
    // ... autres alertes
  ];

  const renderAlert = (alert: any) => (
    <Card key={alert.id} className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{alert.ruleName}</h3>
            <Badge className={SEVERITY_COLORS[alert.severity]}>
              {alert.severity}
            </Badge>
            <Badge className={STATUS_COLORS[alert.status]}>
              {alert.status}
            </Badge>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Détails :</h4>
            <div className="grid gap-2">
              {alert.details.map((detail: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{TOOL_LABELS[detail.tool]}</span>
                  <span>{detail.metric}</span>
                  <span className="text-gray-500">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {new Date(alert.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Historique des Alertes</h2>
      <VirtualizedList
        items={mockAlerts}
        height={600}
        itemHeight={200}
        renderItem={renderAlert}
        className="space-y-4"
      />
    </div>
  );
} 