import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

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

const TOOL_LABELS: Record<string, string> = {
  github: 'GitHub',
  gitlab: 'GitLab',
  jenkins: 'Jenkins',
  jira: 'Jira',
  sonarqube: 'SonarQube',
};

interface AlertRuleFormProps {
  rule?: AlertRule;
  onSubmit: (rule: Omit<AlertRule, 'id'>) => void;
  onCancel: () => void;
}

export function AlertRuleForm({ rule, onSubmit, onCancel }: AlertRuleFormProps) {
  const [formData, setFormData] = React.useState<Omit<AlertRule, 'id'>>(
    rule || {
      name: '',
      description: '',
      severity: 'info',
      conditions: [{ tool: '', metric: '', operator: '=', value: '' }],
      actions: [{ type: 'notification', target: '' }],
      enabled: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleConditionChange = (index: number, field: string, value: string) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData({ ...formData, conditions: newConditions });
  };

  const handleActionChange = (index: number, field: string, value: string) => {
    const newActions = [...formData.actions];
    newActions[index] = { ...newActions[index], [field]: value };
    setFormData({ ...formData, actions: newActions });
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { tool: '', metric: '', operator: '=', value: '' }],
    });
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index),
    });
  };

  const addAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { type: 'notification', target: '' }],
    });
  };

  const removeAction = (index: number) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la règle</label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Build échoué après commit"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez le but de cette règle d'alerte"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sévérité</label>
            <Select
              value={formData.severity}
              onValueChange={value => setFormData({ ...formData, severity: value as AlertRule['severity'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="warning">Avertissement</SelectItem>
                <SelectItem value="info">Information</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Conditions</h3>
            <Button type="button" variant="outline" size="sm" onClick={addCondition}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une condition
            </Button>
          </div>

          {formData.conditions.map((condition, index) => (
            <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Outil</label>
                <Select
                  value={condition.tool}
                  onValueChange={value => handleConditionChange(index, 'tool', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TOOL_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Métrique</label>
                <Input
                  value={condition.metric}
                  onChange={e => handleConditionChange(index, 'metric', e.target.value)}
                  placeholder="Ex: build_status"
                  required
                />
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium mb-1">Opérateur</label>
                <Select
                  value={condition.operator}
                  onValueChange={value => handleConditionChange(index, 'operator', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">">Supérieur à</SelectItem>
                    <SelectItem value="<">Inférieur à</SelectItem>
                    <SelectItem value="=">Égal à</SelectItem>
                    <SelectItem value="contains">Contient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Valeur</label>
                <Input
                  value={condition.value}
                  onChange={e => handleConditionChange(index, 'value', e.target.value)}
                  placeholder="Ex: failure"
                  required
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCondition(index)}
                className="mb-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Actions</h3>
            <Button type="button" variant="outline" size="sm" onClick={addAction}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une action
            </Button>
          </div>

          {formData.actions.map((action, index) => (
            <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Type d'action</label>
                <Select
                  value={action.type}
                  onValueChange={value => handleActionChange(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Cible</label>
                <Input
                  value={action.target}
                  onChange={e => handleActionChange(index, 'target', e.target.value)}
                  placeholder={
                    action.type === 'notification'
                      ? '#devops-alerts'
                      : action.type === 'webhook'
                      ? 'https://webhook.example.com'
                      : 'team@example.com'
                  }
                  required
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAction(index)}
                className="mb-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {rule ? 'Mettre à jour' : 'Créer'} la règle
        </Button>
      </div>
    </form>
  );
} 