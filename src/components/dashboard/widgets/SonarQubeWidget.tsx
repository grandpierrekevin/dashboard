import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bug, CheckCircle2 } from 'lucide-react';
import { useWidgetData } from '@/hooks/useWidgetData';
import { SonarData } from '@/types/sonar';

export function SonarQubeWidget({ id, onRemove, onSettings }: { id: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'sonar' });

  if (loading) {
    return (
      <DashboardWidget
        id={id}
        title="Statistiques SonarQube"
        tool="SonarQube"
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
        title="Statistiques SonarQube"
        tool="SonarQube"
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
      title="Statistiques SonarQube"
      tool="SonarQube"
      onRemove={onRemove}
      onSettings={onSettings}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <AlertTriangle className="w-6 h-6 mb-2 text-red-500" />
          <span className="text-2xl font-bold">{data.stats.criticalIssues}</span>
          <span className="text-sm text-gray-500">Critiques</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Bug className="w-6 h-6 mb-2 text-orange-500" />
          <span className="text-2xl font-bold">{data.stats.majorIssues}</span>
          <span className="text-sm text-gray-500">Majeurs</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <CheckCircle2 className="w-6 h-6 mb-2 text-green-500" />
          <span className="text-2xl font-bold">{data.stats.doneIssues}</span>
          <span className="text-sm text-gray-500">Résolus</span>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
        <h4 className="font-medium mb-2">Dernières mises à jour</h4>
        <ul className="space-y-2">
          {data.recentUpdates.map((update, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={update.type === 'bug' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                  {update.type}
                </Badge>
                <span className="text-sm">{update.title}</span>
              </div>
              <span className="text-sm text-gray-500">{update.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardWidget>
  );
} 