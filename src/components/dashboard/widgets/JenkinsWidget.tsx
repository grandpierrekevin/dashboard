import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface JenkinsWidgetData {
  name: string;
  value: number;
  details: {
    totalBuilds: number;
    successRate: number;
    averageDuration: number;
    lastBuild: {
      id: number;
      number: number;
      status: 'success' | 'failed' | 'running' | 'pending';
      startedAt: string;
      finishedAt: string;
      duration: number;
      stages: {
        name: string;
        status: 'success' | 'failed' | 'running' | 'pending';
        duration: number;
        logs: string;
        error?: string;
      }[];
    };
  };
  activity: {
    date: string;
    builds: number;
  }[];
}

export function JenkinsWidget({ id, title, onRemove, onSettings }: { id: string; title: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'jenkins' });
  const jobs = Array.isArray(data) ? (data as JenkinsWidgetData[]) : [];

  // Agrégation des stats globales
  const totalBuilds = jobs.reduce((sum, job) => sum + (job.details?.totalBuilds || 0), 0);
  const avgSuccessRate = jobs.length ? Math.round(jobs.reduce((sum, job) => sum + (job.details?.successRate || 0), 0) / jobs.length) : 0;
  const avgDuration = jobs.length ? Math.round(jobs.reduce((sum, job) => sum + (job.details?.averageDuration || 0), 0) / jobs.length) : 0;
  // Dernier build global (le plus récent)
  const lastBuild = jobs.reduce((latest, job) => {
    if (!latest || (job.details?.lastBuild && job.details.lastBuild.startedAt > latest.startedAt)) return job.details?.lastBuild;
    return latest;
  }, null as JenkinsWidgetData['details']['lastBuild'] | null);

  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');

  // Statut global basé sur le dernier build
  const getStatus = () => {
    switch (lastBuild?.status) {
      case 'success':
        return { label: 'Succès', color: 'bg-green-100 text-green-800' };
      case 'failed':
        return { label: 'Échec', color: 'bg-red-100 text-red-800' };
      case 'running':
        return { label: 'En cours', color: 'bg-blue-100 text-blue-800' };
      default:
        return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
    }
  };
  const status = getStatus();

  // Formater la durée en minutes
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    return `${minutes} min`;
  };

  if (error) {
    return (
      <DashboardWidget
        id={id}
        title={title}
        tool="Jenkins"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "Une erreur est survenue lors du chargement des données Jenkins"}
          </AlertDescription>
        </Alert>
      </DashboardWidget>
    );
  }

  if (loading) {
    return (
      <DashboardWidget
        id={id}
        title={title}
        tool="Jenkins"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
      </DashboardWidget>
    );
  }

  if (!jobs.length) {
    return (
      <DashboardWidget
        id={id}
        title={title}
        tool="Jenkins"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Aucune donnée disponible</span>
        </div>
      </DashboardWidget>
    );
  }

  // Agrégation de l'activité sur 7 jours pour le graphique
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activity = days.map(day => ({
    date: day,
    builds: jobs.reduce((sum, job) => {
      const found = job.activity?.find(a => a.date === day);
      return sum + (found?.builds || 0);
    }, 0)
  }));

  return (
    <div className="dashboard-widget">
      <DashboardWidget
        id={id}
        title={title}
        tool="Jenkins"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">Jenkins</span>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
        <div className="flex flex-col gap-6 p-2 md:p-4">
          {/* Infos secondaires */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-gray-400">
            <span>Dernier build : #{lastBuild?.number ?? '–'}</span>
            <span>Le {lastBuild?.startedAt ? new Date(lastBuild.startedAt).toLocaleString() : '–'}</span>
          </div>
          {/* Chiffres clés */}
          <div className="grid grid-cols-4 gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <PlayCircle className="w-7 h-7 mb-1 text-blue-500" />
                    <span className="text-2xl font-extrabold tracking-tight">{totalBuilds}</span>
                    <span className="text-xs text-gray-400 mt-1">Builds</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Nombre total de builds</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-7 h-7 mb-1 text-green-500" />
                    <span className="text-2xl font-extrabold tracking-tight">{avgSuccessRate}%</span>
                    <span className="text-xs text-gray-400 mt-1">Succès</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Taux de succès moyen</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <Clock className="w-7 h-7 mb-1 text-purple-500" />
                    <span className="text-2xl font-extrabold tracking-tight">{formatDuration(avgDuration)}</span>
                    <span className="text-xs text-gray-400 mt-1">Durée moy.</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Durée moyenne des builds</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <AlertCircle className="w-7 h-7 mb-1 text-orange-500" />
                    <span className="text-2xl font-extrabold tracking-tight">{lastBuild?.stages?.length ?? '–'}</span>
                    <span className="text-xs text-gray-400 mt-1">Étapes</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Nombre d'étapes dans le dernier build</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* Mini-graphe personnalisable */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-2 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Builds par jour (7 jours)</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs">Type de graphe</span>
                <select
                  className="w-[90px] h-7 text-xs bg-background border rounded"
                  value={chartType}
                  onChange={e => setChartType(e.target.value as 'line' | 'bar')}
                >
                  <option value="line">Ligne</option>
                  <option value="bar">Barres</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              {chartType === 'line' ? (
                <LineChart data={activity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="builds" stroke="#22c55e" name="Builds" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={activity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="builds" fill="#22c55e" name="Builds" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </DashboardWidget>
    </div>
  );
} 