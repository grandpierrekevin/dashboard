import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { AlertTriangle, Bug, AlertCircle, HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDashboardFilters } from '@/context/DashboardFilterContext';
import { useIntegrations } from '@/context/IntegrationsContext';
import { Button } from "@/components/ui/button";

interface DevOpsSummaryProps {
  id: string;
  onRemove: (id: string) => void;
  onSettings: (id: string) => void;
}

// Données mockées pour la synthèse
const MOCK = {
  activeAlerts: 4,
  failedBuilds: 2,
  criticalBugs: 1,
};

function getHealthStatus(alerts: number, builds: number, bugs: number) {
  if (alerts > 5 || builds > 5 || bugs > 10) return { label: 'Critique', color: 'bg-red-100 text-red-800' };
  if (alerts > 2 || builds > 2 || bugs > 5) return { label: 'Dégradée', color: 'bg-yellow-100 text-yellow-800' };
  return { label: 'Bonne', color: 'bg-green-100 text-green-800' };
}

export function DevOpsSummaryWidget({ id, onRemove, onSettings }: DevOpsSummaryProps) {
  const { integrations } = useIntegrations();
  const activeIntegrations = integrations.filter(i => i.active);
  const { updateFilter, resetFilters, filters } = useDashboardFilters();

  // Filtrer les métriques en fonction des outils actifs
  const getFilteredMetrics = () => {
    const metrics = {
      activeAlerts: MOCK.activeAlerts,
      failedBuilds: MOCK.failedBuilds,
      criticalBugs: MOCK.criticalBugs,
    };

    // Ne montrer les builds que si Jenkins est actif
    if (!activeIntegrations.some(i => i.name.toLowerCase() === 'jenkins')) {
      metrics.failedBuilds = 0;
    }

    // Ne montrer les bugs que si Jira est actif
    if (!activeIntegrations.some(i => i.name.toLowerCase() === 'jira')) {
      metrics.criticalBugs = 0;
    }

    return metrics;
  };

  const metrics = getFilteredMetrics();
  const health = getHealthStatus(metrics.activeAlerts, metrics.failedBuilds, metrics.criticalBugs);

  return (
    <DashboardWidget
      id={id}
      title="Synthèse DevOps"
      tool="Synthèse"
      onRemove={onRemove}
      onSettings={onSettings}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer" onClick={() => updateFilter('status', 'active')} title="Filtrer sur les alertes actives">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="font-medium">Alertes actives</span>
          </div>
          <Badge variant="outline" className="bg-orange-100 text-orange-800">{metrics.activeAlerts}</Badge>
        </div>
        {metrics.failedBuilds > 0 && (
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer" onClick={() => updateFilter('status', 'failure')} title="Filtrer sur les builds en échec">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="font-medium">Builds en échec</span>
            </div>
            <Badge variant="outline" className="bg-red-100 text-red-800">{metrics.failedBuilds}</Badge>
          </div>
        )}
        {metrics.criticalBugs > 0 && (
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer" onClick={() => updateFilter('status', 'critical-bug')} title="Filtrer sur les bugs critiques">
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Bugs critiques</span>
            </div>
            <Badge variant="outline" className="bg-purple-100 text-purple-800">{metrics.criticalBugs}</Badge>
          </div>
        )}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-green-500" />
            <span className="font-medium">Santé globale</span>
          </div>
          <Badge className={health.color}>{health.label}</Badge>
        </div>
        {(filters.status || filters.tool || filters.rule) && (
          <div className="flex justify-end mt-2">
            <Button type="button" variant="outline" size="sm" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </DashboardWidget>
  );
} 