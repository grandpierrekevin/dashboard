import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PlayCircle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

export function JenkinsSummaryWidget({ id, title, onRemove, onSettings }: { id: string; title: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'jenkins' });
  const jobs = Array.isArray(data) ? (data as JenkinsWidgetData[]) : [];

  // Agrégation des stats globales
  const totalBuilds = jobs.reduce((sum, job) => sum + (job.details?.totalBuilds || 0), 0);
  const avgSuccessRate = jobs.length ? Math.round(jobs.reduce((sum, job) => sum + (job.details?.successRate || 0), 0) / jobs.length) : 0;
  const avgDuration = jobs.length ? Math.round(jobs.reduce((sum, job) => sum + (job.details?.averageDuration || 0), 0) / jobs.length) : 0;

  // Agrégation de l'activité pour le graphique
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activity = days.map(day => ({
    date: day,
    builds: jobs.reduce((sum, job) => {
      const found = job.activity?.find(a => a.date === day);
      return sum + (found?.builds || 0);
    }, 0)
  }));

  // Formater la durée en minutes
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    return `${minutes} min`;
  };

  if (error) {
    return (
      <DashboardWidget id={id} title={title} tool="Jenkins" onRemove={onRemove} onSettings={onSettings}>
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
      <DashboardWidget id={id} title={title} tool="Jenkins" onRemove={onRemove} onSettings={onSettings}>
        <div className="animate-pulse space-y-4 p-4">
          <div className="grid grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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

  if (!jobs.length) {
    return (
      <DashboardWidget id={id} title={title} tool="Jenkins" onRemove={onRemove} onSettings={onSettings}>
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Aucune donnée disponible</span>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget id={id} title={title} tool="Jenkins" onRemove={onRemove} onSettings={onSettings}>
      <div className="w-full h-full flex flex-col min-h-[220px] p-4">
        <TooltipProvider>
          <div className="grid grid-cols-3 gap-6 w-full text-center flex-none">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <PlayCircle className="w-7 h-7 mb-1 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{totalBuilds}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Builds</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre total de builds</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <CheckCircle2 className="w-7 h-7 mb-1 text-green-500 group-hover:text-green-600 transition-colors" />
                  <Badge className={`text-lg px-3 py-1 font-bold ${avgSuccessRate >= 80 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {avgSuccessRate}%
                  </Badge>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Succès</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Taux de succès moyen</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <Clock className="w-7 h-7 mb-1 text-purple-500 group-hover:text-purple-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{formatDuration(avgDuration)}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Durée moy.</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Durée moyenne des builds</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        {/* Mini-graphique d'activité qui prend tout le reste */}
        <div className="flex-1 flex items-end w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis hide />
              <RechartsTooltip />
              <Line type="monotone" dataKey="builds" stroke="#22c55e" name="Builds" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardWidget>
  );
} 