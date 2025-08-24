import { DashboardWidget } from '../DashboardWidget';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GitCommit, GitPullRequest, AlertCircle, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GitlabData, ProjectStats } from '@/types/gitlab';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function GitLabSummaryWidget({ id, title, onRemove, onSettings }: { id: string; title: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'gitlab' });
  const summary = (Array.isArray(data) ? data[0] : data) as unknown as GitlabData | undefined;

  // Données de fallback
  const fallbackStats: ProjectStats = {
    totalPipelines: 0,
    totalMRs: 0,
    totalIssues: 0,
    contributors: 0,
    lastUpdated: new Date().toISOString()
  };

  const stats = summary?.stats || fallbackStats;
  const commits = summary?.recentPipelines?.length ?? 0;
  const mrs = stats.totalMRs;
  const issues = stats.totalIssues;
  const contributors = stats.contributors;

  // Agrégation de l'activité pour le graphique
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activity = days.map(day => ({
    date: day,
    commits: summary?.activity?.find(a => a.date === day)?.commits || 0
  }));

  if (error) {
    return (
      <DashboardWidget id={id} title={title} tool="GitLab" onRemove={onRemove} onSettings={onSettings}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "Une erreur est survenue lors du chargement des données GitLab"}
          </AlertDescription>
        </Alert>
      </DashboardWidget>
    );
  }

  if (loading) {
    return (
      <DashboardWidget id={id} title={title} tool="GitLab" onRemove={onRemove} onSettings={onSettings}>
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

  if (!summary) {
    return (
      <DashboardWidget id={id} title={title} tool="GitLab" onRemove={onRemove} onSettings={onSettings}>
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Aucune donnée disponible</span>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget id={id} title={title} tool="GitLab" onRemove={onRemove} onSettings={onSettings}>
      <div className="w-full h-full flex flex-col min-h-[220px] p-4">
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-6 w-full text-center items-center justify-items-center flex-none">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <GitCommit className="w-7 h-7 mb-1 text-green-500 group-hover:text-green-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{commits}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Pipelines</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre de pipelines récents</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <GitPullRequest className="w-7 h-7 mb-1 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{mrs}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">MRs</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre total de merge requests</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <AlertCircle className="w-7 h-7 mb-1 text-orange-500 group-hover:text-orange-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{issues}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Issues</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre total d'issues</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <Users className="w-7 h-7 mb-1 text-purple-500 group-hover:text-purple-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{contributors}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Contributeurs</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre de contributeurs</TooltipContent>
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
              <Line type="monotone" dataKey="commits" stroke="#22c55e" name="Commits" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardWidget>
  );
} 