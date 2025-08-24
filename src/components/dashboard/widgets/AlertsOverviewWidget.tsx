import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle2, Flame, AlertCircle } from 'lucide-react';
import { useDashboardFilters } from '@/context/DashboardFilterContext';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

interface AlertsOverviewWidgetProps {
  id: string;
  title: string;
  onRemove: (id: string) => void;
  onSettings: (id: string) => void;
}

export function AlertsOverviewWidget({ id, title, onRemove, onSettings }: AlertsOverviewWidgetProps) {
  const { updateFilter, resetFilters, filters } = useDashboardFilters();
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        // Simuler un appel API pour récupérer les alertes
        const response = await fetch('/api/alerts');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des alertes');
        }
        const data = await response.json();
        setAlerts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Calculer les statistiques des alertes
  const stats = React.useMemo(() => {
    return {
      total: alerts.length,
      active: alerts.filter(a => a.status === 'active').length,
      resolved: alerts.filter(a => a.status === 'resolved').length,
      critical: alerts.filter(a => a.type === 'error').length
    };
  }, [alerts]);

  // Déterminer la couleur du badge en fonction du type d'alerte
  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-orange-100 text-orange-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <DashboardWidget id={id} title={title} tool="Alertes" onRemove={onRemove} onSettings={onSettings}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "Une erreur est survenue lors du chargement des alertes"}
          </AlertDescription>
        </Alert>
      </DashboardWidget>
    );
  }

  if (loading) {
    return (
      <DashboardWidget id={id} title={title} tool="Alertes" onRemove={onRemove} onSettings={onSettings}>
        <div className="animate-pulse space-y-4 p-4">
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-7 h-7 bg-muted rounded-full mb-1" />
                <div className="h-8 bg-muted rounded w-12 mb-1" />
                <div className="h-4 bg-muted rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget id={id} title={title} tool="Alertes" onRemove={onRemove} onSettings={onSettings}>
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-4 gap-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <Bell className="w-7 h-7 mb-1 text-blue-500" />
                  <span className="text-2xl font-extrabold tracking-tight">{stats.total}</span>
                  <span className="text-xs text-gray-400 mt-1">Total</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre total d'alertes</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => updateFilter('status', 'active')}
                >
                  <Flame className="w-7 h-7 mb-1 text-orange-500" />
                  <span className="text-2xl font-extrabold tracking-tight">{stats.active}</span>
                  <span className="text-xs text-gray-400 mt-1">Actives</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre d'alertes actives</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => updateFilter('status', 'resolved')}
                >
                  <CheckCircle2 className="w-7 h-7 mb-1 text-green-500" />
                  <span className="text-2xl font-extrabold tracking-tight">{stats.resolved}</span>
                  <span className="text-xs text-gray-400 mt-1">Résolues</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre d'alertes résolues</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => updateFilter('rule', 'error')}
                >
                  <AlertCircle className="w-7 h-7 mb-1 text-red-500" />
                  <span className="text-2xl font-extrabold tracking-tight">{stats.critical}</span>
                  <span className="text-xs text-gray-400 mt-1">Critiques</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre d'alertes critiques</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {alerts.length > 0 && (
          <div className="space-y-2 mt-4">
            {alerts.slice(0, 3).map(alert => (
              <div 
                key={alert.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getAlertColor(alert.type)}>
                    {alert.type}
                  </Badge>
                  <span className="text-sm">{alert.message}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {(filters.status || filters.rule) && (
          <div className="flex justify-end mt-4">
            <Button type="button" variant="outline" size="sm" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </DashboardWidget>
  );
} 