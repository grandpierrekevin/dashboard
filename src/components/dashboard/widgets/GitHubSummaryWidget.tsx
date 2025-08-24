import { DashboardWidget } from '../DashboardWidget';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GitCommit, GitPullRequest, AlertCircle, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface GitHubWidgetData {
  name: string;
  value: number;
  details: {
    stars: number;
    commits: number;
    prs: number;
    issues: number;
  };
  activity: {
    date: string;
    commits: number;
    prs: number;
    issues: number;
  }[];
}

export function GitHubSummaryWidget({ id, title, onRemove, onSettings }: { id: string; title: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'github' });
  const repos = Array.isArray(data) ? (data as GitHubWidgetData[]) : [];

  // Agrégation des données sur tous les dépôts
  const totalStars = repos.reduce((sum, repo) => sum + (repo.details?.stars || 0), 0);
  const totalCommits = repos.reduce((sum, repo) => sum + (repo.details?.commits || 0), 0);
  const totalPRs = repos.reduce((sum, repo) => sum + (repo.details?.prs || 0), 0);
  const totalIssues = repos.reduce((sum, repo) => sum + (repo.details?.issues || 0), 0);

  // Agrégation de l'activité pour le graphique
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activity = days.map(day => ({
    date: day,
    commits: repos.reduce((sum, repo) => {
      const found = repo.activity?.find(a => a.date === day);
      return sum + (found?.commits || 0);
    }, 0),
    prs: repos.reduce((sum, repo) => {
      const found = repo.activity?.find(a => a.date === day);
      return sum + (found?.prs || 0);
    }, 0),
    issues: repos.reduce((sum, repo) => {
      const found = repo.activity?.find(a => a.date === day);
      return sum + (found?.issues || 0);
    }, 0)
  }));

  if (error) {
    return (
      <DashboardWidget id={id} title={title} tool="GitHub" onRemove={onRemove} onSettings={onSettings}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "Une erreur est survenue lors du chargement des données GitHub"}
          </AlertDescription>
        </Alert>
      </DashboardWidget>
    );
  }

  if (loading) {
    return (
      <DashboardWidget id={id} title={title} tool="GitHub" onRemove={onRemove} onSettings={onSettings}>
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

  if (!repos.length) {
    return (
      <DashboardWidget id={id} title={title} tool="GitHub" onRemove={onRemove} onSettings={onSettings}>
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Aucune donnée disponible</span>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget id={id} title={title} tool="GitHub" onRemove={onRemove} onSettings={onSettings}>
      <div className="w-full h-full flex flex-col min-h-[220px] p-4">
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-6 w-full text-center items-center justify-items-center flex-none">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <GitCommit className="w-7 h-7 mb-1 text-green-500 group-hover:text-green-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{totalCommits}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Commits</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre total de commits</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <GitPullRequest className="w-7 h-7 mb-1 text-purple-500 group-hover:text-purple-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{totalPRs}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">PRs</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre total de pull requests</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <AlertCircle className="w-7 h-7 mb-1 text-orange-500 group-hover:text-orange-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{totalIssues}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Issues</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre total d'issues</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <Star className="w-7 h-7 mb-1 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{totalStars}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Stars</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre total d'étoiles</TooltipContent>
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
              <Line type="monotone" dataKey="prs" stroke="#a855f7" name="PRs" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="issues" stroke="#f97316" name="Issues" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardWidget>
  );
} 