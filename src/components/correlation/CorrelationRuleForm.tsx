import React from 'react';
import { useCorrelation } from '@/context/CorrelationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import type { CorrelationRule, ToolType, MetricType, OperatorType } from '@/types/correlation';
import { TOOL_LABELS, TOOL_METRICS } from '@/constants/tools';
import { METRIC_LABELS } from '@/constants/metrics';
import { HELP_TEXTS } from '@/constants/help-texts';

interface CorrelationRuleFormProps {
  rule?: CorrelationRule;
  onClose: () => void;
}

const TOOLS: ToolType[] = Object.keys(TOOL_LABELS) as ToolType[];
const OPERATORS: OperatorType[] = ['>', '<', '=', '!=', 'contains', 'starts_with', 'ends_with'];

export function CorrelationRuleForm({ rule, onClose }: CorrelationRuleFormProps) {
  const { addRule, updateRule } = useCorrelation();
  const [formData, setFormData] = React.useState<Partial<CorrelationRule>>(
    rule || {
      name: '',
      description: '',
      enabled: true,
      source: {
        tool: 'github',
        metric: 'commit',
        condition: {
          operator: '=',
          value: '',
        },
      },
      target: {
        tool: 'jira',
        metric: 'issue',
        action: 'create_issue',
        config: {},
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rule) {
      updateRule(rule.id, formData);
    } else {
      addRule(formData as Omit<CorrelationRule, 'id' | 'createdAt' | 'updatedAt'>);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor="rule-source-tool">Source</Label>
            <HelpTooltip content={HELP_TEXTS.correlation.source.tool} />
          </div>
          <div className="space-y-2">
            <Select
              value={formData.source?.tool}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  source: {
                    ...prev.source!,
                    tool: value as ToolType,
                    metric: TOOL_METRICS[value as ToolType][0],
                  },
                }))
              }
            >
              <SelectTrigger id="rule-source-tool">
                <SelectValue placeholder="Sélectionner un outil" />
              </SelectTrigger>
              <SelectContent>
                {TOOLS.map(tool => (
                  <SelectItem key={tool} value={tool}>
                    {TOOL_LABELS[tool]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label htmlFor="rule-source-metric">Métrique</Label>
              <HelpTooltip content={HELP_TEXTS.correlation.source.metric} />
            </div>
            <Select
              value={formData.source?.metric}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  source: {
                    ...prev.source!,
                    metric: value as MetricType,
                  },
                }))
              }
            >
              <SelectTrigger id="rule-source-metric">
                <SelectValue placeholder="Sélectionner une métrique" />
              </SelectTrigger>
              <SelectContent>
                {(formData.source?.tool ? TOOL_METRICS[formData.source.tool] : []).map(metric => (
                  <SelectItem key={metric} value={metric}>
                    {METRIC_LABELS[metric]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label htmlFor="rule-source-operator">Opérateur</Label>
              <HelpTooltip content={HELP_TEXTS.correlation.source.operator} />
            </div>
            <Select
              value={formData.source?.condition?.operator}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  source: {
                    ...prev.source!,
                    condition: {
                      ...prev.source!.condition,
                      operator: value as OperatorType,
                    },
                  },
                }))
              }
            >
              <SelectTrigger id="rule-source-operator">
                <SelectValue placeholder="Opérateur" />
              </SelectTrigger>
              <SelectContent>
                {OPERATORS.map(op => (
                  <SelectItem key={op} value={op}>{op}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label htmlFor="rule-source-value">Valeur</Label>
              <HelpTooltip content={HELP_TEXTS.correlation.source.value} />
            </div>
            <Input
              id="rule-source-value"
              type="text"
              value={formData.source?.condition?.value ?? ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  source: {
                    ...prev.source!,
                    condition: {
                      ...prev.source!.condition,
                      value: e.target.value,
                    },
                  },
                }))
              }
              placeholder="Valeur"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor="rule-target-tool">Cible</Label>
            <HelpTooltip content={HELP_TEXTS.correlation.target.tool} />
          </div>
          <div className="space-y-2">
            <Select
              value={formData.target?.tool}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  target: {
                    ...prev.target!,
                    tool: value as ToolType,
                    metric: TOOL_METRICS[value as ToolType][0],
                  },
                }))
              }
            >
              <SelectTrigger id="rule-target-tool">
                <SelectValue placeholder="Sélectionner un outil" />
              </SelectTrigger>
              <SelectContent>
                {TOOLS.map(tool => (
                  <SelectItem key={tool} value={tool}>
                    {TOOL_LABELS[tool]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label htmlFor="rule-target-metric">Métrique</Label>
              <HelpTooltip content={HELP_TEXTS.correlation.target.metric} />
            </div>
            <Select
              value={formData.target?.metric}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  target: {
                    ...prev.target!,
                    metric: value as MetricType,
                  },
                }))
              }
            >
              <SelectTrigger id="rule-target-metric">
                <SelectValue placeholder="Sélectionner une métrique" />
              </SelectTrigger>
              <SelectContent>
                {(formData.target?.tool ? TOOL_METRICS[formData.target.tool] : []).map(metric => (
                  <SelectItem key={metric} value={metric}>
                    {METRIC_LABELS[metric]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label htmlFor="rule-target-action">Action</Label>
              <HelpTooltip content={HELP_TEXTS.correlation.target.action} />
            </div>
            <Select
              value={formData.target?.action}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  target: {
                    ...prev.target!,
                    action: value,
                  },
                }))
              }
            >
              <SelectTrigger id="rule-target-action">
                <SelectValue placeholder="Sélectionner une action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create_issue">Créer un ticket</SelectItem>
                <SelectItem value="update_issue">Mettre à jour un ticket</SelectItem>
                <SelectItem value="create_comment">Ajouter un commentaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="rule-name">Nom de la règle</Label>
        <Input
          id="rule-name"
          type="text"
          value={formData.name ?? ''}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="rule-description">Description</Label>
        <Textarea
          id="rule-description"
          value={formData.description ?? ''}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">
          {rule ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
} 