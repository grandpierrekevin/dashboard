import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useWidgetData } from '@/hooks/useWidgetData';
import { JiraData } from '@/types/jira';

export function JiraWidget({ id, onRemove, onSettings }: { id: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'jira' });

  if (loading) {
    return (
      <DashboardWidget
        id={id}
        title="Statistiques Jira"
        tool="Jira"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Chargement...</span>
        </div>
      </DashboardWidget>
    );
  }

  if (error) {
    return (
      <DashboardWidget
        id={id}
        title="Statistiques Jira"
        tool="Jira"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="flex items-center justify-center h-32">
          <span className="text-red-500">Erreur: {error.message}</span>
        </div>
      </DashboardWidget>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <DashboardWidget
      id={id}
      title="Statistiques Jira"
      tool="Jira"
      onRemove={onRemove}
      onSettings={onSettings}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <AlertCircle className="w-6 h-6 mb-2 text-red-500" />
          <span className="text-2xl font-bold">{data.stats.openIssues}</span>
          <span className="text-sm text-gray-500">Issues ouvertes</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <CheckCircle2 className="w-6 h-6 mb-2 text-green-500" />
          <span className="text-2xl font-bold">{data.stats.resolvedIssues}</span>
          <span className="text-sm text-gray-500">Issues résolues</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Clock className="w-6 h-6 mb-2 text-yellow-500" />
          <span className="text-2xl font-bold">{data.stats.avgResolutionTime}</span>
          <span className="text-sm text-gray-500">Temps moyen de résolution</span>
        </div>
      </div>
    </DashboardWidget>
  );
} 