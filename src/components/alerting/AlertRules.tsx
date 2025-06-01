import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Bell, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { AlertRuleForm } from './AlertRuleForm';

interface AlertRule {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  conditions: {
    tool: string;
    metric: string;
    operator: '>' | '<' | '=' | 'contains';
    value: string | number;
  }[];
  actions: {
    type: 'notification' | 'webhook' | 'email';
    target: string;
  }[];
  enabled: boolean;
}

const SEVERITY_COLORS = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
};

const TOOL_LABELS: Record<string, string> = {
  github: 'GitHub',
  gitlab: 'GitLab',
  jenkins: 'Jenkins',
  jira: 'Jira',
  sonarqube: 'SonarQube',
};

export function AlertRules() {
  const [rules, setRules] = React.useState<AlertRule[]>([
    {
      id: '1',
      name: 'Build échoué après commit',
      description: 'Alerte si un build échoue dans les 5 minutes après un commit',
      severity: 'critical',
      conditions: [
        {
          tool: 'github',
          metric: 'commit',
          operator: '>',
          value: 0,
        },
        {
          tool: 'jenkins',
          metric: 'build_status',
          operator: '=',
          value: 'failure',
        },
      ],
      actions: [
        {
          type: 'notification',
          target: '#devops-alerts',
        },
        {
          type: 'email',
          target: 'team@example.com',
        },
      ],
      enabled: true,
    },
  ]);

  const [selectedRule, setSelectedRule] = React.useState<AlertRule | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreateRule = () => {
    setIsCreating(true);
    setSelectedRule(null);
  };

  const handleEditRule = (rule: AlertRule) => {
    setSelectedRule(rule);
    setIsCreating(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId));
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const handleSubmit = (ruleData: Omit<AlertRule, 'id'>) => {
    if (selectedRule) {
      // Mise à jour d'une règle existante
      setRules(rules.map(r => 
        r.id === selectedRule.id ? { ...ruleData, id: r.id } : r
      ));
      setSelectedRule(null);
    } else {
      // Création d'une nouvelle règle
      const newRule = {
        ...ruleData,
        id: Date.now().toString(),
      };
      setRules([...rules, newRule]);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setSelectedRule(null);
    setIsCreating(false);
  };

  if (isCreating || selectedRule) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {selectedRule ? 'Modifier la règle' : 'Nouvelle règle'}
          </h2>
          <Button variant="outline" onClick={handleCancel}>
            Retour à la liste
          </Button>
        </div>
        <AlertRuleForm
          rule={selectedRule || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Règles d'Alerte</h2>
        <Button onClick={handleCreateRule} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle règle
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map(rule => (
          <Card key={rule.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{rule.name}</h3>
                  <Badge className={SEVERITY_COLORS[rule.severity]}>
                    {rule.severity}
                  </Badge>
                  <Badge variant={rule.enabled ? "default" : "outline"}>
                    {rule.enabled ? 'Activée' : 'Désactivée'}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{rule.description}</p>
                
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Conditions :</h4>
                  <div className="grid gap-2">
                    {rule.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{TOOL_LABELS[condition.tool]}</span>
                        <span>{condition.metric}</span>
                        <span>{condition.operator}</span>
                        <span>{condition.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Actions :</h4>
                  <div className="grid gap-2">
                    {rule.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Bell className="w-4 h-4" />
                        <span className="capitalize">{action.type}</span>
                        <span className="text-gray-500">{action.target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleRule(rule.id)}
                >
                  {rule.enabled ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditRule(rule)}
                >
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteRule(rule.id)}
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 