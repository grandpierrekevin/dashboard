import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { AlertTriangle, Bug, AlertCircle, HeartPulse, GitPullRequest, GitCommit, Shield, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDashboardFilters } from '@/context/DashboardFilterContext';
import { useIntegrations } from '@/context/IntegrationsContext';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DevOpsSummaryProps {
  id: string;
  title: string;
  onRemove: (id: string) => void;
  onSettings: (id: string) => void;
}

export function DevOpsSummaryWidget({ id, title, onRemove, onSettings }: DevOpsSummaryProps) {
  const { filters } = useDashboardFilters();
  const { integrations } = useIntegrations();
  const [isLoading, setIsLoading] = React.useState(true);
  const [summaryData, setSummaryData] = React.useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    totalIssues: 0,
    openIssues: 0,
    healthScore: 85,
    metrics: {
      commits: 0,
      pullRequests: 0,
      builds: 0,
      tests: 0,
      coverage: 0,
      quality: 0
    }
  });

  React.useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setSummaryData({
        totalAlerts: 12,
        criticalAlerts: 3,
        totalIssues: 45,
        openIssues: 15,
        healthScore: 85,
        metrics: {
          commits: 156,
          pullRequests: 23,
          builds: 89,
          tests: 1234,
          coverage: 87,
          quality: 92
        }
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [filters]);

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  if (isLoading) {
    return (
      <DashboardWidget
        id={id}
        title={title}
        tool="Summary"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget
      id={id}
      title={title}
      tool="Summary"
      onRemove={onRemove}
      onSettings={onSettings}
    >
      <div className="space-y-6">
        {/* Score de santé global */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Score de santé global</h3>
            <Badge variant="outline" className={cn("text-lg font-bold", getHealthColor(summaryData.healthScore))}>
              {summaryData.healthScore}%
            </Badge>
          </div>
          <Progress value={summaryData.healthScore} className="h-2" />
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Commits</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{summaryData.metrics.commits}</p>
          </div>
          <div className="space-y-2 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50">
            <div className="flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Pull Requests</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{summaryData.metrics.pullRequests}</p>
          </div>
          <div className="space-y-2 p-3 rounded-lg bg-green-50/50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Tests</span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{summaryData.metrics.tests}</p>
          </div>
          <div className="space-y-2 p-3 rounded-lg bg-orange-50/50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Qualité</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{summaryData.metrics.quality}%</p>
          </div>
        </div>

        {/* Alertes et problèmes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Alertes critiques</span>
            </div>
            <Badge variant="destructive">{summaryData.criticalAlerts}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Problèmes ouverts</span>
            </div>
            <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400">
              {summaryData.openIssues} / {summaryData.totalIssues}
            </Badge>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
} 