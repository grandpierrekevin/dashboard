import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, Users, ListTodo } from 'lucide-react';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface JiraWidgetData {
  name: string;
  value: number;
  details: {
    open: number;
    inProgress: number;
    done: number;
    velocity: number;
  };
  activity: {
    date: string;
    value: number;
  }[];
}

export function JiraWidget({ id, title, onRemove, onSettings }: { id: string; title: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'jira' });
  const jiraData = Array.isArray(data) ? (data as JiraWidgetData[]) : [];

  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');

  // Agrégation des stats globales
  const totalIssues = jiraData.reduce((sum, project) => sum + project.value, 0);
  const totalOpen = jiraData.reduce((sum, project) => sum + project.details.open, 0);
  const totalInProgress = jiraData.reduce((sum, project) => sum + project.details.inProgress, 0);
  const totalDone = jiraData.reduce((sum, project) => sum + project.details.done, 0);
  const avgVelocity = jiraData.length ? Math.round(jiraData.reduce((sum, project) => sum + project.details.velocity, 0) / jiraData.length) : 0;

  // Agrégation de l'activité sur 7 jours pour le graphique
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activity = days.map(day => ({
    date: day,
    value: jiraData.reduce((sum, project) => {
      const found = project.activity?.find(a => a.date === day);
      return sum + (found?.value || 0);
    }, 0)
  }));

  if (error) {
    return (
      <DashboardWidget
        id={id}
        title={title}
        tool="Jira"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "Une erreur est survenue lors du chargement des données Jira"}
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
        tool="Jira"
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

  if (!jiraData.length) {
    return (
      <DashboardWidget
        id={id}
        title={title}
        tool="Jira"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Aucune donnée disponible</span>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <div className="dashboard-widget">
      <DashboardWidget
        id={id}
        title={title}
        tool="Jira"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Jira</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              {totalIssues} tickets
            </Badge>
          </div>

          {/* Chiffres clés */}
          <div className="grid grid-cols-4 gap-8">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center group">
                    <ListTodo className="w-7 h-7 mb-1 text-blue-500 group-hover:text-blue-600 transition-colors" />
                    <span className="text-2xl font-extrabold tracking-tight">{totalOpen}</span>
                    <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">À faire</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Nombre de tickets à faire</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center group">
                    <Clock className="w-7 h-7 mb-1 text-orange-500 group-hover:text-orange-600 transition-colors" />
                    <span className="text-2xl font-extrabold tracking-tight">{totalInProgress}</span>
                    <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">En cours</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Nombre de tickets en cours</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center group">
                    <CheckCircle2 className="w-7 h-7 mb-1 text-green-500 group-hover:text-green-600 transition-colors" />
                    <span className="text-2xl font-extrabold tracking-tight">{totalDone}</span>
                    <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Terminés</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Nombre de tickets terminés</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center group">
                    <Users className="w-7 h-7 mb-1 text-purple-500 group-hover:text-purple-600 transition-colors" />
                    <span className="text-2xl font-extrabold tracking-tight">{avgVelocity}</span>
                    <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Vélocité</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Vélocité moyenne de l'équipe (points par sprint)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Mini-graphe */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Activité sur 7 jours</h4>
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
                  <Line type="monotone" dataKey="value" stroke="#22c55e" name="Tickets" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={activity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#22c55e" name="Tickets" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </DashboardWidget>
    </div>
  );
} 