import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ListTodo, Loader2, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

export function JiraSummaryWidget({ id, title, onRemove, onSettings }: { id: string; title: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'jira' });
  const jiraData = Array.isArray(data) ? (data as JiraWidgetData[]) : [];

  // Agrégation des stats globales
  const totalOpen = jiraData.reduce((sum, project) => sum + project.details.open, 0);
  const totalInProgress = jiraData.reduce((sum, project) => sum + project.details.inProgress, 0);
  const totalDone = jiraData.reduce((sum, project) => sum + project.details.done, 0);
  const avgVelocity = jiraData.length ? Math.round(jiraData.reduce((sum, project) => sum + project.details.velocity, 0) / jiraData.length) : 0;

  // Agrégation de l'activité pour le graphique
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activity = days.map(day => ({
    date: day,
    tickets: jiraData.reduce((sum, project) => {
      const found = project.activity?.find(a => a.date === day);
      return sum + (found?.value || 0);
    }, 0)
  }));

  if (error) {
    return (
      <DashboardWidget id={id} title={title} tool="Jira" onRemove={onRemove} onSettings={onSettings}>
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
      <DashboardWidget id={id} title={title} tool="Jira" onRemove={onRemove} onSettings={onSettings}>
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

  if (!jiraData.length) {
    return (
      <DashboardWidget id={id} title={title} tool="Jira" onRemove={onRemove} onSettings={onSettings}>
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Aucune donnée disponible</span>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget id={id} title={title} tool="Jira" onRemove={onRemove} onSettings={onSettings}>
      <div className="w-full h-full flex flex-col min-h-[220px] p-4">
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-6 w-full text-center items-center justify-items-center flex-none">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <ListTodo className="w-7 h-7 mb-1 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{totalOpen}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">À faire</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre de tickets à faire</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <Loader2 className="w-7 h-7 mb-1 text-orange-500 group-hover:text-orange-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{totalInProgress}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">En cours</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre de tickets en cours</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <CheckCircle2 className="w-7 h-7 mb-1 text-green-500 group-hover:text-green-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{totalDone}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Terminés</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre de tickets terminés</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <Users className="w-7 h-7 mb-1 text-purple-500 group-hover:text-purple-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{avgVelocity}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Vélocité</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vélocité moyenne de l'équipe (points par sprint)</p>
              </TooltipContent>
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
              <Line type="monotone" dataKey="tickets" stroke="#22c55e" name="Tickets" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardWidget>
  );
} 