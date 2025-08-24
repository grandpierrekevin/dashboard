import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { Badge } from '@/components/ui/badge';
import { GitBranch, GitCommit, GitPullRequest, AlertCircle, Star } from 'lucide-react';
import { useWidgetData } from '@/hooks/useWidgetData';
import { GitlabData } from '@/types/gitlab';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Définition du type local pour l'activité d'un jour
interface ProjectActivityDay {
  date: string;
  commits: number;
  mrs: number;
  issues: number;
}

export function GitLabWidget({ id, title, onRemove, onSettings }: { id: string; title: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'gitlab' });
  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');
  // Fallback/mock data
  const mock = {
    stats: {
      pipelines: 12,
      commits: 50,
      mrs: 10,
      issues: 5,
      stars: 120,
    },
    history: [
      { date: 'Lun', commits: 5 },
      { date: 'Mar', commits: 7 },
      { date: 'Mer', commits: 6 },
      { date: 'Jeu', commits: 8 },
      { date: 'Ven', commits: 5 },
      { date: 'Sam', commits: 4 },
      { date: 'Dim', commits: 3 },
    ],
    lastPipeline: {
      message: 'Merge MR #42',
      date: new Date().toISOString(),
    },
  };

  // Agrégation des données sur tous les projets
  const projects = Array.isArray(data) ? (data as any[]) : [];
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);
  const totalCommits = projects.reduce((sum, p) => sum + (p.stats?.totalCommits || 0), 0);
  const totalMRs = projects.reduce((sum, p) => sum + (p.stats?.totalMRs || 0), 0);
  const totalIssues = projects.reduce((sum, p) => sum + (p.stats?.totalIssues || 0), 0);
  const totalPipelines = projects.reduce((sum, p) => sum + (p.stats?.totalPipelines || 0), 0);

  // Agrégation de l'activité pour le graphique (commits par jour)
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activity: ProjectActivityDay[] = days.map(day => ({
    date: day,
    commits: projects.reduce((sum, p) => {
      const found = p.activity?.find((a: any) => a.date === day);
      return sum + (found?.commits || 0);
    }, 0),
    mrs: projects.reduce((sum, p) => {
      const found = p.activity?.find((a: any) => a.date === day);
      return sum + (found?.mrs || 0);
    }, 0),
    issues: projects.reduce((sum, p) => {
      const found = p.activity?.find((a: any) => a.date === day);
      return sum + (found?.issues || 0);
    }, 0)
  }));

  // Dernier pipeline global (optionnel)
  let lastPipelineDate: string | undefined = undefined;
  let lastPipelineMsg: string | undefined = undefined;
  for (const p of projects) {
    if (Array.isArray(p.recentPipelines) && p.recentPipelines.length > 0) {
      const pipeline = p.recentPipelines[0];
      if (!lastPipelineDate || new Date(pipeline.startedAt) > new Date(lastPipelineDate)) {
        lastPipelineDate = pipeline.startedAt;
        lastPipelineMsg = pipeline.details?.commit?.message || 'Aucun pipeline récent';
      }
    }
  }

  // Badge de statut selon le nombre d'issues
  const getStatus = (issues: number) => {
    if (issues === 0) return { label: 'Healthy', color: 'bg-green-100 text-green-800' };
    if (issues < 10) return { label: 'Warning', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Critical', color: 'bg-red-100 text-red-800' };
  };
  const status = getStatus(totalIssues);

  if (loading) {
    return (
      <DashboardWidget
        id={id}
        title={title}
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
        title={title}
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

  return (
    <div className="dashboard-widget">
      <DashboardWidget
        id={id}
        title={title}
        tool="GitLab"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">GitLab</span>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
        <div className="flex flex-col gap-6 p-2 md:p-4">
          {/* Infos secondaires */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-gray-400">
            <span>Dernier pipeline : {lastPipelineMsg || '–'}</span>
            <span>Le {lastPipelineDate ? new Date(lastPipelineDate).toLocaleString() : '–'}</span>
          </div>
          {/* Chiffres clés */}
          <div className="grid grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <GitBranch className="w-7 h-7 mb-1 text-blue-500" />
              <span className="text-2xl font-extrabold tracking-tight">{totalPipelines}</span>
              <span className="text-xs text-gray-400 mt-1">Pipelines</span>
            </div>
            <div className="flex flex-col items-center">
              <GitCommit className="w-7 h-7 mb-1 text-green-500" />
              <span className="text-2xl font-extrabold tracking-tight">{totalCommits}</span>
              <span className="text-xs text-gray-400 mt-1">Commits</span>
            </div>
            <div className="flex flex-col items-center">
              <GitPullRequest className="w-7 h-7 mb-1 text-purple-500" />
              <span className="text-2xl font-extrabold tracking-tight">{totalMRs}</span>
              <span className="text-xs text-gray-400 mt-1">MRs</span>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-7 h-7 mb-1 text-yellow-500" />
              <span className="text-2xl font-extrabold tracking-tight">{totalStars}</span>
              <span className="text-xs text-gray-400 mt-1">Stars</span>
            </div>
          </div>
          {/* Mini-graphe personnalisable */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Commits par jour (7 jours)</h4>
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
                  <Line type="monotone" dataKey="commits" stroke="#22c55e" name="Commits" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={activity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="commits" fill="#22c55e" name="Commits" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </DashboardWidget>
    </div>
  );
} 