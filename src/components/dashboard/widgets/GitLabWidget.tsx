import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { Badge } from '@/components/ui/badge';
import { GitBranch, GitCommit, GitPullRequest } from 'lucide-react';
import { useWidgetData } from '@/hooks/useWidgetData';
import { GitlabData } from '@/types/gitlab';

export function GitLabWidget({ id, onRemove, onSettings }: { id: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'gitlab' });

  if (loading) {
    return (
      <DashboardWidget
        id={id}
        title="Statistiques GitLab"
        tool="GitLab"
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
        title="Statistiques GitLab"
        tool="GitLab"
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
      title="Statistiques GitLab"
      tool="GitLab"
      onRemove={onRemove}
      onSettings={onSettings}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <GitBranch className="w-6 h-6 mb-2 text-blue-500" />
          <span className="text-2xl font-bold">{data.stats.branches}</span>
          <span className="text-sm text-gray-500">Branches</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <GitCommit className="w-6 h-6 mb-2 text-green-500" />
          <span className="text-2xl font-bold">{data.stats.commits}</span>
          <span className="text-sm text-gray-500">Commits</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <GitPullRequest className="w-6 h-6 mb-2 text-purple-500" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {data.stats.mergedMRs} merged
              </Badge>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                {data.stats.openMRs} open
              </Badge>
            </div>
            <span className="text-sm text-gray-500 mt-1">Merge Requests</span>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
} 