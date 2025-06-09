import React from 'react';
import { useCorrelation } from '@/context/CorrelationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { CorrelationRule, ToolType, MetricType, OperatorType, ActionType } from '@/types/correlation';
import { TOOL_LABELS, TOOL_METRICS } from '@/constants/tools';
import { METRIC_LABELS } from '@/constants/metrics';
import { HELP_TEXTS } from '@/constants/help-texts';
import { ArrowRight, GitBranch, ShieldCheck, FileText } from 'lucide-react';

interface CorrelationRuleFormProps {
  rule?: CorrelationRule;
  onClose: () => void;
}

const TOOLS: ToolType[] = Object.keys(TOOL_LABELS) as ToolType[];
const OPERATORS: OperatorType[] = [
  OperatorType.GREATER_THAN,
  OperatorType.LESS_THAN,
  OperatorType.EQUALS,
  OperatorType.NOT_EQUALS,
  OperatorType.CONTAINS,
  OperatorType.STARTS_WITH,
  OperatorType.ENDS_WITH
];

function getToolIcon(tool: string) {
  switch (tool) {
    case ToolType.SONARQUBE: return <ShieldCheck className="inline w-4 h-4 text-blue-600 mr-1" />;
    case ToolType.JENKINS: return <GitBranch className="inline w-4 h-4 text-purple-600 mr-1" />;
    case ToolType.JIRA: return <FileText className="inline w-4 h-4 text-yellow-600 mr-1" />;
    default: return null;
  }
}

export function CorrelationRuleForm({ rule, onClose }: CorrelationRuleFormProps) {
  const { addRule, updateRule } = useCorrelation();
  const [formData, setFormData] = React.useState<Partial<CorrelationRule>>((
    rule || {
      name: '',
      description: '',
      enabled: true,
      source: {
        tool: ToolType.GITHUB,
        metric: MetricType.COMMIT,
        condition: {
          operator: OperatorType.EQUALS,
          value: '',
        },
      },
      target: {
        tool: ToolType.JIRA,
        metric: MetricType.ISSUE,
        action: ActionType.CREATE_ISSUE,
        config: {},
      },
    }
  ));

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
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in-up  max-w-lg mx-auto bg-white/98 dark:bg-gray-800 shadow-3xl rounded-3xl p-8 flex flex-col gap-8 border border-gray-200 dark:border-gray-700 transition-all duration-300"
      style={{ boxShadow: '0 20px 56px 0 rgba(0,0,0,0.30)' }}
    >
      {/* Bloc Source/Cible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-inner p-5 mb-4 overflow-hidden">
        {/* Source */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="mb-2">
            <span className="uppercase text-xs tracking-widest font-semibold text-gray-400 dark:text-gray-500">Source</span>
            <span className="ml-2">
                <HelpTooltip content={HELP_TEXTS.correlation.source.tool} />
            </span>
          </div>
          <div>
            <Label htmlFor="rule-source-tool" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Outil</Label>
            <Select
              value={formData.source?.tool as ToolType}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  source: {
                    ...prev.source!,
                    tool: value as ToolType,
                    metric: TOOL_METRICS[value as ToolType][0] as MetricType,
                  },
                }))
              }
            >
              <SelectTrigger className=" min-w-0 px-4 py-2 text-base rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200">
                <SelectValue placeholder="Sélectionner un outil" className="truncate text-sm overflow-hidden text-ellipsis whitespace-nowrap block" />
              </SelectTrigger>
              <SelectContent className="z-[130]">
                {TOOLS.map(tool => (
                  <SelectItem key={tool} value={tool} className="flex items-center gap-2">
                    {getToolIcon(tool)}{TOOL_LABELS[tool]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rule-source-metric" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Métrique</Label>
            <Select
              value={formData.source?.metric as MetricType}
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
              <SelectTrigger className=" min-w-0 px-4 py-2 text-base rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200">
                <SelectValue placeholder="Sélectionner une métrique" className="text-sm overflow-hidden text-ellipsis whitespace-nowrap block" />
              </SelectTrigger>
              <SelectContent className="z-[130] min-w-[--radix-select-trigger-width]">
                {(formData.source?.tool ? TOOL_METRICS[formData.source.tool as ToolType] : []).map(metric => (
                  <SelectItem key={metric} value={metric} className="whitespace-normal">{metric in METRIC_LABELS ? METRIC_LABELS[metric as keyof typeof METRIC_LABELS] : metric}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <Label htmlFor="rule-source-operator" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Opérateur</Label>
              <Select
                value={formData.source?.condition?.operator as OperatorType}
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
                <SelectTrigger className=" min-w-0 px-4 py-2 text-base rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200">
                  <SelectValue placeholder="Opérateur" className="truncate text-sm overflow-hidden text-ellipsis whitespace-nowrap block" />
                </SelectTrigger>
                <SelectContent className="z-[130]">
                  {OPERATORS.map(op => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-0">
              <Label htmlFor="rule-source-value" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Valeur</Label>
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
                className=" min-w-0 px-4 py-2 text-base rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-2">
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </div>
        {/* Cible */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="mb-2">
            <span className="uppercase text-xs tracking-widest font-semibold text-gray-400 dark:text-gray-500">Cible</span>
            <span className="ml-2">
            <HelpTooltip content={HELP_TEXTS.correlation.target.tool} />
            </span>
          </div>
          <div>
            <Label htmlFor="rule-target-tool" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Outil</Label>
            <Select
              value={formData.target?.tool as ToolType}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  target: {
                    ...prev.target!,
                    tool: value as ToolType,
                    metric: TOOL_METRICS[value as ToolType][0] as MetricType,
                  },
                }))
              }
            >
              <SelectTrigger className=" min-w-0 px-4 py-2 text-base rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200">
                <SelectValue placeholder="Sélectionner un outil" className="truncate text-sm overflow-hidden text-ellipsis whitespace-nowrap block" />
              </SelectTrigger>
              <SelectContent className="z-[130]">
                {TOOLS.map(tool => (
                  <SelectItem key={tool} value={tool} className="flex items-center gap-2">
                    {getToolIcon(tool)}{TOOL_LABELS[tool]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rule-target-metric" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Métrique</Label>
            <Select
              value={formData.target?.metric as MetricType}
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
              <SelectTrigger className="min-w-0  px-4 py-2 text-base rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200">
                <SelectValue placeholder="Sélectionner une métrique" className="text-sm overflow-hidden text-ellipsis whitespace-nowrap block" />
              </SelectTrigger>
              <SelectContent className="z-[130] min-w-[--radix-select-trigger-width]">
                {(formData.target?.tool ? TOOL_METRICS[formData.target.tool as ToolType] : []).map(metric => (
                  <SelectItem key={metric} value={metric} className="whitespace-normal">{metric in METRIC_LABELS ? METRIC_LABELS[metric as keyof typeof METRIC_LABELS] : metric}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rule-target-action" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Action</Label>
            <Select
              value={formData.target?.action as ActionType}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  target: {
                    ...prev.target!,
                    action: value as ActionType,
                  },
                }))
              }
            >
              <SelectTrigger className="min-w-0 px-4 py-2 text-base rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200">
                <SelectValue placeholder="Sélectionner une action" className="text-sm overflow-hidden text-ellipsis whitespace-nowrap block" />
              </SelectTrigger>
              <SelectContent className="z-[130]">
                <SelectItem value={ActionType.CREATE_ISSUE}>Créer un ticket</SelectItem>
                <SelectItem value={ActionType.UPDATE_STATUS}>Mettre à jour un ticket</SelectItem>
                <SelectItem value={ActionType.TRIGGER_BUILD}>Déclencher un build</SelectItem>
                <SelectItem value={ActionType.NOTIFY}>Notifier</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* Séparation visuelle */}
      <div className="h-px bg-gray-200 dark:bg-gray-900 my-2 rounded-full" />
      {/* Détails règle */}
      <div className="m flex flex-col gap-4 bg-gray-200 dark:bg-gray-900 rounded-2xl shadow-inner p-5 mb-4 overflow-hidden">
        <div>
          <Label htmlFor="rule-name" className="text-xs font-semibold text-gray-500 dark:text-gray-00 mb-1 block">Nom de la règle</Label>
          <Input
            id="rule-name"
            type="text"
            value={formData.name ?? ''}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            className=" min-w-0 px-4 py-2 text-base rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
        <div>
          <Label htmlFor="rule-description" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Description</Label>
          <Textarea
            id="rule-description"
            value={formData.description ?? ''}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className=" min-w-0 px-4 py-2 text-base min-h-[80px] rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
      </div>
      {/* Boutons */}
      <div className="flex flex-col md:flex-row justify-end gap-3 mt-4 ">
        <Button type="button" variant="outline" onClick={onClose} className=" md:w-auto min-w-[120px] rounded-xl px-6 py-2 font-bold shadow-sm hover:scale-105 transition-transform cursor-pointer">
          Annuler
        </Button>
        <Button type="submit" className=" md:w-auto min-w-[150px] rounded-xl px-6 py-2 font-bold text-base shadow-sm hover:scale-105 transition-transform cursor-pointer">
          {rule ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
} 